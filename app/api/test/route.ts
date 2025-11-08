import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const workOrderCount = await prisma.workOrder.count()
    
    return NextResponse.json({
      message: 'Database connection successful',
      data: {
        users: userCount,
        workOrders: workOrderCount
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  }
}