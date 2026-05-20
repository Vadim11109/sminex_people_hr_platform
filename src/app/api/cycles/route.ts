import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cycles = await prisma.assessmentCycle.findMany({
      include: {
        template: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        _count: { select: { assignments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(cycles)
  } catch {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      name: string
      templateId: string
      startsAt: string
      endsAt: string
      createdById: string
    }

    const cycle = await prisma.assessmentCycle.create({
      data: {
        name: body.name,
        templateId: body.templateId,
        startsAt: new Date(body.startsAt),
        endsAt: new Date(body.endsAt),
        createdById: body.createdById,
        status: 'DRAFT',
      },
      include: {
        template: { select: { id: true, name: true } },
        _count: { select: { assignments: true } },
      },
    })
    return NextResponse.json(cycle, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Create failed' }, { status: 500 })
  }
}
