/**
 * Simple script to check Firebase quota status
 * Run with: node scripts/check-firebase-quota.js
 */

async function checkQuotaStatus() {
  try {
    console.log('Checking Firebase quota status...')
    
    const response = await fetch('http://localhost:3000/api/messages/conversations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (response.status === 503 && data.code === 'QUOTA_EXCEEDED') {
      console.log('❌ Firebase quota is still exceeded')
      console.log('⏰ Firebase quotas reset daily at midnight Pacific Time')
      console.log('💡 Consider upgrading to Blaze plan for higher quotas')
      return false
    } else if (response.status === 401) {
      console.log('ℹ️  Quota check requires authentication, but endpoint is responding')
      return true
    } else if (response.ok) {
      console.log('✅ Firebase quota is restored and working')
      return true
    } else {
      console.log(`⚠️  Unexpected response: ${response.status} - ${data.error}`)
      return false
    }
  } catch (error) {
    console.error('❌ Error checking quota:', error.message)
    return false
  }
}

async function main() {
  const isWorking = await checkQuotaStatus()
  
  if (!isWorking) {
    console.log('\n📋 What you can do:')
    console.log('1. Wait for quota reset (midnight Pacific Time)')
    console.log('2. Upgrade Firebase plan for higher limits')
    console.log('3. Use optimizations we just implemented to reduce usage')
    console.log('\n🔧 Optimizations implemented:')
    console.log('- Reduced polling from 2s to 10s')
    console.log('- Added client-side caching (2 min TTL)')
    console.log('- Batch user queries instead of individual requests')
    console.log('- Auto-pause polling on quota errors')
  }
}

main().catch(console.error)