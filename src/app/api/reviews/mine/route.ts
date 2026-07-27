import { NextResponse } from 'next/server'
import { currentEmail } from '@/lib/current-user'
import { prisma } from '@/lib/prisma'

// «Мои опросы» — внешние оценки (заказчик / РЦЭ), назначенные текущему пользователю.
// Доступ по email-участию, а не по роли.
export async function GET() {
  try {
    const email = await currentEmail()

    const rows = await prisma.externalReview.findMany({
      where: { email, assignment: { cycle: { status: { not: 'CLOSED' } } } },
      select: {
        id: true, role: true, status: true,
        assignment: { select: { employeeId: true, cycle: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const empIds = [...new Set(rows.map(r => r.assignment.employeeId))]
    const emps = await prisma.user.findMany({
      where: { id: { in: empIds } },
      select: { id: true, name: true, email: true },
    })
    const nameById = new Map(emps.map(e => [e.id, e.name ?? e.email]))

    return NextResponse.json(rows.map(r => ({
      id: r.id,
      role: r.role,
      status: r.status,
      cycleName: r.assignment.cycle.name,
      subjectName: nameById.get(r.assignment.employeeId) ?? '—',
    })))
  } catch {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  }
}
