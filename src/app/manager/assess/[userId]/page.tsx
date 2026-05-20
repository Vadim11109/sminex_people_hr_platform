'use client'

import { use, useState, useCallback } from 'react'
import { COMPETENCIES, getGradeInfo, getSummaryText } from '@/lib/assessment-data'

type SubRatings = Record<string, number>   // "cid-si" → 0|1|2|3
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
  const [comments,   setComments]   = useState<Comments>({})
  const [generalNote, setGeneralNote] = useState('')
  const [openCards,  setOpenCards]  = useState<OpenCards>({})
  const [openSubs,   setOpenSubs]   = useState<OpenCards>({})
  const [saved,      setSaved]      = useState(false)

  const toggleCard = useCallback((k: string) =>
    setOpenCards(p => ({ ...p, [k]: !p[k] })), [])
  const toggleSub = useCallback((k: string) =>
    setOpenSubs(p => ({ ...p, [k]: !p[k] })), [])

  const setSub = useCallback((cid: number, si: number, val: number) =>
    setSubRatings(p => ({ ...p, [`${cid}-${si}`]: val })), [])

  function getCompScore(cid: number): number | undefined {
    const comp = COMPETENCIES.find(c => c.id === cid)!
    if (!comp.subs.every((_, i) => subRatings[`${cid}-${i}`] !== undefined)) return undefined
    return comp.subs.reduce((sum, _, i) => sum + subRatings[`${cid}-${i}`], 0) / comp.subs.length
  }

  function isCompDone(cid: number): boolean {
    return getCompScore(cid) !== undefined
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
          const rated = comp.subs.filter((_, i) => subRatings[`${comp.id}-${i}`] !== undefined).length

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
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 2,
                    fontSize: 11, fontWeight: 600, border: '1px solid var(--border)',
                    background: 'var(--surface2)', color: 'var(--hint)', letterSpacing: '.3px',
                  }}>
                    {rated > 0 ? `${rated}/${comp.subs.length}` : 'не оценено'}
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
                    const subOpen = !!openSubs[key]
                    const subbadge = val === undefined ? '—' : val === 0 ? '✕' : val === 1 ? 'J' : val === 2 ? 'M' : 'S'
                    const subbadgeCls = val === undefined ? 'badge-none' : val === 0 ? 'badge-0' : val === 1 ? 'badge-j' : val === 2 ? 'badge-m' : 'badge-s'

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
                            {/* Criteria grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem', marginBottom: '1.25rem' }}>
                              {([1, 2, 3] as const).map(level => {
                                const text = level === 1 ? sub.j : level === 2 ? sub.m : sub.s
                                const headBg  = level === 1 ? 'var(--blue-bg)'  : level === 2 ? 'var(--green-bg)'  : 'var(--amber-bg)'
                                const headClr = level === 1 ? 'var(--blue)'     : level === 2 ? 'var(--green)'     : 'var(--amber)'
                                const selBdr  = level === 1 ? 'var(--blue)'     : level === 2 ? 'var(--green)'     : 'var(--amber)'
                                const selShadow = level === 1 ? 'rgba(42,84,128,.12)' : level === 2 ? 'rgba(46,107,72,.12)' : 'rgba(138,104,0,.12)'
                                const isSel = val === level
                                return (
                                  <div
                                    key={level}
                                    onClick={() => setSub(comp.id, si, level)}
                                    style={{
                                      borderRadius: 3, cursor: 'pointer', transition: 'all .15s', overflow: 'hidden',
                                      border: `1.5px solid ${isSel ? selBdr : 'var(--border)'}`,
                                      background: isSel ? (level === 1 ? 'var(--blue-bg)' : level === 2 ? 'var(--green-bg)' : 'var(--amber-bg)') : 'var(--surface)',
                                      boxShadow: isSel ? `0 4px 16px ${selShadow}` : undefined,
                                      transform: isSel ? 'translateY(-1px)' : undefined,
                                    }}
                                  >
                                    <div style={{ padding: '7px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', background: headBg, color: headClr }}>
                                      {level === 1 ? 'Junior' : level === 2 ? 'Middle' : 'Senior'}
                                    </div>
                                    <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>{text}</div>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Not shown button */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Оценка:</span>
                              <button
                                onClick={() => setSub(comp.id, si, 0)}
                                style={{
                                  padding: '6px 16px', borderRadius: 3, fontSize: 12, fontWeight: 500,
                                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                                  background: val === 0 ? 'var(--red-bg, #FEF2F2)' : 'var(--surface)',
                                  border: `1.5px solid ${val === 0 ? 'var(--red, #991B1B)' : 'var(--border)'}`,
                                  color: val === 0 ? 'var(--red, #991B1B)' : 'var(--muted)',
                                }}
                              >
                                ✕ Не показывает
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
                    ) : (
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 2, fontSize: 11, fontWeight: 600,
                        border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--hint)', letterSpacing: '.3px',
                      }}>
                        {rated > 0 ? `${rated}/${comp.subs.length} оценено` : 'оцените все пункты'}
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--hint)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                      Комментарий и наблюдения
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
            Итоговые комментарии руководителя
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
            onClick={() => setSaved(true)}
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
