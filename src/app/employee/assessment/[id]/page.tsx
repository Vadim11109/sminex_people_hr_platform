'use client'

import { useState, useCallback } from 'react'
import { COMPETENCIES, FREQ_LABELS, getGradeInfo } from '@/lib/assessment-data'

// ─── Types ───────────────────────────────────────────────────────────────────
type SubRatings   = Record<string, number>          // "cid-si" → 0|1|2|3
type FreqAnswers  = Record<string, Record<number, number>> // cid → qi → 1..5
type Examples     = Record<string, Record<number, string>> // cid → qi → text
type CompExamples = Record<string, string>          // cid → text
type OpenCards    = Record<string, boolean>

// ─── Grade badge CSS ─────────────────────────────────────────────────────────
function gradeCss(grade: string) {
  if (grade === 'S') return { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' }
  if (grade === 'M') return { bg: 'var(--green-bg)',  border: 'var(--green-light)', color: 'var(--green)' }
  if (grade === 'J') return { bg: 'var(--blue-bg)',   border: 'var(--blue-light)',  color: 'var(--blue)'  }
  return { bg: 'var(--surface2)', border: 'var(--border)', color: 'var(--hint)' }
}

export default function EmployeeAssessmentPage() {
  const [subRatings,   setSubRatings]   = useState<SubRatings>({})
  const [freqAnswers,  setFreqAnswers]  = useState<FreqAnswers>({})
  const [examples,     setExamples]     = useState<Examples>({})
  const [compExamples, setCompExamples] = useState<CompExamples>({})
  const [generalNote,  setGeneralNote]  = useState('')
  const [openCards,    setOpenCards]    = useState<OpenCards>({})
  const [submitted,    setSubmitted]    = useState(false)

  // ── helpers ──
  const toggleCard = useCallback((key: string) =>
    setOpenCards(prev => ({ ...prev, [key]: !prev[key] })), [])

  const setSub = useCallback((cid: number, si: number, val: number) =>
    setSubRatings(prev => ({ ...prev, [`${cid}-${si}`]: val })), [])

  const setFreq = useCallback((cid: number, qi: number, val: number) =>
    setFreqAnswers(prev => ({
      ...prev,
      [cid]: { ...(prev[cid] ?? {}), [qi]: val },
    })), [])

  const setExample = useCallback((cid: number, qi: number, val: string) =>
    setExamples(prev => ({
      ...prev,
      [cid]: { ...(prev[cid] ?? {}), [qi]: val },
    })), [])

  // ── derived state ──
  function getCompScore(cid: number): number | null {
    const comp = COMPETENCIES.find(c => c.id === cid)!
    const allRated = comp.subs.every((_, i) => subRatings[`${cid}-${i}`] !== undefined)
    if (!allRated) return null
    return comp.subs.reduce((sum, _, i) => sum + subRatings[`${cid}-${i}`], 0) / comp.subs.length
  }

  function isCompDone(cid: number): boolean {
    return getCompScore(cid) !== null
  }

  const doneCount = COMPETENCIES.filter(c => isCompDone(c.id)).length
  const allDone   = doneCount === 9

  const overallAvg = allDone
    ? COMPETENCIES.reduce((sum, c) => sum + (getCompScore(c.id) ?? 0), 0) / 9
    : null

  // ── thank you screen ──
  if (submitted) {
    return (
      <>
        <div className="topbar">
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Q1 2025 — PO Assessment</h1>
        </div>
        <div className="page-body" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '520px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--green-bg)', border: '2px solid var(--green-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.75rem', fontSize: 30, color: 'var(--green)',
            }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '26px', fontWeight: 600, marginBottom: '.75rem' }}>
              Спасибо за честность!
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Само-оценка завершена. Ваши ответы переданы руководителю и HR — они используют их
              для развивающего диалога, а не для пересмотра грейда. Вы молодец, что нашли время
              осмыслить свою работу.
            </p>
            <a href="/employee" className="btn btn-primary">← К ассесментам</a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <a href="/employee" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Назад</a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Q1 2025 — PO Assessment</h1>
          <span className="role-pill role-pill-employee">Само-оценка</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div className="prog-track" style={{ width: '140px' }}>
            <div className="prog-fill prog-fill-purple" style={{ width: `${(doneCount / 9) * 100}%` }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--muted)', minWidth: '40px' }}>{doneCount} / 9</span>
        </div>
      </div>

      <div className="page-body">
        {/* Intro */}
        <div style={{
          background: 'var(--purple-bg, #F5EEFA)', border: '1px solid var(--purple-light, #CDB8E0)',
          borderRadius: 'var(--radius)', padding: '1.25rem 1.75rem', marginBottom: '1.75rem',
          display: 'flex', gap: '1rem', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '22px', flexShrink: 0, marginTop: 2 }}>💡</span>
          <p style={{ fontSize: '13px', color: '#3B0764', lineHeight: 1.65 }}>
            <strong>Как работает само-оценка.</strong> Для каждой компетенции оцените себя по каждому аспекту —
            кликните на описание уровня, которое лучше всего отражает вашу текущую практику.
            Если навык не проявляется — нажмите «✕ Не показываю». Добавьте конкретный кейс из практики.
            <br />
            <strong>Будьте честны:</strong> само-оценка сравнивается с оценкой руководителя — расхождения
            в обе стороны становятся темой для разговора, а не основанием для пересмотра грейда.
          </p>
        </div>

        {/* Competency cards */}
        {COMPETENCIES.map((comp) => {
          const score = getCompScore(comp.id)
          const done  = score !== null
          const open  = !!openCards[`c-${comp.id}`]
          const gi    = done ? getGradeInfo(score!) : null
          const css   = gi ? gradeCss(gi.grade) : null

          return (
            <div
              key={comp.id}
              style={{
                background: 'var(--surface)',
                border: `1px solid var(--border)`,
                borderLeft: `3px solid ${done ? 'var(--purple-light, #CDB8E0)' : 'transparent'}`,
                borderRadius: 'var(--radius)',
                marginBottom: '1rem',
                overflow: 'hidden',
              }}
            >
              {/* Card header */}
              <div
                onClick={() => toggleCard(`c-${comp.id}`)}
                style={{
                  padding: '1.125rem 1.75rem', display: 'flex', alignItems: 'center',
                  gap: '1rem', cursor: 'pointer', userSelect: 'none',
                  background: open ? 'var(--surface2)' : undefined,
                  transition: 'background .15s',
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 3, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: 'var(--purple-bg, #F5EEFA)',
                  border: '1px solid var(--purple-light, #CDB8E0)',
                  color: 'var(--purple)',
                }}>
                  {comp.id}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: 2 }}>
                    {comp.code}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{comp.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: 2 }}>{comp.sub}</div>
                </div>
                {gi && css ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                    borderRadius: 2, fontSize: 11, fontWeight: 600, border: '1px solid',
                    background: css.bg, borderColor: css.border, color: css.color,
                    letterSpacing: '.3px',
                  }}>
                    {gi.label} ({score!.toFixed(1)})
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                    borderRadius: 2, fontSize: 11, fontWeight: 600,
                    background: 'var(--purple-bg, #F5EEFA)', border: '1px solid var(--purple-light, #CDB8E0)',
                    color: 'var(--purple)', letterSpacing: '.3px',
                  }}>
                    не заполнено
                  </span>
                )}
                <span style={{ color: 'var(--hint)', fontSize: 16, transition: 'transform .18s', transform: open ? 'rotate(90deg)' : undefined }}>›</span>
              </div>

              {/* Card body */}
              {open && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 1.75rem' }}>
                  {/* Sub-criteria */}
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.25rem',
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: '1.25rem' }}>
                      Оцените себя по каждому аспекту
                    </div>

                    {comp.subs.map((sub, si) => {
                      const key = `${comp.id}-${si}`
                      const val = subRatings[key]
                      return (
                        <div key={si} style={{ paddingBottom: '1.375rem', marginBottom: si < comp.subs.length - 1 ? '1.375rem' : 0, borderBottom: si < comp.subs.length - 1 ? '1px solid var(--border)' : undefined }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', flex: 1, minWidth: 160 }}>
                              {si + 1}. {sub.name}
                            </span>
                            <button
                              onClick={() => setSub(comp.id, si, 0)}
                              style={{
                                padding: '5px 13px', borderRadius: 3, fontSize: 12, fontWeight: 500,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                                background: val === 0 ? 'var(--red-bg, #FEF2F2)' : 'var(--surface2)',
                                border: `1.5px solid ${val === 0 ? 'var(--red, #991B1B)' : 'var(--border)'}`,
                                color: val === 0 ? 'var(--red, #991B1B)' : 'var(--muted)',
                              }}
                            >
                              ✕ Не показываю
                            </button>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem' }}>
                            {([1, 2, 3] as const).map((level) => {
                              const text = level === 1 ? sub.j_self : level === 2 ? sub.m_self : sub.s_self
                              const selCls = level === 1 ? 'sel-j' : level === 2 ? 'sel-m' : 'sel-s'
                              const headBg  = level === 1 ? 'var(--blue-bg)'  : level === 2 ? 'var(--green-bg)'  : 'var(--amber-bg)'
                              const headClr = level === 1 ? 'var(--blue)'     : level === 2 ? 'var(--green)'     : 'var(--amber)'
                              const selBg   = level === 1 ? 'var(--blue-bg)'  : level === 2 ? 'var(--green-bg)'  : 'var(--amber-bg)'
                              const selBdr  = level === 1 ? 'var(--blue)'     : level === 2 ? 'var(--green)'     : 'var(--amber)'
                              const selShadow = level === 1 ? 'rgba(42,84,128,.12)' : level === 2 ? 'rgba(46,107,72,.12)' : 'rgba(138,104,0,.12)'
                              const isSelected = val === level
                              return (
                                <div
                                  key={level}
                                  onClick={() => setSub(comp.id, si, level)}
                                  style={{
                                    borderRadius: 3, cursor: 'pointer', transition: 'all .18s',
                                    border: `1.5px solid ${isSelected ? selBdr : 'var(--border)'}`,
                                    background: isSelected ? selBg : 'var(--surface2)',
                                    boxShadow: isSelected ? `0 4px 16px ${selShadow}` : undefined,
                                    transform: isSelected ? 'translateY(-1px)' : undefined,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div style={{ padding: '7px 14px', fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', background: headBg, color: headClr }}>
                                    {level === 1 ? 'Junior' : level === 2 ? 'Middle' : 'Senior'}
                                  </div>
                                  <div style={{ padding: '10px 14px', fontSize: '12px', color: isSelected ? 'var(--text)' : 'var(--muted)', lineHeight: 1.55 }}>
                                    {text}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}

                    {/* Competency example */}
                    <div style={{ marginTop: '1rem' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--hint)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 5 }}>
                        Кейс или конкретный пример из практики
                      </label>
                      <textarea
                        value={compExamples[comp.id] ?? ''}
                        onChange={e => setCompExamples(prev => ({ ...prev, [comp.id]: e.target.value }))}
                        placeholder="Ситуация, которая лучше всего отражает ваш уровень по этой компетенции..."
                        style={{
                          width: '100%', padding: '8px 14px', border: '1px solid var(--border)',
                          borderRadius: 3, fontSize: 12, color: 'var(--text)', background: 'var(--surface2)',
                          outline: 'none', fontFamily: 'inherit', resize: 'vertical', minHeight: 56, lineHeight: 1.55,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Self questions (frequency scale) */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.25rem' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: '1.25rem' }}>
                      Кейс-секция
                    </div>

                    {comp.self_qs.map((q, qi) => {
                      const selected = freqAnswers[comp.id]?.[qi]
                      return (
                        <div key={qi} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: qi < comp.self_qs.length - 1 ? '1px solid var(--border)' : undefined }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: '.5rem', lineHeight: 1.55 }}>
                            {qi + 1}. {q.q}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.75rem', fontStyle: 'italic' }}>
                            {q.hint}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {FREQ_LABELS.map((label, fi) => {
                              const val = fi + 1
                              const isSel = selected === val
                              const selColors = [
                                { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
                                { bg: '#FFF7ED', border: '#FED7AA', color: '#9A3412' },
                                { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' },
                                { bg: 'var(--blue-bg)',  border: 'var(--blue-light)',  color: 'var(--blue)'  },
                                { bg: 'var(--green-bg)', border: 'var(--green-light)', color: 'var(--green)' },
                              ]
                              const sc = selColors[fi]
                              return (
                                <button
                                  key={val}
                                  onClick={() => setFreq(comp.id, qi, val)}
                                  style={{
                                    padding: '5px 13px', borderRadius: 3, fontSize: 12, fontWeight: isSel ? 600 : 500,
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                                    background: isSel ? sc.bg : 'var(--surface2)',
                                    border: `1.5px solid ${isSel ? sc.border : 'var(--border)'}`,
                                    color: isSel ? sc.color : 'var(--muted)',
                                  }}
                                >
                                  {val} — {label}
                                </button>
                              )
                            })}
                          </div>
                          {selected !== undefined && (
                            <div style={{ marginTop: '.75rem' }}>
                              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--hint)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 5 }}>
                                Конкретный пример из практики
                              </label>
                              <textarea
                                value={examples[comp.id]?.[qi] ?? ''}
                                onChange={e => setExample(comp.id, qi, e.target.value)}
                                placeholder="Ситуация, когда это проявилось..."
                                style={{
                                  width: '100%', padding: '8px 14px', border: '1px solid var(--border)',
                                  borderRadius: 3, fontSize: 12, color: 'var(--text)', background: 'var(--surface2)',
                                  outline: 'none', fontFamily: 'inherit', resize: 'vertical', minHeight: 52, lineHeight: 1.55,
                                  boxSizing: 'border-box',
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* General note */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border)' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: 7 }}>
            Что хочу развивать — мои приоритеты роста
          </label>
          <textarea
            value={generalNote}
            onChange={e => setGeneralNote(e.target.value)}
            placeholder="Что даётся труднее всего? Какие навыки хочу прокачать? Какую поддержку жду от руководителя?"
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
            onClick={() => setSubmitted(true)}
            disabled={!allDone}
            style={{ opacity: allDone ? 1 : .45, background: 'var(--purple)', borderColor: 'var(--purple)' }}
          >
            Завершить само-оценку ({doneCount} / 9)
          </button>
          <a href="/employee" className="btn">Сохранить и выйти</a>
        </div>
      </div>
    </>
  )
}
