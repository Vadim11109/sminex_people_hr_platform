'use client'

import { useState } from 'react'
import { COMPETENCIES, getGradeInfo, type Competency } from '@/lib/assessment-data'

// ─── Уровни под-критериев (0 = «не могу оценить», 1–3 = Дж/Мидл/Сеньор) ─────────
const LEVELS: Record<number, { label: string; color: string; bg: string; border: string }> = {
  0: { label: 'Не могу оценить', color: 'var(--hint)',  bg: 'var(--surface2)', border: 'var(--border)' },
  1: { label: 'Джуниор',        color: 'var(--blue)',   bg: 'var(--blue-bg)',  border: 'var(--blue-light)' },
  2: { label: 'Мидл',           color: 'var(--green)',  bg: 'var(--green-bg)', border: 'var(--green-light)' },
  3: { label: 'Сеньор',         color: 'var(--amber)',  bg: 'var(--amber-bg)', border: 'var(--amber-light)' },
}

function LevelPill({ value }: { value: number | null }) {
  if (value == null) return <span style={{ color: 'var(--hint)' }}>—</span>
  const l = LEVELS[value] ?? LEVELS[0]
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 9px', borderRadius: 2, fontSize: 11, fontWeight: 600,
      color: l.color, background: l.bg, border: `1px solid ${l.border}`,
    }}>{l.label}</span>
  )
}

function gradeCss(grade: string) {
  if (grade === 'S') return { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' }
  if (grade === 'M') return { bg: 'var(--green-bg)',  border: 'var(--green-light)', color: 'var(--green)' }
  if (grade === 'J') return { bg: 'var(--blue-bg)',   border: 'var(--blue-light)',  color: 'var(--blue)'  }
  return { bg: 'var(--surface2)', border: 'var(--border)', color: 'var(--hint)' }
}

function ScorePill({ avg }: { avg: number }) {
  const css = gradeCss(getGradeInfo(avg).grade)
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 9px', borderRadius: 2, fontSize: 11, fontWeight: 700,
      color: css.color, background: css.bg, border: `1px solid ${css.border}`, minWidth: 40, justifyContent: 'center',
    }}>{avg.toFixed(2)}</span>
  )
}

// ─── Детерминированный вывод под-критериев / кейсов из средних баллов ───────────
// В прототипе данных по под-критериям нет (STUB — только средние по компетенции),
// поэтому уровни выводим стабильно из среднего с лёгкой вариацией, чтобы показать
// расхождения. В корп-модуле эти данные приходят из БД (SummaryController.BuildDetails).
function subLevel(avg: number, compId: number, subIdx: number, side: 'self' | 'mgr'): number {
  const base = Math.max(1, Math.min(3, Math.round(avg)))
  const seed = (compId * 7 + subIdx * 13 + (side === 'self' ? 3 : 0)) % 5
  let lvl = base
  if (seed === 0) lvl = base + 1
  else if (seed === 1) lvl = base - 1
  return Math.max(1, Math.min(3, lvl))
}

function caseFreq(compId: number, qi: number): number {
  return 3 + ((compId + qi) % 3) // 3..5
}

// Демо-комментарии / примеры (в модуле — из ответов руководителя и сотрудника)
const MGR_COMMENTS: Record<number, string> = {
  1: 'Хорошо формулирует проблему, но иногда берётся за задачу в постановке заказчика без анализа корневой причины.',
  3: 'Backlog ведётся аккуратно; для следующего ранга — больше самостоятельности в приоритизации при конфликте интересов.',
  6: 'Метрики знает, но использует реактивно — стоит выстроить систему мониторинга и работать с outcome, а не output.',
}
const SELF_EXAMPLES: Record<number, string> = {
  1: 'В проекте X переформулировал запрос «сделайте отчёт» в задачу по корневой проблеме потери данных на стыке систем.',
  6: 'Начал готовить еженедельный дашборд по ключевым метрикам продукта без запроса от руководителя.',
}

