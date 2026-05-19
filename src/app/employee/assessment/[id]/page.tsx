'use client'

import { useState } from 'react'

const COMPETENCIES = [
  { name: 'Стратегическое мышление', desc: 'Умение видеть долгосрочную перспективу, выстраивать продуктовую стратегию, расставлять приоритеты с учётом бизнес-целей.' },
  { name: 'Работа с данными', desc: 'Навыки анализа метрик, A/B тестирования, формулировки гипотез и принятия решений на основе данных.' },
  { name: 'Управление командой', desc: 'Способность координировать работу кросс-функциональной команды, выстраивать процессы и мотивировать участников.' },
  { name: 'Коммуникация', desc: 'Умение чётко и структурированно доносить идеи до разных аудиторий: бизнес, разработчики, стейкхолдеры.' },
  { name: 'Технические знания', desc: 'Понимание технических ограничений и возможностей, способность участвовать в архитектурных обсуждениях.' },
  { name: 'Управление продуктом', desc: 'Навыки работы с бэклогом, пользовательскими историями, роадмэпом и delivery-процессами.' },
  { name: 'Клиентоориентированность', desc: 'Умение выявлять потребности пользователей, проводить исследования, строить продукт вокруг ценности для клиента.' },
  { name: 'Agile / процессы', desc: 'Применение agile-практик (Scrum, Kanban), организация спринтов, ретроспектив и улучшение командных процессов.' },
  { name: 'Лидерство', desc: 'Способность вести за собой, принимать ответственные решения, развивать других и формировать продуктовую культуру.' },
]

const SCORE_LABELS: Record<number, { short: string; long: string; color: string }> = {
  0: { short: '0', long: 'Не проявляется', color: 'var(--hint)' },
  1: { short: '1', long: 'Базовый', color: 'var(--amber)' },
  2: { short: '2', long: 'Уверенный', color: 'var(--blue)' },
  3: { short: '3', long: 'Экспертный', color: 'var(--green)' },
}

function getGradeInfo(avg: number) {
  if (avg >= 2.8)  return { label: 'Сеньор Ранг 3', cls: 'badge-s' }
  if (avg >= 2.6)  return { label: 'Сеньор Ранг 2', cls: 'badge-s' }
  if (avg >= 2.4)  return { label: 'Сеньор Ранг 1', cls: 'badge-s' }
  if (avg >= 2.13) return { label: 'Мидл Ранг 3',   cls: 'badge-m' }
  if (avg >= 1.87) return { label: 'Мидл Ранг 2',   cls: 'badge-m' }
  if (avg >= 1.6)  return { label: 'Мидл Ранг 1',   cls: 'badge-m' }
  if (avg >= 1.33) return { label: 'Джуниор Ранг 3', cls: 'badge-j' }
  if (avg >= 1.07) return { label: 'Джуниор Ранг 2', cls: 'badge-j' }
  if (avg >= 0.8)  return { label: 'Джуниор Ранг 1', cls: 'badge-j' }
  return { label: 'Ниже Джуниора', cls: 'badge-j' }
}

export default function EmployeeAssessmentPage() {
  const [scores, setScores] = useState<Record<number, number>>({})
  const [comments, setComments] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const rated = Object.keys(scores).length
  const allDone = rated === COMPETENCIES.length

  const avg = allDone
    ? Object.values(scores).reduce((s, v) => s + v, 0) / COMPETENCIES.length
    : 0
  const grade = allDone ? getGradeInfo(avg) : null

  function setScore(idx: number, score: number) {
    setScores(prev => ({ ...prev, [idx]: score }))
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <div className="topbar">
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Q1 2025 — PO Assessment</h1>
        </div>
        <div className="page-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ fontSize: '56px', marginBottom: '1.5rem' }}>🎉</div>
            <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '.75rem', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Само-оценка завершена!
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Ваши ответы сохранены. Результаты будут доступны только вашему руководителю и HR.
              После завершения цикла вы вместе разберёте результаты на 1:1.
            </p>
            <div style={{
              background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'inline-block',
            }}>
              <div style={{ fontSize: '12px', color: 'var(--hint)', marginBottom: '.25rem' }}>Предварительный результат</div>
              <div style={{ fontSize: '11px', color: 'var(--hint)' }}>Виден только вам до завершения цикла</div>
            </div>
            <div>
              <a href="/employee" className="btn btn-primary">← Вернуться к ассесментам</a>
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
          <a href="/employee" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Ассесменты</a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Q1 2025 — PO Assessment</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div className="prog-track" style={{ width: '140px' }}>
            <div className="prog-fill prog-fill-purple" style={{ width: `${(rated / COMPETENCIES.length) * 100}%` }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{rated} / {COMPETENCIES.length}</span>
        </div>
      </div>

      <div className="page-body">
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          padding: '.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6,
        }}>
          Оцените себя по каждой компетенции: насколько уверенно вы владеете навыком прямо сейчас, в вашей текущей работе.
          Будьте честны — это поможет выявить зоны роста и составить план развития вместе с руководителем.
        </div>

        {COMPETENCIES.map(({ name, desc }, idx) => {
          const selected = scores[idx]
          const hasScore = selected !== undefined
          return (
            <div
              key={name}
              className="card"
              style={{
                marginBottom: '.75rem',
                borderLeft: hasScore ? '3px solid var(--purple)' : undefined,
              }}
            >
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.875rem' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--hint)', marginBottom: '.25rem' }}>
                      Компетенция {idx + 1} из {COMPETENCIES.length}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.375rem' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                  {hasScore ? (
                    <span className="status status-done">Оценено: {selected}</span>
                  ) : (
                    <span className="status status-pending">Не оценено</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.5rem' }}>
                  {[0, 1, 2, 3].map(score => {
                    const info = SCORE_LABELS[score]
                    const isSelected = selected === score
                    return (
                      <button
                        key={score}
                        onClick={() => setScore(idx, score)}
                        className="btn btn-sm"
                        style={{
                          padding: '.625rem .5rem',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '.25rem',
                          height: 'auto',
                          background: isSelected ? 'var(--surface3, rgba(139,92,246,.12))' : undefined,
                          border: isSelected ? `1px solid var(--purple)` : undefined,
                        }}
                      >
                        <span style={{ fontSize: '20px', fontWeight: 700, color: info.color }}>{info.short}</span>
                        <span style={{ fontSize: '11px', color: isSelected ? 'var(--text)' : 'var(--muted)', lineHeight: 1.3 }}>
                          {info.long}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {hasScore && (
                  <textarea
                    value={comments[idx] ?? ''}
                    onChange={e => setComments(prev => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="Добавьте комментарий (необязательно)..."
                    style={{
                      marginTop: '.75rem',
                      width: '100%',
                      padding: '.625rem .75rem',
                      fontSize: '13px',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      background: 'var(--surface2)',
                      color: 'var(--text)',
                      resize: 'vertical',
                      minHeight: '56px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem', marginTop: '1rem', paddingBottom: '2rem' }}>
          <a href="/employee" className="btn btn-sm">Сохранить и выйти</a>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!allDone}
            style={{ opacity: allDone ? 1 : .5 }}
          >
            Завершить само-оценку ({rated} / {COMPETENCIES.length})
          </button>
        </div>
      </div>
    </>
  )
}
