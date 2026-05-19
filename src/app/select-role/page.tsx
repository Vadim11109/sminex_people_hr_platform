import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { UserRole } from '@prisma/client'

const roleConfig: Record<UserRole, { label: string; tag: string; icon: string; desc: string; href: string; tagCls: string; cardCls: string }> = {
  EMPLOYEE: {
    label: 'Само-оценка',
    tag: 'Сотрудник',
    icon: '🧑‍💻',
    desc: 'Пройти ассесмент, посмотреть историю своих оценок',
    href: '/employee',
    tagCls: 'role-pill-employee',
    cardCls: 'role-emp',
  },
  MANAGER: {
    label: 'Оценка команды',
    tag: 'Руководитель',
    icon: '👥',
    desc: 'Оценить сотрудников, просмотреть gap-анализ и результаты',
    href: '/manager',
    tagCls: 'role-pill-manager',
    cardCls: 'role-mgr',
  },
  HR: {
    label: 'Аналитика и циклы',
    tag: 'HR',
    icon: '📊',
    desc: 'Управлять циклами, видеть все результаты и аналитику',
    href: '/hr',
    tagCls: 'role-pill-hr',
    cardCls: 'role-hr',
  },
}

export default async function SelectRolePage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const roles = session.user.roles
  // Single role → skip this page
  if (roles.length === 1) {
    redirect(roleConfig[roles[0]].href)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '580px', textAlign: 'center' }}>
        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.875rem', marginBottom: '1.75rem' }}>
          <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '16px' }}>
            {(session.user.name ?? '??').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{session.user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{session.user.email}</div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', fontWeight: 600, marginBottom: '.5rem' }}>
          В каком режиме работаем?
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '2rem' }}>
          У вас несколько ролей в системе — выберите, что хотите сделать прямо сейчас.
        </p>

        {/* Role cards — only assigned roles */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${roles.length}, 1fr)`, gap: '1rem', maxWidth: '520px', margin: '0 auto' }}>
          {roles.map(role => {
            const cfg = roleConfig[role]
            return (
              <a
                key={role}
                href={cfg.href}
                style={{
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '2rem 1.5rem',
                  textAlign: 'left',
                  textDecoration: 'none',
                  display: 'block',
                  position: 'relative',
                  transition: 'all .18s',
                }}
              >
                <span className={`role-pill ${cfg.tagCls}`} style={{ fontSize: '10px', display: 'inline-block', marginBottom: '.875rem' }}>
                  {cfg.tag}
                </span>
                <div style={{ fontSize: '28px', marginBottom: '1rem' }}>{cfg.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '.375rem' }}>{cfg.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{cfg.desc}</div>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--hint)', fontSize: '18px' }}>›</div>
              </a>
            )
          })}
        </div>

        <p style={{ marginTop: '1.75rem', fontSize: '12px', color: 'var(--hint)', display: 'flex', alignItems: 'center', gap: '.5rem', justifyContent: 'center' }}>
          🔒 Роли назначаются HR-администратором · изменить самостоятельно нельзя
        </p>
      </div>
    </div>
  )
}
