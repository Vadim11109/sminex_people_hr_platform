import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@prisma/client'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json() as {
      roles?: UserRole[]
      managerId?: string | null
      team?: string
      position?: string
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.roles     !== undefined && { roles: body.roles }),
        ...(body.managerId !== undefined && { managerId: body.managerId }),
        ...(body.team      !== undefined && { team: body.team }),
        ...(body.position  !== undefined && { position: body.position }),
      },
      select: {
        id: true, name: true, email: true,
        roles: true, team: true, position: true,
        manager: { select: { id: true, name: true } },
      },
    })
    return NextResponse.json(user)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
