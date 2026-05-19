import { Sidebar } from '@/components/layout/Sidebar'

// AUTH DISABLED — dev mode
const mockSession = { user: { id: 'dev', name: 'Dev Manager', email: 'manager@sminex.ru', roles: ['MANAGER', 'EMPLOYEE'] as never } }

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const session = mockSession

  const navItems = [
    { href: '/manager', icon: '👥', label: 'Моя команда' },
    { href: '/manager/pending', icon: '✏️', label: 'Ожидают оценки', badge: 2 },
    { href: '/manager/results', icon: '📊', label: 'Результаты' },
  ]

  return (
    <div className="app-shell">
      <Sidebar user={session.user} role="MANAGER" navItems={navItems} />
      <div className="main-area">{children}</div>
    </div>
  )
}
