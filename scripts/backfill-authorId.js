#!/usr/bin/env node
/*
  Backfill migration: add `authorId` to `posts` and `blogs` documents when missing.

  Usage:
    FIREBASE_SERVICE_ACCOUNT_JSON='{"type":...}' node scripts/backfill-authorId.js --dry-run
    OR set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.

  Options:
    --dry-run    Only log actions, do not write to Firestore (default: true)
    --run        Perform writes
    --limit=N    Limit number of docs processed per collection (optional)
*/

const admin = require('firebase-admin')
const dotenv = require('dotenv')
dotenv.config('../env.local')

const argv = process.argv.slice(2)
const runFlag = argv.includes('--run')
const dryRun = !runFlag
const limitArg = argv.find((a) => a.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null

function initAdmin() {
  if (admin.apps && admin.apps.length) return
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const obj = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    admin.initializeApp({ credential: admin.credential.cert(obj) })
    return
  }

  // Fallback to ADC (GOOGLE_APPLICATION_CREDENTIALS) or environment
  admin.initializeApp()
}

async function processCollection(db, collectionName) {
  console.log('\nScanning collection:', collectionName)
  const snapshot = await db.collection(collectionName).get()
  console.log('Total documents in', collectionName, '=', snapshot.size)

  const candidates = []
  snapshot.forEach((doc) => {
    const data = doc.data()
    if (!data) return
    // Missing or falsy authorId
    if (!data.authorId) {
      candidates.push({ id: doc.id, data })
    }
  })

  console.log('Found', candidates.length, 'documents without authorId in', collectionName)

  if (limit) candidates.splice(limit)

  let updated = 0
  let notFoundUsers = 0
  let errors = 0

  for (const item of candidates) {
    const { id, data } = item
    const username = data.authorUsername || data.author || null
    if (!username) {
      console.log(`[skip] ${collectionName}/${id} has no authorUsername or author`)
      notFoundUsers++
      continue
    }

    try {
      const usersRef = db.collection('users')
      const q = usersRef.where('username', '==', username).limit(1)
      const userSnap = await q.get()
      if (userSnap.empty) {
        console.log(`[no-user] ${collectionName}/${id} -> username=${username} (no matching user)`)
        notFoundUsers++
        continue
      }

      const userDoc = userSnap.docs[0]
      const authorId = userDoc.id

      console.log(`${dryRun ? '[dry-run]' : '[update]'} ${collectionName}/${id} -> authorId=${authorId} (username=${username})`)
      if (!dryRun) {
        await db.collection(collectionName).doc(id).update({ authorId })
      }

      updated++
    } catch (err) {
      console.error('[error]', collectionName, id, err && err.message ? err.message : err)
      errors++
    }
  }

  console.log(`Finished ${collectionName}: updated=${updated} missingUsers=${notFoundUsers} errors=${errors}`)
  return { updated, notFoundUsers, errors }
}

async function processPostSubcollections(db) {
  console.log('\nScanning post subcollections: comments and likes')
  const postsSnap = await db.collection('posts').get()
  console.log('Total posts to scan for subcollections =', postsSnap.size)

  let commentsUpdated = 0
  let likesUpdated = 0
  let commentsNotFound = 0
  let likesNotFound = 0
  let errors = 0

  for (const postDoc of postsSnap.docs) {
    const postId = postDoc.id
    try {
      // COMMENTS
      const commentsSnap = await db.collection('posts').doc(postId).collection('comments').get()
      for (const c of commentsSnap.docs) {
        const data = c.data() || {}
        if (data.authorId) continue

        // Try to resolve by username field, then by userId (could be email or uid)
        let resolvedId = null
        try {
          if (data.username) {
            const q = await db.collection('users').where('username', '==', data.username).limit(1).get()
            if (!q.empty) resolvedId = q.docs[0].id
          }
          if (!resolvedId && data.userId) {
            const maybe = data.userId
            if (typeof maybe === 'string' && maybe.includes('@')) {
              const q2 = await db.collection('users').where('email', '==', maybe).limit(1).get()
              if (!q2.empty) resolvedId = q2.docs[0].id
            } else if (typeof maybe === 'string') {
              // Could already be a UID
              const userDoc = await db.collection('users').doc(maybe).get()
              if (userDoc.exists) resolvedId = userDoc.id
            }
          }
        } catch (e) {
          console.warn('Comment lookup error', postId, c.id, e && e.message ? e.message : e)
        }

        if (resolvedId) {
          console.log(`${dryRun ? '[dry-run]' : '[update]'} posts/${postId}/comments/${c.id} -> authorId=${resolvedId}`)
          if (!dryRun) await db.collection('posts').doc(postId).collection('comments').doc(c.id).update({ authorId: resolvedId })
          commentsUpdated++
        } else {
          commentsNotFound++
        }
      }

      // LIKES
      const likesSnap = await db.collection('posts').doc(postId).collection('likes').get()
      for (const l of likesSnap.docs) {
        const ldata = l.data() || {}
        if (ldata.authorId) continue

        let resolvedId = null
        try {
          // Like doc id may be a uid or email; try doc id first
          const docId = l.id
          const userCandidate = await db.collection('users').doc(docId).get()
          if (userCandidate.exists) resolvedId = userCandidate.id

          if (!resolvedId && ldata.userId) {
            const maybe = ldata.userId
            if (typeof maybe === 'string' && maybe.includes('@')) {
              const q = await db.collection('users').where('email', '==', maybe).limit(1).get()
              if (!q.empty) resolvedId = q.docs[0].id
            } else if (typeof maybe === 'string') {
              const ud = await db.collection('users').doc(maybe).get()
              if (ud.exists) resolvedId = ud.id
            }
          }
        } catch (e) {
          console.warn('Like lookup error', postId, l.id, e && e.message ? e.message : e)
        }

        if (resolvedId) {
          console.log(`${dryRun ? '[dry-run]' : '[update]'} posts/${postId}/likes/${l.id} -> authorId=${resolvedId}`)
          if (!dryRun) await db.collection('posts').doc(postId).collection('likes').doc(l.id).update({ authorId: resolvedId })
          likesUpdated++
        } else {
          likesNotFound++
        }
      }
    } catch (e) {
      console.error('[error] scanning subcollections for post', postId, e && e.message ? e.message : e)
      errors++
    }
  }

  console.log(`Finished post subcollections: commentsUpdated=${commentsUpdated} commentsNotFound=${commentsNotFound} likesUpdated=${likesUpdated} likesNotFound=${likesNotFound} errors=${errors}`)
  return { commentsUpdated, commentsNotFound, likesUpdated, likesNotFound, errors }
}

async function run() {
  initAdmin()
  const db = admin.firestore()

  console.log('Starting backfill-authorId (dryRun=%s) limit=%s', dryRun, limit || 'none')

  const results = {
    posts: null,
    blogs: null,
  }

  try {
    results.posts = await processCollection(db, 'posts')
  } catch (e) {
    console.error('Failed processing posts:', e && e.message ? e.message : e)
  }

  try {
    results.blogs = await processCollection(db, 'blogs')
  } catch (e) {
    console.error('Failed processing blogs:', e && e.message ? e.message : e)
  }

  try {
    results.postSubcollections = await processPostSubcollections(db)
  } catch (e) {
    console.error('Failed processing post subcollections:', e && e.message ? e.message : e)
  }

  console.log('\nSummary:')
  console.log('posts:', results.posts)
  console.log('blogs:', results.blogs)
  console.log('postSubcollections:', results.postSubcollections)

  console.log('\nBackfill finished.')
}

run().catch((err) => {
  console.error('Backfill failed:', err)
  process.exit(2)
})
