import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true,
        roles: true, team: true, position: true,
        createdAt: true,
        manager: { select: { id: true, name: true, email: true } },
        _count: { select: { reports: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  }
}
