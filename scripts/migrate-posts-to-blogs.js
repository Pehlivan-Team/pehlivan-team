#!/usr/bin/env node
/*
  One-off migration script: copy documents from `posts` -> `blogs` when
  `isBlog === true` OR `isPublished === true`.

  Usage:
    FIREBASE_SERVICE_ACCOUNT_JSON='{"type":...}' node scripts/migrate-posts-to-blogs.js --dry-run
    OR set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.

  Options:
    --dry-run    Only log actions, do not write to Firestore (default: true)
    --limit=N    Limit number of docs processed (optional)
 */

const admin = require('firebase-admin')
const dotenv = require('dotenv')
dotenv.config("../env.local")

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run') || argv.indexOf('--dry-run') === -1 && argv.indexOf('--run') === -1
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

async function run() {
  initAdmin()
  const db = admin.firestore()

  console.log('Starting migration (dryRun=%s) limit=%s', dryRun, limit || 'none')

  const set = new Map()

  // Query isBlog === true
  try {
    const snap1 = await db.collection('posts').where('isBlog', '==', true).get()
    snap1.forEach((d) => set.set(d.id, d))
  } catch (e) {
    console.warn('Query isBlog failed (continuing):', e.message || e)
  }

  // Query isPublished === true
  try {
    const snap2 = await db.collection('posts').where('isPublished', '==', true).get()
    snap2.forEach((d) => set.set(d.id, d))
  } catch (e) {
    console.warn('Query isPublished failed (continuing):', e.message || e)
  }

  const docs = Array.from(set.values())
  console.log('Found', docs.length, 'candidate post documents to migrate.')
  if (limit) docs.splice(limit)

  let migrated = 0
  let skippedExists = 0
  let errors = 0

  for (const docSnap of docs) {
    const id = docSnap.id
    const data = docSnap.data()

    const slug = data.slug || id

    try {
      const existing = await db.collection('blogs').where('slug', '==', slug).limit(1).get()
      if (!existing.empty) {
        console.log(`[skip] blog with slug=${slug} already exists; docId=${id}`)
        skippedExists++
        continue
      }

      const payload = {
        title: data.title || null,
        slug,
        content: data.content || null,
        imageUrl: data.imageUrl || null,
        author: data.author || null,
        authorUsername: data.authorUsername || data.author || null,
        authorImage: data.authorImage || null,
        status: data.status || (data.isPublished ? 'PUBLISHED' : 'PENDING'),
        isPublished: Boolean(data.isPublished),
        createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: data.updatedAt || admin.firestore.FieldValue.serverTimestamp(),
      }

      console.log(`${dryRun ? '[dry-run] would create' : '[create]'} blogs/${id} (slug=${slug})`)
      if (!dryRun) {
        await db.collection('blogs').doc(id).set(payload)
      }

      migrated++
    } catch (err) {
      console.error('[error] docId=', id, err && err.message ? err.message : err)
      errors++
    }
  }

  console.log('Migration finished. migrated=%d skippedExists=%d errors=%d', migrated, skippedExists, errors)
  process.exit(0)
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(2)
})
