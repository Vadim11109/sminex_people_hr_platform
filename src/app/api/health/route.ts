import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Liveness/readiness probe for orchestrators (k8s, Docker healthcheck, LB).
// Returns 200 when the app is up and the database is reachable, 503 otherwise.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', db: 'up', time: new Date().toISOString() })
  } catch {
    return NextResponse.json(
      { status: 'degraded', db: 'down', time: new Date().toISOString() },
      { status: 503 },
    )
  }
}
