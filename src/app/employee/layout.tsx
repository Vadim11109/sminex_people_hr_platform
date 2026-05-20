import { Sidebar } from '@/components/layout/Sidebar'

// AUTH DISABLED — dev mode
const mockSession = { user: { id: 'dev', name: 'Dev Employee', email: 'employee@sminex.ru', roles: ['EMPLOYEE'] as never } }

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const session = mockSession

  const navItems = [
    { href: '/employee', label: 'Мои ассесменты', badge: 1 },
    { href: '/employee/history', label: 'История' },
  ]

  return (
    <div className="app-shell">
      <Sidebar user={session.user} role="EMPLOYEE" navItems={navItems} />
      <div className="main-area">{children}</div>
    </div>
  )
}
