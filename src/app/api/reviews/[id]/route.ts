import { NextResponse } from 'next/server'
import { currentEmail } from '@/lib/current-user'
import { prisma } from '@/lib/prisma'

async function load(id: string) {
  const email = await currentEmail()
  const r = await prisma.externalReview.findUnique({
    where: { id },
    select: {
      id: true, role: true, email: true, answers: true, generalNote: true, status: true,
      assignment: { select: { employeeId: true, cycle: { select: { name: true } } } },
    },
  })
  return { email, r }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { email, r } = await load(id)
    if (!r) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (!email || r.email.toLowerCase() !== email) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    const emp = await prisma.user.findUnique({ where: { id: r.assignment.employeeId }, select: { name: true, email: true } })
    return NextResponse.json({
      id: r.id,
      role: r.role,
      answers: (r.answers as Record<string, number>) ?? {},
      generalNote: r.generalNote ?? '',
      status: r.status,
      cycleName: r.assignment.cycle.name,
      subjectName: emp?.name ?? emp?.email ?? '—',
    })
  } catch {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { email, r } = await load(id)
    if (!r) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (!email || r.email.toLowerCase() !== email) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    const body = await req.json() as { answers?: Record<string, number>; generalNote?: string }
    await prisma.externalReview.update({
      where: { id },
      data: {
        answers: body.answers ?? {},
        generalNote: body.generalNote ?? null,
        status: r.status === 'NOT_STARTED' ? 'IN_PROGRESS' : r.status,
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'save failed' }, { status: 500 })
  }
}
