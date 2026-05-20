import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — return list of selectable participants (employees with a manager)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cycleId } = await params

    // Already assigned in this cycle
    const existing = await prisma.assignment.findMany({
      where: { cycleId },
      select: { employeeId: true },
    })
    const assignedIds = new Set(existing.map(a => a.employeeId))

    // All employees with a manager, grouped
    const employees = await prisma.user.findMany({
      where: { roles: { has: 'EMPLOYEE' }, managerId: { not: null } },
      select: {
        id: true, name: true, email: true, team: true,
        manager: { select: { id: true, name: true, email: true } },
      },
      orderBy: { name: 'asc' },
    })

    // Group by manager
    const byManager = new Map<string, {
      manager: { id: string; name: string | null; email: string }
      employees: typeof employees
    }>()

    for (const emp of employees) {
      const mgr = emp.manager!
      if (!byManager.has(mgr.id)) byManager.set(mgr.id, { manager: mgr, employees: [] })
      byManager.get(mgr.id)!.employees.push(emp)
    }

    return NextResponse.json({
      groups: Array.from(byManager.values()),
      alreadyAssigned: [...assignedIds],
    })
  } catch {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  }
}

// POST — create assignments for selected employees and activate cycle
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cycleId } = await params
    const { employeeIds } = await req.json() as { employeeIds: string[] }

    if (!employeeIds || employeeIds.length === 0) {
      return NextResponse.json({ error: 'No participants selected' }, { status: 400 })
    }

    const cycle = await prisma.assessmentCycle.findUniqueOrThrow({ where: { id: cycleId } })
    if (cycle.status === 'CLOSED') {
      return NextResponse.json({ error: 'Cycle is closed' }, { status: 400 })
    }

    // Fetch manager info for each selected employee
    const employees = await prisma.user.findMany({
      where: { id: { in: employeeIds }, managerId: { not: null } },
      select: { id: true, managerId: true },
    })

    await prisma.$transaction([
      // Activate cycle (if still draft)
      prisma.assessmentCycle.update({
        where: { id: cycleId },
        data: { status: 'ACTIVE' },
      }),
      // Upsert assignments (skip if already exists)
      ...employees.map(emp =>
        prisma.assignment.upsert({
          where: { cycleId_employeeId: { cycleId, employeeId: emp.id } },
          create: { cycleId, employeeId: emp.id, managerId: emp.managerId! },
          update: {},
        })
      ),
    ])

    return NextResponse.json({ ok: true, created: employees.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Launch failed' }, { status: 500 })
  }
}
