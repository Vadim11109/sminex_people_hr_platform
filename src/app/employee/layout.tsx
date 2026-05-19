import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!session.user.roles.includes('EMPLOYEE')) redirect('/')

  const navItems = [
    { href: '/employee', icon: '📋', label: 'Мои ассесменты', badge: 1 },
    { href: '/employee/history', icon: '📈', label: 'История' },
  ]

  return (
    <div className="app-shell">
      <Sidebar user={session.user} role="EMPLOYEE" navItems={navItems} />
      <div className="main-area">{children}</div>
    </div>
  )
}
