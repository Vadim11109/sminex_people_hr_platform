'use client'

import { useEffect, useState } from 'react'

interface Cycle {
  id: string
  name: string
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED'
  startsAt: string
  endsAt: string | null
  template: { id: string; name: string } | null
  createdBy: { id: string; name: string | null }
  _count: { assignments: number }
}

interface EmpRow {
  id: string
  name: string | null
  email: string
  team: string | null
  manager: { id: string; name: string | null; email: string }
}

interface Group {
  manager: { id: string; name: string | null; email: string }
  employees: EmpRow[]
}

const STATUS_LABEL = { DRAFT: 'Черновик', ACTIVE: 'Активный', CLOSED: 'Завершён' }
const STATUS_CLS   = { DRAFT: 'status-pending', ACTIVE: 'status-progress', CLOSED: 'status-done' }

function fmtDate(s: string | null) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function initials(name?: string | null, email?: string) {
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (email ?? '??').slice(0, 2).toUpperCase()
}

// ── Create cycle modal ───────────────────────────────────────────────
function CreateModal({ onClose, onCreated }: {
  onClose: () => void; onCreated: (c: Cycle) => void
}) {
  const [form, setForm] = useState({ name: '', startsAt: '', endsAt: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.startsAt || !form.endsAt) { setErr('Заполните все поля'); return }
    setSaving(true); setErr('')
    const res = await fetch('/api/cycles', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, templateId: 'default', startsAt: form.startsAt, endsAt: form.endsAt, createdById: 'dev' }),
    })
    if (res.ok) { onCreated(await res.json()); onClose() }
    else setErr('Ошибка при создании. Проверьте подключение к БД.')
    setSaving(false)
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(28,27,24,.35)', backdropFilter: 'blur(2px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 51, background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 6, boxShadow: '0 8px 40px rgba(0,0,0,.18)', padding: '2rem', width: 440,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.5rem' }}>Новый цикл оценки</div>
        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--hint)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 5 }}>
              Название цикла
            </label>
            <input value={form.name} onChange={set('name')} placeholder="Например: Q2 2025 — PO Assessment"
              style={{ width: '100%', padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 3, fontSize: 13, color: 'var(--text)', background: 'var(--surface2)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {(['startsAt', 'endsAt'] as const).map((k, i) => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--hint)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 5 }}>
                  {i === 0 ? 'Дата начала' : 'Дедлайн'}
                </label>
                <input type="date" value={form[k]} onChange={set(k)}
                  style={{ width: '100%', padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 3, fontSize: 13, color: 'var(--text)', background: 'var(--surface2)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue-light)', borderRadius: 3, padding: '.75rem 1rem', fontSize: 12, color: 'var(--blue)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Цикл создастся в статусе <strong>Черновик</strong>. На следующем шаге выберете участников и запустите.
          </div>
          {err && <div style={{ fontSize: 12, color: 'var(--red,#991B1B)', marginBottom: '.75rem' }}>{err}</div>}
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn">Отмена</button>
            <button type="submit" className="btn btn-primary" style={{ opacity: saving ? .6 : 1 }}>
              {saving ? 'Создаём...' : 'Создать цикл'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ── Launch / participants modal ───────────────────────────────────────
function LaunchModal({ cycle, onClose, onLaunched }: {
  cycle: Cycle; onClose: () => void; onLaunched: () => void
}) {
  const [groups, setGroups]     = useState<Group[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [saving, setSaving]     = useState(false)
  const [launchErr, setLaunchErr] = useState('')

  useEffect(() => {
    fetch(`/api/cycles/${cycle.id}/launch`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setGroups(data.groups)
        // Default: select all
        const all = new Set<string>(data.groups.flatMap((g: Group) => g.employees.map(e => e.id)))
        // Deselect already assigned
        data.alreadyAssigned?.forEach((id: string) => all.delete(id))
        setSelected(all)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [cycle.id])

  function toggleEmp(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleGroup(group: Group) {
    const ids = group.employees.map(e => e.id)
    const allOn = ids.every(id => selected.has(id))
    setSelected(prev => {
      const next = new Set(prev)
      ids.forEach(id => allOn ? next.delete(id) : next.add(id))
      return next
    })
  }

  async function launch() {
    if (selected.size === 0) { setLaunchErr('Выберите хотя бы одного участника'); return }
    setSaving(true); setLaunchErr('')
    const res = await fetch(`/api/cycles/${cycle.id}/launch`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeIds: [...selected] }),
    })
    if (res.ok) { onLaunched(); onClose() }
    else setLaunchErr('Ошибка запуска. Проверьте подключение к БД.')
    setSaving(false)
  }

  const totalEmployees = groups.reduce((s, g) => s + g.employees.length, 0)

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(28,27,24,.35)', backdropFilter: 'blur(2px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 51, background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 6, boxShadow: '0 8px 40px rgba(0,0,0,.18)',
        width: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '.25rem' }}>Выбор участников</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cycle.name}</div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.75rem' }}>
          {loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--hint)', fontSize: 13 }}>Загрузка...</div>}

          {error && (
            <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-light)', borderRadius: 3, padding: '.875rem 1rem', fontSize: 13, color: 'var(--amber)' }}>
              База данных недоступна.
            </div>
          )}

          {!loading && !error && totalEmployees === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--hint)', fontSize: 13 }}>
              Нет сотрудников с назначенными руководителями. Сначала назначьте руководителей в разделе Пользователи.
            </div>
          )}

          {!loading && !error && groups.map(group => {
            const ids = group.employees.map(e => e.id)
            const allOn = ids.every(id => selected.has(id))
            const someOn = ids.some(id => selected.has(id))

            return (
              <div key={group.manager.id} style={{ marginBottom: '1.25rem' }}>
                {/* Team header */}
                <div
                  onClick={() => toggleGroup(group)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '.75rem',
                    padding: '.5rem .75rem', borderRadius: 3, cursor: 'pointer',
                    background: 'var(--surface2)', marginBottom: '.5rem',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 2, border: '1.5px solid',
                    borderColor: allOn ? 'var(--blue)' : 'var(--border2)',
                    background: allOn ? 'var(--blue)' : someOn ? 'var(--blue-bg)' : 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {(allOn || someOn) && <span style={{ color: allOn ? '#fff' : 'var(--blue)', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>
                      {allOn ? '✓' : '—'}
                    </span>}
                  </div>
                  <div className="avatar" style={{ width: 22, height: 22, fontSize: 9, flexShrink: 0 }}>
                    {initials(group.manager.name, group.manager.email)}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>
                    Команда: {group.manager.name ?? group.manager.email}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--hint)' }}>
                    {ids.filter(id => selected.has(id)).length} / {ids.length}
                  </span>
                </div>

                {/* Employees */}
                {group.employees.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmp(emp.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '.75rem',
                      padding: '.425rem .75rem .425rem 2.25rem', borderRadius: 3,
                      cursor: 'pointer', transition: 'background .12s',
                      background: selected.has(emp.id) ? 'var(--blue-bg)' : 'transparent',
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: 2, border: '1.5px solid',
                      borderColor: selected.has(emp.id) ? 'var(--blue)' : 'var(--border2)',
                      background: selected.has(emp.id) ? 'var(--blue)' : 'var(--surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {selected.has(emp.id) && <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                    </div>
                    <div className="avatar" style={{ width: 22, height: 22, fontSize: 9, flexShrink: 0 }}>
                      {initials(emp.name, emp.email)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{emp.name ?? '—'}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{emp.email}</div>
                    </div>
                    {emp.team && <span style={{ fontSize: 10, color: 'var(--hint)' }}>{emp.team}</span>}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.125rem 1.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ flex: 1, fontSize: 12, color: 'var(--muted)' }}>
            Выбрано: <strong style={{ color: 'var(--text)' }}>{selected.size}</strong> из {totalEmployees}
          </span>
          {launchErr && <span style={{ fontSize: 11, color: 'var(--red,#991B1B)' }}>{launchErr}</span>}
          <button onClick={onClose} className="btn">Отмена</button>
          <button
            onClick={launch}
            className="btn btn-primary"
            disabled={selected.size === 0 || saving}
            style={{ opacity: selected.size === 0 || saving ? .5 : 1 }}
          >
            {saving ? 'Запускаем...' : `Запустить для ${selected.size}`}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main page ────────────────────────────────────────────────────────
export default function HrCyclesPage() {
  const [cycles, setCycles]     = useState<Cycle[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [showCreate, setCreate] = useState(false)
  const [launching, setLaunching] = useState<Cycle | null>(null)

  useEffect(() => {
    fetch('/api/cycles')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setCycles)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const active = cycles.filter(c => c.status === 'ACTIVE')
  const draft  = cycles.filter(c => c.status === 'DRAFT')
  const closed = cycles.filter(c => c.status === 'CLOSED')

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Циклы оценки</h1>
          <span className="role-pill role-pill-hr">HR</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreate(true)}>+ Создать цикл</button>
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setCreate(false)}
          onCreated={c => setCycles(prev => [c, ...prev])}
        />
      )}

      {launching && (
        <LaunchModal
          cycle={launching}
          onClose={() => setLaunching(null)}
          onLaunched={() => {
            setCycles(prev => prev.map(c => c.id === launching.id ? { ...c, status: 'ACTIVE' } : c))
          }}
        />
      )}

      <div className="page-body">
        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hint)', fontSize: 13 }}>Загрузка...</div>}

        {error && (
          <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-light)', borderLeft: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', fontSize: 13, color: 'var(--amber)' }}>
            <strong>База данных недоступна.</strong> Циклы появятся после подключения PostgreSQL.
          </div>
        )}

        {!loading && !error && cycles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--hint)', fontSize: 13 }}>
            Циклов пока нет — создайте первый
          </div>
        )}

        {!loading && !error && cycles.length > 0 && (
          <>
            {[...active, ...draft].length > 0 && (
              <>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem' }}>
                  Текущие
                </div>
                {[...active, ...draft].map(c => (
                  <div key={c.id} className="card" style={{ marginBottom: '1rem', borderLeft: `3px solid ${c.status === 'ACTIVE' ? 'var(--purple)' : 'var(--border2)'}` }}>
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.375rem' }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                          <span className={`status ${STATUS_CLS[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <span>Начало: {fmtDate(c.startsAt)}</span>
                          <span>Дедлайн: {fmtDate(c.endsAt)}</span>
                          <span>{c._count.assignments} участников</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '.5rem', flexShrink: 0 }}>
                        {c.status === 'DRAFT' && (
                          <button className="btn btn-primary btn-sm" onClick={() => setLaunching(c)}>
                            Запустить →
                          </button>
                        )}
                        {c.status === 'ACTIVE' && (
                          <button className="btn btn-sm" onClick={() => setLaunching(c)}>
                            + Добавить участников
                          </button>
                        )}
                        <button className="btn btn-sm">Подробнее</button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {closed.length > 0 && (
              <>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem', marginTop: '2rem' }}>
                  Завершённые
                </div>
                <div className="card">
                  <div className="card-body-flush">
                    <table className="tbl">
                      <thead>
                        <tr><th>Название</th><th>Период</th><th>Участников</th><th>Статус</th><th></th></tr>
                      </thead>
                      <tbody>
                        {closed.map(c => (
                          <tr key={c.id}>
                            <td style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</td>
                            <td style={{ fontSize: 12, color: 'var(--muted)' }}>{fmtDate(c.startsAt)} — {fmtDate(c.endsAt)}</td>
                            <td style={{ fontSize: 13 }}>{c._count.assignments}</td>
                            <td><span className="status status-done">Завершён</span></td>
                            <td><button className="btn btn-sm">Результаты</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
