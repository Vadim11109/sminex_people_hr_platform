import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function HrLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!session.user.roles.includes('HR')) redirect('/')

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
