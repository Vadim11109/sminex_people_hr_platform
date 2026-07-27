import { auth } from './auth'

// В демо авторизация отключена (mock-сессии по секциям в layout'ах). Для «Мои опросы»
// и назначения оценщиков используем демо-личность сотрудника — тот же email, что в
// employee-layout, чтобы поток «назначил → прошёл опрос» замыкался. Если реальный auth
// включат — берём email из сессии.
export const DEMO_REVIEWER_EMAIL = 'employee@sminex.ru'

export async function currentEmail(): Promise<string> {
  try {
    const session = await auth()
    return (session?.user?.email ?? DEMO_REVIEWER_EMAIL).toLowerCase()
  } catch {
    return DEMO_REVIEWER_EMAIL
  }
}
