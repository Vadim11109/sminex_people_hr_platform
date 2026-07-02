'use client'

import { use, useState, useCallback, useEffect } from 'react'
import { COMPETENCIES, getGradeInfo, getSummaryText } from '@/lib/assessment-data'

type SubRatings = Record<string, number>   // "cid-si" → 0|1|2|3 (0 = компетенция отсутствует)
type SubSkipped = Record<string, boolean>  // "cid-si" → не могу оценить (исключается из среднего балла)
type Comments   = Record<string, string>   // cid → text
type OpenCards  = Record<string, boolean>

function gradeCss(grade: string) {
  if (grade === 'S') return { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' }
  if (grade === 'M') return { bg: 'var(--green-bg)',  border: 'var(--green-light)', color: 'var(--green)' }
  if (grade === 'J') return { bg: 'var(--blue-bg)',   border: 'var(--blue-light)',  color: 'var(--blue)'  }
  return { bg: 'var(--red-bg, #FEF2F2)', border: 'var(--red-light, #FECACA)', color: 'var(--red, #991B1B)' }
}

// Stub employee data
const EMPLOYEES: Record<string, { name: string; initials: string; prevGrade: string; prevCls: string }> = {
  '1': { name: 'Иван Петров',     initials: 'ИП', prevGrade: 'Мидл Ранг 1',    prevCls: 'badge-m' },
  '2': { name: 'Анна Сидорова',   initials: 'АС', prevGrade: 'Мидл Ранг 3',    prevCls: 'badge-m' },
  '3': { name: 'Дмитрий Козлов',  initials: 'ДК', prevGrade: 'Джуниор Ранг 3', prevCls: 'badge-j' },
}

export default function ManagerAssessPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const emp = EMPLOYEES[userId] ?? { name: 'Сотрудник', initials: '??', prevGrade: '—', prevCls: 'badge-j' }

  const [subRatings, setSubRatings] = useState<SubRatings>({})
  const [subSkipped, setSubSkipped] = useState<SubSkipped>({})
  const [comments,   setComments]   = useState<Comments>({})
  const [generalNote, setGeneralNote] = useState('')
  const [openCards,  setOpenCards]  = useState<OpenCards>({})
  const [openSubs,   setOpenSubs]   = useState<OpenCards>({})
  const [saved,      setSaved]      = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)

  const draftKey = `po-assessment-draft-mgr-${userId}`

  // Восстановление черновика при открытии страницы
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey)
      if (!raw) return
      const draft = JSON.parse(raw)
      if (draft.subRatings) setSubRatings(draft.subRatings)
      if (draft.subSkipped) setSubSkipped(draft.subSkipped)
      if (draft.comments) setComments(draft.comments)
      if (typeof draft.generalNote === 'string') setGeneralNote(draft.generalNote)
      setDraftRestored(true)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey])

  // Автосохранение черновика при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        subRatings, subSkipped, comments, generalNote, savedAt: new Date().toISOString(),
      }))
    } catch {}
  }, [draftKey, subRatings, subSkipped, comments, generalNote])

  function handleSaveComplete() {
    try { localStorage.removeItem(draftKey) } catch {}
    setSaved(true)
  }

  const toggleCard = useCallback((k: string) =>
    setOpenCards(p => ({ ...p, [k]: !p[k] })), [])
  const toggleSub = useCallback((k: string) =>
    setOpenSubs(p => ({ ...p, [k]: !p[k] })), [])

  const setSub = useCallback((cid: number, si: number, val: number) => {
    const key = `${cid}-${si}`
    setSubRatings(p => ({ ...p, [key]: val }))
    setSubSkipped(p => ({ ...p, [key]: false }))
  }, [])

  const setSkip = useCallback((cid: number, si: number) => {
    const key = `${cid}-${si}`
    setSubSkipped(p => ({ ...p, [key]: true }))
    setSubRatings(p => { const n = { ...p }; delete n[key]; return n })
  }, [])

  function isSubAnswered(cid: number, si: number): boolean {
    const key = `${cid}-${si}`
    return subRatings[key] !== undefined || !!subSkipped[key]
  }

  // Средний балл считается только по пунктам с числовой оценкой — «не могу оценить» из расчёта исключается
  function getCompScore(cid: number): number | undefined {
    const comp = COMPETENCIES.find(c => c.id === cid)!
    if (!comp.subs.every((_, i) => isSubAnswered(cid, i))) return undefined
    const rated = comp.subs.map((_, i) => subRatings[`${cid}-${i}`]).filter((v): v is number => v !== undefined)
    if (rated.length === 0) return undefined
    return rated.reduce((a, b) => a + b, 0) / rated.length
  }

  function isCompDone(cid: number): boolean {
    const comp = COMPETENCIES.find(c => c.id === cid)!
    return comp.subs.every((_, i) => isSubAnswered(cid, i))
  }

  const doneCount = COMPETENCIES.filter(c => isCompDone(c.id)).length
  const allDone   = doneCount === 9

  const scores = COMPETENCIES.map(c => getCompScore(c.id))
  const validScores = scores.filter((s): s is number => s !== undefined)
  const overallAvg = validScores.length > 0
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length
    : null

  if (saved) {
    const gi = overallAvg !== null ? getGradeInfo(overallAvg) : null
    const css = gi ? gradeCss(gi.grade) : null
    return (
      <>
        <div className="topbar">
          <a href="/manager" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Команда</a>
        </div>
        <div className="page-body" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '520px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--green-bg)', border: '2px solid var(--green-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.75rem', fontSize: 30, color: 'var(--green)',
            }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', fontWeight: 600, marginBottom: '.75rem' }}>
              Оценка сохранена
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Вы оценили <strong>{emp.name}</strong>.
              {gi && <> Итоговый грейд: <strong>{gi.label}</strong> (средний балл {overallAvg!.toFixed(2)}).</>}
            </p>
            {gi && css && (
              <div style={{
                display: 'inline-flex', padding: '10px 22px', borderRadius: 3,
                fontSize: 20, fontWeight: 700, border: `2px solid ${css.border}`,
                background: css.bg, color: css.color, marginBottom: '1.5rem',
              }}>
                {gi.label}
              </div>
            )}
            {gi && <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>{getSummaryText(overallAvg!, 9)}</p>}
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`/manager/gap/${userId}`} className="btn btn-primary">Gap-анализ →</a>
              <a href="/manager" className="btn">← К команде</a>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <a href="/manager" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Команда</a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Оценка: {emp.name}</h1>
          <span className="role-pill role-pill-manager">Руководитель</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div className="prog-track" style={{ width: '140px' }}>
            <div className="prog-fill prog-fill-blue" style={{ width: `${(doneCount / 9) * 100}%` }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--muted)', minWidth: '40px' }}>{doneCount} / 9</span>
        </div>
      </div>

      <div className="page-body">
        {draftRestored && (
          <div style={{
            background: 'var(--green-bg)', border: '1px solid var(--green-light)',
            borderLeft: '3px solid var(--green)', borderRadius: 'var(--radius)',
            padding: '.875rem 1.25rem', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--green)' }}>
              Восстановлен черновик, сохранённый ранее — можно продолжить с того же места.
            </span>
            <button className="btn btn-sm" onClick={() => setDraftRestored(false)}>Понятно</button>
          </div>
        )}
        {/* Intro */}
        <div style={{
          background: 'var(--blue-bg)', border: '1px solid var(--blue-light)',
          borderLeft: '3px solid var(--blue)', borderRadius: 'var(--radius)',
          padding: '1.25rem 1.75rem', marginBottom: '1.25rem',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.7, marginBottom: '.75rem' }}>
            Перед вами анкета для оценки компетенций сотрудника. Пожалуйста, следуйте нижеприведённой инструкции:
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13px', color: 'var(--text)', lineHeight: 1.7, listStyle: 'disc' }}>
            <li style={{ marginBottom: '.5rem' }}>Ознакомьтесь с компетенциями и поведенческими индикаторами. Каждый индикатор описывает конкретное поведение, которое может наблюдаться в рабочей деятельности. Оценивать нужно не личные качества, а фактическое поведение сотрудника в профессиональной среде.</li>
            <li style={{ marginBottom: '.5rem' }}>Оцените каждую компетенцию, выбрав подходящее описание поведения сотрудника. В крайних случаях используйте ответ «не могу оценить».</li>
            <li style={{ marginBottom: '.5rem' }}>Будьте объективны и последовательны. Оценивайте на основе последних 6–12 месяцев работы.</li>
            <li style={{ marginBottom: '.5rem' }}>Заполните анкету целиком. Не пропускайте компетенции и индикаторы. Не оставляйте пустых полей, там где их заполнение обязательно.</li>
            <li>Завершите анкету в срок. Заполнение анкеты обычно занимает до 20 мин. По каждому блоку вы можете оставить комментарий.</li>
          </ul>
          <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.7, marginTop: '.75rem', marginBottom: 0 }}>
            Ваши ответы будут сохраняться по мере прохождения опросника, так что при необходимости вы можете закрыть его и завершить позже.<br />
            Спасибо вам за участие и вклад в развитие сотрудников!
          </p>
        </div>

        {/* Employee header */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="avatar" style={{ width: 48, height: 48, fontSize: 17 }}>{emp.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '.25rem' }}>{emp.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Текущий грейд: <span className={`badge ${emp.prevCls}`}>{emp.prevGrade}</span>
              </div>
            </div>
            {overallAvg !== null && (() => {
              const gi = getGradeInfo(overallAvg)
              const css = gradeCss(gi.grade)
              return (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--hint)', marginBottom: 4 }}>Промежуточный результат</div>
                  <span style={{
                    display: 'inline-flex', padding: '5px 12px', borderRadius: 3,
                    fontSize: 14, fontWeight: 700, border: `1.5px solid ${css.border}`,
                    background: css.bg, color: css.color,
                  }}>
                    {gi.label} ({overallAvg.toFixed(2)})
                  </span>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Competency cards */}
        {COMPETENCIES.map((comp) => {
          const score = getCompScore(comp.id)
          const done  = score !== undefined
          const open  = !!openCards[`c-${comp.id}`]
          const gi    = done ? getGradeInfo(score!) : null
          const css   = gi ? gradeCss(gi.grade) : null
          const answered = comp.subs.filter((_, i) => isSubAnswered(comp.id, i)).length
          const allAnswered = answered === comp.subs.length

          const borderColor = done
            ? (gi!.grade === 'S' ? 'var(--amber)' : gi!.grade === 'M' ? 'var(--green)' : gi!.grade === 'J' ? 'var(--blue)' : 'var(--border2)')
            : 'transparent'

          return (
            <div key={comp.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: `3px solid ${borderColor}`,
              borderRadius: 'var(--radius)', marginBottom: '1rem', overflow: 'hidden',
              boxShadow: open ? '0 2px 10px rgba(0,0,0,.06)' : undefined,
            }}>
              {/* Header */}
              <div
                onClick={() => toggleCard(`c-${comp.id}`)}
                style={{
                  padding: '1.125rem 1.75rem', display: 'flex', alignItems: 'center',
                  gap: '1rem', cursor: 'pointer', userSelect: 'none',
                  background: open ? 'var(--surface2)' : undefined,
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 3, flexShrink: 0, fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? (gi!.grade === 'S' ? 'var(--amber-bg)' : gi!.grade === 'M' ? 'var(--green-bg)' : 'var(--blue-bg)') : 'var(--surface2)',
                  border: `1px solid ${done ? (gi!.grade === 'S' ? 'var(--amber-light)' : gi!.grade === 'M' ? 'var(--green-light)' : 'var(--blue-light)') : 'var(--border)'}`,
                  color: done ? (gi!.grade === 'S' ? 'var(--amber)' : gi!.grade === 'M' ? 'var(--green)' : 'var(--blue)') : 'var(--muted)',
                }}>
                  {comp.id}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: 2 }}>{comp.code}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{comp.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{comp.sub}</div>
                </div>
                {gi && css ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 2,
                    fontSize: 11, fontWeight: 600, border: '1px solid', letterSpacing: '.3px',
                    background: css.bg, borderColor: css.border, color: css.color,
                  }}>
                    {gi.label} ({score!.toFixed(1)})
                  </span>
                ) : allAnswered ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 2,
                    fontSize: 11, fontWeight: 600, border: '1px solid var(--border)',
                    background: 'var(--surface2)', color: 'var(--hint)', letterSpacing: '.3px', fontStyle: 'italic',
                  }}>
                    недостаточно данных
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 2,
                    fontSize: 11, fontWeight: 600, border: '1px solid var(--border)',
                    background: 'var(--surface2)', color: 'var(--hint)', letterSpacing: '.3px',
                  }}>
                    {answered > 0 ? `${answered}/${comp.subs.length}` : 'не оценено'}
                  </span>
                )}
                <span style={{ color: 'var(--hint)', fontSize: 16, transition: 'transform .18s', transform: open ? 'rotate(90deg)' : undefined }}>›</span>
              </div>

              {/* Body */}
              {open && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 1.75rem' }}>
                  {comp.subs.map((sub, si) => {
                    const key = `${comp.id}-${si}`
                    const val = subRatings[key]
                    const skipped = !!subSkipped[key]
                    const subOpen = !!openSubs[key]
                    const subbadge = skipped ? '?' : val === undefined ? '—' : val === 0 ? '⊘' : val === 1 ? 'J' : val === 2 ? 'M' : 'S'
                    const subbadgeCls = skipped ? 'badge-skip' : val === undefined ? 'badge-none' : val === 0 ? 'badge-0' : val === 1 ? 'badge-j' : val === 2 ? 'badge-m' : 'badge-s'

                    return (
                      <div key={si} style={{ border: '1px solid var(--border)', borderRadius: 3, marginBottom: '.625rem', overflow: 'hidden' }}>
                        {/* Sub header */}
                        <div
                          onClick={() => toggleSub(key)}
                          style={{
                            padding: '.625rem 1.125rem', display: 'flex', alignItems: 'center',
                            gap: '.75rem', cursor: 'pointer', userSelect: 'none',
                            background: subOpen ? 'var(--surface2)' : undefined,
                          }}
                        >
                          <div style={{
                            width: 22, height: 22, borderRadius: 2, flexShrink: 0, fontSize: 10, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)',
                          }}>{si + 1}</div>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{sub.name}</span>
                          <span className={`badge ${subbadgeCls}`}>{subbadge}</span>
                          <span style={{ color: 'var(--hint)', fontSize: 16, transition: 'transform .18s', transform: subOpen ? 'rotate(90deg)' : undefined }}>›</span>
                        </div>

                        {/* Sub body */}
                        {subOpen && (
                          <div style={{ padding: '1rem 1.125rem', borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
                            {/* Criteria grid — без наименований Jr/Middle/Sr, руководитель выбирает по описанию поведения */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '.75rem', marginBottom: '1.25rem' }}>
                              {([0, 1, 2, 3] as const).map(level => {
                                const text = level === 0 ? 'Компетенция отсутствует / не проявилась' : level === 1 ? sub.j : level === 2 ? sub.m : sub.s
                                const selBdr  = level === 0 ? 'var(--red, #991B1B)' : level === 1 ? 'var(--blue)' : level === 2 ? 'var(--green)' : 'var(--amber)'
                                const selBg   = level === 0 ? 'var(--red-bg, #FEF2F2)' : level === 1 ? 'var(--blue-bg)' : level === 2 ? 'var(--green-bg)' : 'var(--amber-bg)'
                                const selShadow = level === 0 ? 'rgba(153,27,27,.12)' : level === 1 ? 'rgba(42,84,128,.12)' : level === 2 ? 'rgba(46,107,72,.12)' : 'rgba(138,104,0,.12)'
                                const isSel = !skipped && val === level
                                return (
                                  <div
                                    key={level}
                                    onClick={() => setSub(comp.id, si, level)}
                                    style={{
                                      borderRadius: 3, cursor: 'pointer', transition: 'all .15s', overflow: 'hidden',
                                      border: `1.5px solid ${isSel ? selBdr : 'var(--border)'}`,
                                      background: isSel ? selBg : 'var(--surface)',
                                      boxShadow: isSel ? `0 4px 16px ${selShadow}` : undefined,
                                      transform: isSel ? 'translateY(-1px)' : undefined,
                                      padding: '10px 14px', fontSize: 12, lineHeight: 1.55,
                                      color: level === 0 ? 'var(--red, #991B1B)' : 'var(--muted)',
                                      fontStyle: level === 0 ? 'italic' : undefined,
                                    }}
                                  >
                                    {text}
                                  </div>
                                )
                              })}
                            </div>

                            {/* Cannot assess */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Оценка:</span>
                              <button
                                onClick={() => setSkip(comp.id, si)}
                                style={{
                                  padding: '6px 16px', borderRadius: 3, fontSize: 12, fontWeight: 500,
                                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                                  background: skipped ? 'var(--surface2)' : 'var(--surface)',
                                  border: `1.5px solid ${skipped ? 'var(--hint)' : 'var(--border)'}`,
                                  color: skipped ? 'var(--text)' : 'var(--muted)',
                                  fontStyle: skipped ? 'italic' : undefined,
                                }}
                              >
                                ? Не могу оценить
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Sub summary */}
                  <div style={{ padding: '1rem 0', marginTop: '.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      Итого по компетенции:
                    </span>
                    {gi && css ? (
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 2, fontSize: 11, fontWeight: 600,
                        border: `1px solid ${css.border}`, background: css.bg, color: css.color, letterSpacing: '.3px',
                      }}>
                        {gi.label} ({score!.toFixed(1)})
                      </span>
                    ) : allAnswered ? (
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 2, fontSize: 11, fontWeight: 600,
                        border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--hint)', letterSpacing: '.3px', fontStyle: 'italic',
                      }}>
                        недостаточно данных для оценки
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 2, fontSize: 11, fontWeight: 600,
                        border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--hint)', letterSpacing: '.3px',
                      }}>
                        {answered > 0 ? `${answered}/${comp.subs.length} оценено` : 'оцените все пункты'}
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--hint)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                      Комментарий и наблюдения <span style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(опционально, необязательно для заполнения)</span>
                    </label>
                    <textarea
                      value={comments[comp.id] ?? ''}
                      onChange={e => setComments(p => ({ ...p, [comp.id]: e.target.value }))}
                      placeholder="Конкретные ситуации, поведение, аргументы..."
                      style={{
                        width: '100%', padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 3,
                        fontSize: 12, color: 'var(--text)', background: 'var(--surface2)', outline: 'none',
                        fontFamily: 'inherit', resize: 'vertical', minHeight: 56, lineHeight: 1.55, boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* General comment */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border)' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: 7 }}>
            Итоговые комментарии руководителя <span style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(опционально, необязательно для заполнения)</span>
          </label>
          <textarea
            value={generalNote}
            onChange={e => setGeneralNote(e.target.value)}
            placeholder="Общие наблюдения, рекомендации, план развития..."
            style={{
              width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 3,
              fontSize: 13, color: 'var(--text)', background: 'var(--surface2)', outline: 'none',
              fontFamily: 'inherit', resize: 'vertical', minHeight: 76, lineHeight: 1.65, boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.75rem', paddingBottom: '3rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handleSaveComplete}
            disabled={!allDone}
            style={{ opacity: allDone ? 1 : .45 }}
          >
            Сохранить и завершить оценку
          </button>
          <a href="/manager" className="btn">Отмена</a>
        </div>
      </div>
    </>
  )
}
