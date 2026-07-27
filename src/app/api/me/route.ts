import { NextResponse } from 'next/server'
import { currentEmail } from '@/lib/current-user'

// Текущий пользователь (для «Назначить меня оценщиком» и «Мои опросы»).
export async function GET() {
  const email = await currentEmail()
  return NextResponse.json({ email })
}
