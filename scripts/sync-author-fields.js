#!/usr/bin/env node
/**
 * scripts/sync-author-fields.js
 * Synchronize `authorUsername`, `author`, and `authorImage` on posts, blogs,
 * and post subcollections (comments, likes) from the `users` collection using
 * the canonical `authorId` field when present.
 *
 * Usage:
 *   node scripts/sync-author-fields.js --dry-run
 *   node scripts/sync-author-fields.js --run
 *   node scripts/sync-author-fields.js --limit=100 --run
 */

const admin = require('firebase-admin')
const dotenv = require('dotenv')
dotenv.config('../.env')

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
  admin.initializeApp()
}

async function syncCollection(db, collectionName) {
  console.log('\nScanning collection:', collectionName)
  const snap = await db.collection(collectionName).get()
  console.log('Total documents in', collectionName, '=', snap.size)

  const candidates = []
  snap.forEach((doc) => {
    const data = doc.data() || {}
    if (data.authorId) candidates.push({ id: doc.id, data })
  })

  if (limit) candidates.splice(limit)

  let updated = 0
  for (const item of candidates) {
    const { id, data } = item
    try {
      const userDoc = await db.collection('users').doc(data.authorId).get()
      if (!userDoc.exists) {
        // no matching user
        continue
      }
      const u = userDoc.data() || {}
      const newFields = {}
      if (u.username && u.username !== data.authorUsername) newFields.authorUsername = u.username
      if ((u.name || u.displayName) && (u.name || u.displayName) !== data.author) newFields.author = u.name || u.displayName
      if (u.image && u.image !== data.authorImage) newFields.authorImage = u.image

      if (Object.keys(newFields).length > 0) {
        console.log(`${dryRun ? '[dry-run]' : '[update]'} ${collectionName}/${id} ->`, newFields)
        if (!dryRun) await db.collection(collectionName).doc(id).update(newFields)
        updated++
      }
    } catch (e) {
      console.error('Error syncing', collectionName, id, e && e.message ? e.message : e)
    }
  }
  console.log(`Finished ${collectionName}: updated=${updated}`)
  return updated
}

async function syncPostSubcollections(db) {
  console.log('\nSyncing post subcollections (comments, likes)')
  const postsSnap = await db.collection('posts').get()
  let commentsUpdated = 0
  let likesUpdated = 0
  for (const p of postsSnap.docs) {
    const postId = p.id
    // comments
    const commentsSnap = await db.collection('posts').doc(postId).collection('comments').get()
    for (const c of commentsSnap.docs) {
      const data = c.data() || {}
      if (!data.authorId) continue
      try {
        const udoc = await db.collection('users').doc(data.authorId).get()
        if (!udoc.exists) continue
        const u = udoc.data() || {}
        const newFields = {}
        if (u.username && u.username !== data.username) newFields.username = u.username
        if (u.name && u.name !== data.name) newFields.name = u.name
        if (Object.keys(newFields).length > 0) {
          console.log(`${dryRun ? '[dry-run]' : '[update]'} posts/${postId}/comments/${c.id} ->`, newFields)
          if (!dryRun) await db.collection('posts').doc(postId).collection('comments').doc(c.id).update(newFields)
          commentsUpdated++
        }
      } catch (e) {
        console.error('Error syncing comment', postId, c.id, e && e.message ? e.message : e)
      }
    }

    // likes
    const likesSnap = await db.collection('posts').doc(postId).collection('likes').get()
    for (const l of likesSnap.docs) {
      const data = l.data() || {}
      if (!data.authorId) continue
      try {
        const udoc = await db.collection('users').doc(data.authorId).get()
        if (!udoc.exists) continue
        const u = udoc.data() || {}
        const newFields = {}
        if (u.username && u.username !== data.username) newFields.username = u.username
        if (Object.keys(newFields).length > 0) {
          console.log(`${dryRun ? '[dry-run]' : '[update]'} posts/${postId}/likes/${l.id} ->`, newFields)
          if (!dryRun) await db.collection('posts').doc(postId).collection('likes').doc(l.id).update(newFields)
          likesUpdated++
        }
      } catch (e) {
        console.error('Error syncing like', postId, l.id, e && e.message ? e.message : e)
      }
    }
  }
  console.log(`Finished post subcollections: commentsUpdated=${commentsUpdated} likesUpdated=${likesUpdated}`)
  return { commentsUpdated, likesUpdated }
}

async function main() {
  initAdmin()
  const db = admin.firestore()

  const results = {}
  results.posts = await syncCollection(db, 'posts')
  results.blogs = await syncCollection(db, 'blogs')
  results.subs = await syncPostSubcollections(db)

  console.log('\nSummary:', results)
}

main().catch((e) => {
  console.error('Sync failed:', e)
  process.exit(1)
})
