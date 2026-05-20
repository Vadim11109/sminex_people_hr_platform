'use client'

import { useEffect, useState, useCallback } from 'react'
import type { UserRole } from '@prisma/client'

interface UserRow {
  id: string
  name: string | null
  email: string
  roles: UserRole[]
  team: string | null
  position: string | null
  createdAt: string
  manager: { id: string; name: string | null; email: string } | null
  _count: { reports: number }
}

// ── Mock org structure (shown when DB is not connected) ───────────────
const MOCK_DEPARTMENTS: { dept: string; manager: string; position: string; members: { name: string; position: string }[] }[] = [
  {
    dept: 'IT-продукты',
    manager: 'Алексей Воронов',
    position: 'Руководитель IT-продуктов',
    members: [
      { name: 'Анна Сидорова',    position: 'Product Owner' },
      { name: 'Иван Петров',      position: 'Product Owner' },
      { name: 'Мария Козлова',    position: 'Backend разработчик' },
      { name: 'Дмитрий Лебедев', position: 'Frontend разработчик' },
    ],
  },
  {
    dept: 'Строительство',
    manager: 'Сергей Никитин',
    position: 'Директор по строительству',
    members: [
      { name: 'Павел Смирнов',    position: 'BIM-менеджер' },
      { name: 'Елена Фёдорова',   position: 'Инженер-строитель' },
      { name: 'Роман Захаров',    position: 'Инженер-строитель' },
      { name: 'Ольга Титова',     position: 'Менеджер по охране труда' },
    ],
  },
  {
    dept: 'Коммерческий отдел',
    manager: 'Наталья Громова',
    position: 'Коммерческий директор',
    members: [
      { name: 'Кирилл Медведев',  position: 'Менеджер по продажам' },
      { name: 'Татьяна Белова',   position: 'Менеджер по продажам' },
      { name: 'Андрей Орлов',     position: 'Оценщик недвижимости' },
    ],
  },
  {
    dept: 'Финансы',
    manager: 'Виктор Соколов',
    position: 'Финансовый директор',
    members: [
      { name: 'Юлия Морозова',    position: 'Финансовый аналитик' },
      { name: 'Артём Новиков',    position: 'Финансовый аналитик' },
    ],
  },
  {
    dept: 'HR',
    manager: 'Светлана Волкова',
    position: 'HR-директор',
    members: [
      { name: 'Ирина Кузнецова',  position: 'HR-менеджер' },
      { name: 'Денис Попов',      position: 'HR-менеджер' },
    ],
  },
]

const ROLE_LABELS: Record<UserRole, string> = {
  EMPLOYEE: 'Сотрудник',
  MANAGER: 'Руководитель',
  HR: 'HR',
}

function initials(name?: string | null, email?: string) {
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (email ?? '??').slice(0, 2).toUpperCase()
}

// ── Inline role selector ─────────────────────────────────────────────
function RoleSelector({ userId, current, onSaved }: {
  userId: string; current: UserRole[]; onSaved: (roles: UserRole[]) => void
}) {
  const all: UserRole[] = ['EMPLOYEE', 'MANAGER', 'HR']
  const [saving, setSaving] = useState(false)

  async function toggle(role: UserRole) {
    const next = current.includes(role) ? current.filter(r => r !== role) : [...current, role]
    if (next.length === 0) return
    setSaving(true)
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roles: next }),
    })
    if (res.ok) onSaved((await res.json()).roles)
    setSaving(false)
  }

  const colors: Record<UserRole, { bg: string; color: string; border: string }> = {
    EMPLOYEE: { bg: 'var(--purple-bg)', color: 'var(--purple)', border: 'var(--purple-light)' },
    MANAGER:  { bg: 'var(--blue-bg)',   color: 'var(--blue)',   border: 'var(--blue-light)'   },
    HR:       { bg: 'var(--green-bg)',  color: 'var(--green)',  border: 'var(--green-light)'  },
  }

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', opacity: saving ? .5 : 1 }}>
      {all.map(r => {
        const active = current.includes(r)
        const c = colors[r]
        return (
          <button key={r} onClick={() => toggle(r)} style={{
            padding: '2px 8px', borderRadius: 2, fontSize: 10, fontWeight: 700,
            letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all .12s', border: '1px solid',
            background: active ? c.bg : 'transparent',
            color: active ? c.color : 'var(--hint)',
            borderColor: active ? c.border : 'var(--border)',
          }}>
            {ROLE_LABELS[r]}
          </button>
        )
      })}
    </div>
  )
}

