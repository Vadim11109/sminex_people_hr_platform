'use client'

import { useState } from 'react'
import { getGradeInfo, getSummaryText } from '@/lib/assessment-data'
import { CompetencyBreakdown } from '@/components/ui/CompetencyBreakdown'
import { EmptyState } from '@/components/ui/EmptyState'

// Заглушка завершённого цикла текущего сотрудника (в модуле — из БД).
const mgrScores  = [2.17, 1.83, 2.33, 2.0,  2.5,  2.17, 2.67, 2.0,  1.83]
const selfScores = [2.33, 2.0,  2.5,  2.17, 2.67, 2.33, 2.83, 2.17, 2.0 ]
const mgrComment  = 'Уверенно ведёт продукт и хорошо работает с бизнес-заказчиками. Для перехода на следующий ранг стоит поработать над системностью анализа корневых причин и глубиной работы с метриками.'
const selfComment = 'Хочу прокачать работу с данными — сейчас часто готовлю аналитику по запросу, а не проактивно. Также хочу больше практики в защите решений перед топ-менеджментом.'

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

function gradeCss(grade: string) {
  if (grade === 'S') return { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' }
  if (grade === 'M') return { bg: 'var(--green-bg)',  border: 'var(--green-light)', color: 'var(--green)' }
  if (grade === 'J') return { bg: 'var(--blue-bg)',   border: 'var(--blue-light)',  color: 'var(--blue)'  }
  return { bg: 'var(--surface2)', border: 'var(--border)', color: 'var(--hint)' }
}

export default function EmployeeResultsPage() {
  // В реальной системе доступ раскрывает руководитель. В прототипе — демо-переключатель.
  const [released, setReleased] = useState(false)

  const mgrAvg  = mean(mgrScores)
  const selfAvg = mean(selfScores)
  const gap     = selfAvg - mgrAvg
  const absDiff = Math.abs(gap)
  const mgrGi   = getGradeInfo(mgrAvg)
  const selfGi  = getGradeInfo(selfAvg)
  const mgrCss  = gradeCss(mgrGi.grade)
  const selfCss = gradeCss(selfGi.grade)

  let gapInterpret: string
  if (absDiff < 0.3)    gapInterpret = `Само-оценка и оценка руководителя совпадают (расхождение ${gap.toFixed(2)}). Высокий уровень рефлексии и самоосознанности.`
  else if (gap < 0)     gapInterpret = `Руководитель оценивает выше само-оценки (+${(-gap).toFixed(2)}). Возможно, вы недооцениваете свои сильные стороны — стоит обсудить это на встрече 1:1.`
  else                  gapInterpret = `Само-оценка выше оценки руководителя на ${gap.toFixed(2)}. Хорошая точка входа для развивающего диалога о том, как выглядят ожидания на следующем уровне.`

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Мои результаты</h1>
          <span className="role-pill role-pill-employee">Сотрудник</span>
        </div>
        {/* Демо-переключатель: в реальной системе доступ открывает руководитель */}
        <button
          className="btn btn-sm"
          onClick={() => setReleased(v => !v)}
          title="Демонстрация — в реальной системе доступ к результатам открывает руководитель после встречи 1:1"
          style={{ color: 'var(--muted)' }}
        >
          {released ? 'Скрыть доступ (демо)' : 'Открыть доступ (демо)'}
        </button>
      </div>

      <div className="page-body">
        {!released ? (
          <EmptyState
            tone="amber"
            icon="🔒"
            title="Результаты пока закрыты"
            text="Само-оценка завершена. Доступ к сводке открывает руководитель или HR — обычно после разговора 1:1. Как только откроют, здесь появятся ваша оценка, оценка руководителя и расхождение."
            chip={<>⏳ Ожидает открытия доступа</>}
          />
        ) : (
          <>
            {/* Cycle heading */}
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem' }}>
              Q4 2024 — PO Assessment · руководитель Алексей Воронов
            </div>

            {/* Score summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Само-оценка', value: selfAvg.toFixed(2), grade: selfGi.label, css: selfCss },
                { label: 'Оценка руководителя', value: mgrAvg.toFixed(2), grade: mgrGi.label, css: mgrCss },
                {
                  label: 'Расхождение (Gap)',
                  value: (gap > 0 ? '+' : '') + gap.toFixed(2),
                  grade: absDiff < 0.3 ? 'Совпадение' : gap > 0 ? 'Само-оценка выше' : 'Руководитель выше',
                  css: absDiff < 0.3
                    ? { bg: 'var(--green-bg)', border: 'var(--green-light)', color: 'var(--green)' }
                    : { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' },
                },
              ].map(({ label, value, grade, css }) => (
                <div key={label} style={{
                  textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1.25rem 1rem',
                  border: '1px solid var(--border)', borderTop: `3px solid ${css.color}`, boxShadow: '0 1px 6px rgba(0,0,0,.05)',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--hint)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '.5rem' }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 30, fontWeight: 700, lineHeight: 1, color: 'var(--text)' }}>{value}</div>
                  <div style={{ fontSize: 12, color: css.color, marginTop: '.375rem' }}>{grade}</div>
                </div>
              ))}
            </div>

            {/* Grade highlight + interpretation */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '10px 22px', borderRadius: 3, fontSize: 20, fontWeight: 700,
                    border: `2px solid ${mgrCss.border}`, background: mgrCss.bg, color: mgrCss.color,
                  }}>
                    {mgrGi.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    Ваш грейд по оценке руководителя · средний балл{' '}
                    <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{mgrAvg.toFixed(2)}</span> из 3.0
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{getSummaryText(mgrAvg, 9)}</p>
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--blue-light)', borderRadius: 3, padding: '1rem 1.25rem', marginTop: '1rem' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem' }}>
                    Интерпретация расхождений
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{gapInterpret}</p>
                </div>
              </div>
            </div>

            {/* Competency breakdown */}
            <CompetencyBreakdown mgrScores={mgrScores} selfScores={selfScores} />

            {/* Comments */}
            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-head"><div className="card-title">Комментарии</div></div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.625rem' }}>
                    Итоговый комментарий руководителя
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{mgrComment}</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '.625rem' }}>
                    Мои приоритеты роста
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{selfComment}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