export function CompetencyBreakdown({ mgrScores, selfScores }: { mgrScores: number[]; selfScores: number[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({})

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div className="card-head">
        <div>
          <div className="card-title">Разбор по компетенциям</div>
          <div className="card-sub">Под-критерии с оценками обеих сторон, комментарии и ответы кейс-секции. Строки с расхождением подсвечены.</div>
        </div>
      </div>
      <div className="card-body-flush">
        {COMPETENCIES.map((comp, i) => {
          const mAvg = mgrScores[i]
          const sAvg = selfScores[i]
          const diff = sAvg - mAvg
          const match = Math.abs(diff) < 0.3
          const isOpen = !!open[comp.id]
          return (
            <div key={comp.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <div
                onClick={() => setOpen(p => ({ ...p, [comp.id]: !p[comp.id] }))}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '.8rem 1.25rem', cursor: 'pointer', userSelect: 'none', flexWrap: 'wrap' }}
              >
                <span style={{ color: 'var(--hint)', fontSize: 15, transform: isOpen ? 'rotate(90deg)' : undefined, transition: 'transform .18s' }}>›</span>
                <span style={{ fontWeight: 600, fontSize: 13, flex: 1, minWidth: 150 }}>{comp.id}. {comp.name}</span>
                <span style={{ fontSize: 11, color: 'var(--hint)' }}>Сотр.</span>
                <ScorePill avg={sAvg} />
                <span style={{ fontSize: 11, color: 'var(--hint)' }}>Рук.</span>
                <ScorePill avg={mAvg} />
                <span style={{
                  marginLeft: 4, display: 'inline-flex', padding: '2px 9px', borderRadius: 2, fontSize: 11, fontWeight: 600,
                  color: match ? 'var(--green)' : 'var(--amber)',
                  background: match ? 'var(--green-bg)' : 'var(--amber-bg)',
                  border: `1px solid ${match ? 'var(--green-light)' : 'var(--amber-light)'}`,
                }}>{match ? '≈' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`}</span>
              </div>
              {isOpen && <BreakdownDetail comp={comp} mAvg={mAvg} sAvg={sAvg} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BreakdownDetail({ comp, mAvg, sAvg }: { comp: Competency; mAvg: number; sAvg: number }) {
  const mgrComment = MGR_COMMENTS[comp.id]
  const selfExample = SELF_EXAMPLES[comp.id]

  return (
    <div style={{ padding: '.25rem 1.25rem 1.25rem 2.4rem', background: 'var(--surface2)' }}>
      {/* Sub-criteria table */}
      <div style={{ display: 'flex', gap: 10, padding: '8px 10px 6px', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--hint)' }}>
        <span style={{ flex: 1 }}>Под-критерий</span>
        <span style={{ width: 120, textAlign: 'right' }}>Сотрудник</span>
        <span style={{ width: 120, textAlign: 'right' }}>Руководитель</span>
      </div>
      {comp.subs.map((sub, i) => {
        const s = subLevel(sAvg, comp.id, i, 'self')
        const m = subLevel(mAvg, comp.id, i, 'mgr')
        const disc = s > 0 && m > 0 && s !== m
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, background: disc ? '#FDF4E6' : undefined, marginBottom: 3 }}>
            <span style={{ flex: 1, fontSize: 12.5 }}>{i + 1}. {sub.name}</span>
            <div style={{ width: 120, textAlign: 'right' }}><LevelPill value={s} /></div>
            <div style={{ width: 120, textAlign: 'right' }}><LevelPill value={m} /></div>
          </div>
        )
      })}

      {/* Comments / example */}
      {(mgrComment || selfExample) && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mgrComment && (
            <div style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue-light)', borderRadius: 8, padding: '10px 14px', fontSize: 13, lineHeight: 1.55 }}>
              <b style={{ color: 'var(--blue)' }}>Комментарий руководителя:</b> {mgrComment}
            </div>
          )}
          {selfExample && (
            <div style={{ background: 'var(--purple-bg)', border: '1px solid var(--purple-light)', borderRadius: 8, padding: '10px 14px', fontSize: 13, lineHeight: 1.55 }}>
              <b style={{ color: 'var(--purple)' }}>Пример сотрудника:</b> {selfExample}
            </div>
          )}
        </div>
      )}

      {/* Case answers */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: 6 }}>
          Кейс-секция — ответы сотрудника <span style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0, fontStyle: 'italic' }}>(контекст, не влияет на балл)</span>
        </div>
        {comp.self_qs.map((q, qi) => (
          <div key={qi} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: qi < comp.self_qs.length - 1 ? '1px solid var(--border)' : undefined }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.5 }}>{q.q}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Частота: <b>{caseFreq(comp.id, qi)} / 5</b></div>
          </div>
        ))}
      </div>
    </div>
  )
}
