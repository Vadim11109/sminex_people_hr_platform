import { NextResponse } from 'next/server'
import { currentEmail } from '@/lib/current-user'
import { prisma } from '@/lib/prisma'

// Отправка внешней оценки (заказчик / РЦЭ). Авторизация по email-участию.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const email = await currentEmail()
    const r = await prisma.externalReview.findUnique({ where: { id }, select: { email: true } })
    if (!r) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (!email || r.email.toLowerCase() !== email) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    await prisma.externalReview.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'submit failed' }, { status: 500 })
  }
}
