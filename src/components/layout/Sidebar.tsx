'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { UserRole } from '@prisma/client'

interface NavItem {
  href: string
  icon: string
  label: string
  badge?: number
}

interface SidebarProps {
  user: { name?: string | null; email?: string | null; roles: UserRole[] }
  role: UserRole
  navItems: NavItem[]
}

function initials(name?: string | null) {
  if (!name) return '??'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const avatarCls: Record<UserRole, string> = {
  EMPLOYEE: 'avatar-purple',
  MANAGER: '',
  HR: 'avatar-green',
}

const rolePillCls: Record<UserRole, string> = {
  EMPLOYEE: 'role-pill-employee',
  MANAGER: 'role-pill-manager',
  HR: 'role-pill-hr',
}

const roleLabel: Record<UserRole, string> = {
  EMPLOYEE: 'Сотрудник',
  MANAGER: 'Руководитель',
  HR: 'HR',
}

export function Sidebar({ user, role, navItems }: SidebarProps) {
  const pathname = usePathname()
  const hasMultipleRoles = user.roles.length > 1

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-name">Sminex People</div>
        <div className="sidebar-logo-sub">HR Platform</div>
      </div>

      <nav className="nav-section" style={{ flex: 1 }}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? (
              <span style={{ background: 'var(--blue)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '2px' }}>
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className={`avatar ${avatarCls[role]}`}>{initials(user.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name ?? user.email}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--hint)' }}>
              <span className={`role-pill ${rolePillCls[role]}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                {roleLabel[role]}
              </span>
            </div>
          </div>
        </div>

        {hasMultipleRoles && (
          <Link
            href="/select-role"
            style={{
              display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.75rem',
              padding: '5px 8px', borderRadius: '3px', border: '1px solid var(--border)',
              background: 'var(--surface2)', fontSize: '11px', color: 'var(--muted)',
              cursor: 'pointer', textDecoration: 'none', transition: 'all .15s',
            }}
          >
            <span>⇆</span> Сменить режим
          </Link>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          style={{
            display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.5rem',
            padding: '5px 8px', borderRadius: '3px', border: 'none',
            background: 'transparent', fontSize: '11px', color: 'var(--hint)',
            cursor: 'pointer', width: '100%',
          }}
        >
          <span>→</span> Выйти
        </button>
      </div>
    </aside>
  )
}
