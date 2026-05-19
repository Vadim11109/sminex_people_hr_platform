import { Sidebar } from '@/components/layout/Sidebar'

// AUTH DISABLED — dev mode
const mockSession = { user: { id: 'dev', name: 'Dev HR', email: 'hr@sminex.ru', roles: ['HR', 'MANAGER', 'EMPLOYEE'] as never } }

export default async function HrLayout({ children }: { children: React.ReactNode }) {
  const session = mockSession

  const navItems = [
    { href: '/hr', icon: '📊', label: 'Дашборд' },
    { href: '/hr/cycles', icon: '🔄', label: 'Циклы оценки' },
    { href: '/hr/users', icon: '👤', label: 'Сотрудники' },
    { href: '/hr/analytics', icon: '📈', label: 'Аналитика' },
    { href: '/hr/templates', icon: '📋', label: 'Шаблоны' },
  ]

  return (
    <div className="app-shell">
      <Sidebar user={session.user} role="HR" navItems={navItems} />
      <div className="main-area">{children}</div>
    </div>
  )
}