// ── Inline manager selector ──────────────────────────────────────────
function ManagerSelector({ userId, current, allUsers, onSaved }: {
  userId: string; current: UserRow['manager']; allUsers: UserRow[]
  onSaved: (m: UserRow['manager']) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const managers = allUsers.filter(u => u.id !== userId && u.roles.includes('MANAGER'))

  async function pick(managerId: string | null) {
    setSaving(true); setOpen(false)
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ managerId }),
    })
    if (res.ok) onSaved((await res.json()).manager ?? null)
    setSaving(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        padding: '3px 9px', borderRadius: 3, fontSize: 12, cursor: 'pointer',
        fontFamily: 'inherit', transition: 'all .12s', border: '1px solid',
        background: current ? 'var(--surface2)' : 'var(--amber-bg)',
        color: current ? 'var(--text)' : 'var(--amber)',
        borderColor: current ? 'var(--border)' : 'var(--amber-light)',
        opacity: saving ? .5 : 1,
      }}>
        {saving ? '...' : current ? (current.name ?? current.email) : '— не назначен'}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 50,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,.12)',
            minWidth: 200, maxHeight: 240, overflowY: 'auto',
          }}>
            <button onClick={() => pick(null)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px',
              fontSize: 12, cursor: 'pointer', border: 'none',
              background: 'transparent', color: 'var(--hint)', fontFamily: 'inherit',
            }}>— Убрать руководителя</button>
            {managers.map(m => (
              <button key={m.id} onClick={() => pick(m.id)} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px',
                fontSize: 12, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                background: current?.id === m.id ? 'var(--blue-bg)' : 'transparent',
                color: current?.id === m.id ? 'var(--blue)' : 'var(--text)',
              }}>
                {m.name ?? m.email}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Mock org view (no DB) ────────────────────────────────────────────
function MockOrgView() {
  const totalMembers = MOCK_DEPARTMENTS.reduce((s, d) => s + d.members.length, 0)

  return (
    <div>
      <div style={{
        background: 'var(--amber-bg)', border: '1px solid var(--amber-light)',
        borderLeft: '3px solid var(--amber)', borderRadius: 'var(--radius)',
        padding: '.75rem 1.25rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '.75rem',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6" stroke="var(--amber)" strokeWidth="1.4"/>
          <rect x="6.3" y="6" width="1.4" height="4.5" rx=".7" fill="var(--amber)"/>
          <circle cx="7" cy="4" r=".85" fill="var(--amber)"/>
        </svg>
        <span style={{ fontSize: '12px', color: 'var(--amber)', lineHeight: 1.6 }}>
          <strong>База данных не подключена.</strong> Показана черновая структура компании.
          Реальные сотрудники появятся после подключения PostgreSQL и запуска{' '}
          <code style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,.06)', padding: '1px 5px', borderRadius: 2 }}>
            npx prisma migrate dev
          </code>
        </span>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--hint)', marginBottom: '1.25rem' }}>
        {MOCK_DEPARTMENTS.length} отделов · {totalMembers} сотрудников
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOCK_DEPARTMENTS.map(({ dept, manager, position, members }) => (
          <div key={dept} className="card">
            {/* Department header */}
            <div style={{
              padding: '.75rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{dept}</span>
                <span style={{ fontSize: '11px', color: 'var(--hint)' }}>{members.length} сотр.</span>
              </div>
              {/* Manager */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <div className="avatar" style={{ width: 24, height: 24, fontSize: '9px' }}>
                  {initials(manager)}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>{manager}</div>
                  <div style={{ fontSize: '10px', color: 'var(--hint)' }}>{position}</div>
                </div>
                <span style={{
                  fontSize: '9px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                  padding: '2px 7px', borderRadius: 2, border: '1px solid var(--blue-light)',
                  background: 'var(--blue-bg)', color: 'var(--blue)', marginLeft: 4,
                }}>Руководитель</span>
              </div>
            </div>

            {/* Members */}
            <div>
              {members.map((m, i) => (
                <div key={m.name} style={{
                  display: 'flex', alignItems: 'center', gap: '.75rem',
                  padding: '.625rem 1.25rem .625rem 2.5rem',
                  borderBottom: i < members.length - 1 ? '1px solid var(--border)' : undefined,
                }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border2)', flexShrink: 0 }} />
                  <div className="avatar avatar-purple" style={{ width: 26, height: 26, fontSize: '10px' }}>
                    {initials(m.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--hint)' }}>{m.position}</div>
                  </div>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: 2, border: '1px solid var(--purple-light)',
                    background: 'var(--purple-bg)', color: 'var(--purple)',
                  }}>Сотрудник</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────
export default function HrUsersPage() {
  const [users, setUsers]     = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [filter, setFilter]   = useState<'all' | 'no-manager'>('all')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setUsers)
      .catch(() => setError('db'))
      .finally(() => setLoading(false))
  }, [])

  const updateUser = useCallback((id: string, patch: Partial<UserRow>) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u)), [])

  const noManagerCount = users.filter(u => !u.manager && u.roles.includes('EMPLOYEE')).length

  const filtered = users.filter(u => {
    if (filter === 'no-manager' && (u.manager || !u.roles.includes('EMPLOYEE'))) return false
    if (search) {
      const q = search.toLowerCase()
      if (!(u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))) return false
    }
    return true
  })

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Сотрудники</h1>
          <span className="role-pill role-pill-hr">HR</span>
          {!loading && !error && (
            <span style={{ fontSize: '12px', color: 'var(--hint)' }}>{users.length} чел.</span>
          )}
        </div>
        {!error && (
          <input
            type="text" placeholder="Поиск по имени или email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 3,
              fontSize: 12, color: 'var(--text)', background: 'var(--surface2)',
              outline: 'none', fontFamily: 'inherit', width: 240,
            }}
          />
        )}
      </div>

      <div className="page-body">
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hint)', fontSize: 13 }}>
            Загрузка...
          </div>
        )}

        {error && <MockOrgView />}

        {!loading && !error && (
          <>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem' }}>
              {([
                ['all',        'Все'],
                ['no-manager', `Без руководителя${noManagerCount > 0 ? ` · ${noManagerCount}` : ''}`],
              ] as const).map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{
                  padding: '5px 14px', borderRadius: 3, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit', border: '1px solid',
                  background: filter === val ? 'var(--blue-bg)' : 'var(--surface)',
                  color: filter === val ? 'var(--blue)' : 'var(--muted)',
                  borderColor: filter === val ? 'var(--blue-light)' : 'var(--border)',
                  transition: 'all .12s',
                }}>{label}</button>
              ))}
            </div>

            <div className="card">
              <div className="card-body-flush">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Сотрудник</th>
                      <th>Роли</th>
                      <th>Руководитель</th>
                      <th>Команда</th>
                      <th>В системе с</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--hint)', padding: '2rem' }}>
                          {search ? 'Ничего не найдено' : 'Пользователей нет'}
                        </td>
                      </tr>
                    )}
                    {filtered.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                            <div className="avatar">{initials(u.name, u.email)}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name ?? '—'}</div>
                              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{u.email}</div>
                              {u._count.reports > 0 && (
                                <div style={{ fontSize: 10, color: 'var(--hint)', marginTop: 1 }}>
                                  {u._count.reports} подчинённых
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <RoleSelector userId={u.id} current={u.roles} onSaved={roles => updateUser(u.id, { roles })} />
                        </td>
                        <td>
                          <ManagerSelector userId={u.id} current={u.manager} allUsers={users} onSaved={manager => updateUser(u.id, { manager })} />
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{u.team ?? '—'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: 11, color: 'var(--hint)' }}>
                            {new Date(u.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
