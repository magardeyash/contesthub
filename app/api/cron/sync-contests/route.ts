import { syncContests } from '@/app/actions'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[CRON] Starting automatic contest sync...')
    const result = await syncContests()
    
    console.log('[CRON] Sync completed:', result)
    
    return NextResponse.json({
      success: true,
      message: result.message,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Sync failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
