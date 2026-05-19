import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!session.user.roles.includes('MANAGER')) redirect('/')

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
