'use client'

import { useEffect, useRef, useState } from 'react'
import { questionnaireFor, roleLabel } from '@/lib/review-questions'

interface InboxItem { id: string; role: string; status: string; cycleName: string; subjectName: string }
interface ReviewForm { id: string; role: string; answers: Record<string, number>; generalNote: string; status: string; cycleName: string; subjectName: string }

const inputSt: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 3, fontSize: 13, color: 'var(--text)', background: 'var(--surface2)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }

export default function EmployeeReviewsPage() {
  const [inbox, setInbox] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)
  const [form, setForm] = useState<ReviewForm | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function load() {
    setLoading(true); setDbError(false)
    fetch('/api/reviews/mine')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setInbox(Array.isArray(d) ? d : []))
      .catch(() => setDbError(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openForm(id: string) {
    fetch(`/api/reviews/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((f: ReviewForm) => { setForm(f); setAnswers(f.answers ?? {}); setNote(f.generalNote ?? ''); setSubmitted(f.status === 'COMPLETED') })
      .catch(() => {})
  }

  function scheduleSave(a: Record<string, number>, n: string, id: string) {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      fetch(`/api/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers: a, generalNote: n }) }).catch(() => {})
    }, 600)
  }
  function setAnswer(key: string, value: number) {
    if (!form) return
    const a = { ...answers, [key]: value }; setAnswers(a); scheduleSave(a, note, form.id)
  }
  function setNoteVal(v: string) {
    if (!form) return
    setNote(v); scheduleSave(answers, v, form.id)
  }

  async function submit() {
    if (!form) return
    await fetch(`/api/reviews/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers, generalNote: note }) }).catch(() => {})
    const r = await fetch(`/api/reviews/${form.id}/submit`, { method: 'POST' })
    if (r.ok) setSubmitted(true)
  }

  const def = form ? questionnaireFor(form.role) : null
  const answered = def ? def.questions.filter(q => answers[q.key] !== undefined).length : 0
  const allAnswered = def ? answered === def.questions.length : false

  // ── Форма ──
  if (form && def) {
    return (
      <>
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Мои опросы</h1>
            <span className="role-pill role-pill-employee">Сотрудник</span>
          </div>
        </div>

        <div className="page-body" style={{ maxWidth: 860 }}>
          <button className="btn btn-sm btn-ghost" style={{ paddingLeft: 0, marginBottom: '.75rem' }} onClick={() => { setForm(null); load() }}>← Мои опросы</button>

          {submitted ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 40px', borderLeft: '3px solid var(--green)' }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Спасибо за оценку!</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
                Ваша обратная связь по «{form.subjectName}» передана. Пока цикл открыт, ответы можно изменить.
              </div>
              <button className="btn btn-sm" style={{ marginTop: 20 }} onClick={() => setSubmitted(false)}>Изменить ответы</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--hint)', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>
                {roleLabel(form.role)} · {form.cycleName}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Оценка: {form.subjectName}</h2>
              <div style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue-light)', borderRadius: 6, padding: '.875rem 1.125rem', fontSize: 13, color: 'var(--blue)', lineHeight: 1.6, marginBottom: 18 }}>
                {def.intro}
              </div>

              {def.questions.map((q, i) => (
                <div key={q.key} className="card" style={{ padding: '16px 20px', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{i + 1}. {q.text}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {def.options.map(opt => {
                      const on = answers[q.key] === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setAnswer(q.key, opt.value)}
                          style={{
                            padding: '9px 10px', borderRadius: 4, fontSize: 12, fontWeight: on ? 600 : 500,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s',
                            border: `1.5px solid ${on ? 'var(--green)' : 'var(--border2)'}`,
                            background: on ? 'var(--green-bg)' : 'var(--surface)',
                            color: on ? 'var(--green)' : 'var(--muted)',
                          }}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setAnswer(q.key, 0)}
                    style={{
                      marginTop: 8, padding: '4px 12px', borderRadius: 3, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                      border: `1px solid ${answers[q.key] === 0 ? 'var(--red-light)' : 'var(--border)'}`,
                      background: answers[q.key] === 0 ? 'var(--red-bg)' : 'transparent',
                      color: answers[q.key] === 0 ? 'var(--red)' : 'var(--hint)',
                    }}
                  >
                    Не могу оценить
                  </button>
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--hint)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {def.openLabel} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(опционально)</span>
                </div>
                <textarea value={note} onChange={e => setNoteVal(e.target.value)} rows={3} style={inputSt} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 18 }}>
                <button className="btn btn-primary" disabled={!allAnswered} style={{ opacity: allAnswered ? 1 : .5 }} onClick={submit}>
                  Отправить оценку
                </button>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{answered} / {def.questions.length}</span>
              </div>
            </>
          )}
        </div>
      </>
    )
  }

  // ── Инбокс ──
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Мои опросы</h1>
          <span className="role-pill role-pill-employee">Сотрудник</span>
        </div>
      </div>

      <div className="page-body">
        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hint)', fontSize: 13 }}>Загрузка...</div>}

        {dbError && (
          <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-light)', borderLeft: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', fontSize: 13, color: 'var(--amber)' }}>
            <strong>База данных недоступна.</strong> Опросы появятся после подключения PostgreSQL.
          </div>
        )}

        {!loading && !dbError && inbox.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--hint)', fontSize: 13 }}>
            Опросов пока нет. Когда вас назначат оценить коллегу как заказчика или Центр экспертизы (РЦЭ), запрос появится здесь.
          </div>
        )}

        {!loading && !dbError && inbox.length > 0 && (
          <>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem' }}>
              Ожидают вашей оценки
            </div>
            {inbox.map(it => {
              const done = it.status === 'COMPLETED'
              return (
                <div key={it.id} className="card" style={{ marginBottom: '.75rem', borderLeft: `3px solid ${done ? 'var(--green)' : 'var(--amber)'}` }}>
                  <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '.25rem' }}>{it.subjectName}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{roleLabel(it.role)} · {it.cycleName}</div>
                    </div>
                    <span className={`status ${done ? 'status-done' : 'status-pending'}`}>{done ? 'Заполнено' : 'Ожидает'}</span>
                    <button className={`btn btn-sm ${done ? '' : 'btn-primary'}`} onClick={() => openForm(it.id)}>
                      {done ? 'Изменить' : 'Заполнить →'}
                    </button>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}
