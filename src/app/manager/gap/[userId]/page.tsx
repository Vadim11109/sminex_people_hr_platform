import { COMPETENCIES, getGradeInfo, getSummaryText } from '@/lib/assessment-data'

interface Props { params: Promise<{ userId: string }> }

// Stub completed assessment data (will come from DB)
const STUB_DATA: Record<string, { mgrScores: number[]; selfScores: number[] }> = {
  '2': {
    mgrScores:  [2.17, 1.83, 2.33, 2.0,  2.5,  2.17, 2.67, 2.0,  1.83],
    selfScores: [2.33, 2.0,  2.5,  2.17, 2.67, 2.33, 2.83, 2.17, 2.0 ],
  },
}

export default async function ManagerGapPage({ params }: Props) {
  const { userId } = await params

  const EMPLOYEES: Record<string, { name: string; initials: string; prevGrade: string; prevCls: string }> = {
    '1': { name: 'Иван Петров',    initials: 'ИП', prevGrade: 'Мидл Ранг 1',    prevCls: 'badge-m' },
    '2': { name: 'Анна Сидорова',  initials: 'АС', prevGrade: 'Мидл Ранг 3',    prevCls: 'badge-m' },
    '3': { name: 'Дмитрий Козлов', initials: 'ДК', prevGrade: 'Джуниор Ранг 3', prevCls: 'badge-j' },
  }
  const emp  = EMPLOYEES[userId] ?? { name: 'Сотрудник', initials: '??', prevGrade: '—', prevCls: 'badge-j' }
  const data = STUB_DATA[userId]

  if (!data) {
    return (
      <>
        <div className="topbar">
          <a href="/manager/results" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Результаты</a>
        </div>
        <div className="page-body" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
          <p>Обе оценки ещё не завершены — gap-анализ будет доступен после их заполнения.</p>
        </div>
      </>
    )
  }

  const { mgrScores, selfScores } = data
  const mgrAvg  = mgrScores.reduce((a, b) => a + b, 0)  / mgrScores.length
  const selfAvg = selfScores.reduce((a, b) => a + b, 0) / selfScores.length
  const gap     = selfAvg - mgrAvg
  const mgrGi   = getGradeInfo(mgrAvg)
  const selfGi  = getGradeInfo(selfAvg)

  const absDiff = Math.abs(gap)
  let gapInterpret: string
  if (absDiff < 0.3)    gapInterpret = `Само-оценка и оценка руководителя совпадают (расхождение ${gap.toFixed(2)}). Высокий уровень рефлексии и самоосознанности.`
  else if (gap < 0)     gapInterpret = `Руководитель оценивает выше само-оценки (+${(-gap).toFixed(2)}). Сотрудник может недооценивать свои сильные стороны. Стоит обсудить, в чём проявляется неуверенность.`
  else                  gapInterpret = `Само-оценка выше оценки руководителя на ${gap.toFixed(2)}. Возможна переоценка компетенций — хорошая точка входа для развивающего диалога.`

  function gradeCss(grade: string) {
    if (grade === 'S') return { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' }
    if (grade === 'M') return { bg: 'var(--green-bg)',  border: 'var(--green-light)', color: 'var(--green)' }
    if (grade === 'J') return { bg: 'var(--blue-bg)',   border: 'var(--blue-light)',  color: 'var(--blue)'  }
    return { bg: 'var(--surface2)', border: 'var(--border)', color: 'var(--hint)' }
  }
  const mgrCss  = gradeCss(mgrGi.grade)
  const selfCss = gradeCss(selfGi.grade)

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <a href="/manager/results" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Результаты</a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Gap-анализ: {emp.name}</h1>
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)', padding: '5px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 3 }}>
          Q1 2025
        </span>
      </div>

      <div className="page-body">
        {/* Summary header */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div className="avatar" style={{ width: 48, height: 48, fontSize: 17 }}>{emp.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '.375rem' }}>{emp.name}</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: 12, color: 'var(--muted)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span>Прошлый грейд: <span className={`badge ${emp.prevCls}`}>{emp.prevGrade}</span></span>
                  <span style={{ color: 'var(--border)' }}>→</span>
                  <span>Новый грейд (по оценке руководителя): <span style={{
                    display: 'inline-flex', padding: '3px 10px', borderRadius: 2, fontSize: 11, fontWeight: 600,
                    border: `1px solid ${mgrCss.border}`, background: mgrCss.bg, color: mgrCss.color,
                  }}>{mgrGi.label}</span></span>
                </div>
              </div>
            </div>

            {/* Score summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.25rem' }}>
              {[
                { label: 'Само-оценка', value: selfAvg.toFixed(2), grade: selfGi.label, css: selfCss },
                { label: 'Оценка руководителя', value: mgrAvg.toFixed(2), grade: mgrGi.label, css: mgrCss },
                {
                  label: 'Gap (само − руководитель)',
                  value: (gap > 0 ? '+' : '') + gap.toFixed(2),
                  grade: absDiff < 0.3 ? 'Совпадение' : gap > 0 ? 'Завышена само-оценка' : 'Занижена само-оценка',
                  css: absDiff < 0.3
                    ? { bg: 'var(--green-bg)', border: 'var(--green-light)', color: 'var(--green)' }
                    : { bg: 'var(--amber-bg)', border: 'var(--amber-light)', color: 'var(--amber)' },
                },
              ].map(({ label, value, grade, css }) => (
                <div key={label} style={{
                  textAlign: 'center', background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1rem',
                  border: `1px solid ${css.border}`,
                }}>
                  <div style={{ fontSize: 11, color: 'var(--hint)', marginBottom: '.25rem' }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: css.color, marginBottom: '.25rem' }}>{value}</div>
                  <div style={{ fontSize: 11, color: css.color }}>{grade}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grade summary boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {/* Manager result */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.5rem 2rem' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.875rem' }}>
              Оценка руководителя (9/9 компетенций)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                padding: '10px 22px', borderRadius: 3, fontSize: 20, fontWeight: 700, border: `2px solid ${mgrCss.border}`,
                background: mgrCss.bg, color: mgrCss.color,
              }}>
                {mgrGi.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                Средний балл: <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>{mgrAvg.toFixed(2)}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}> из 3.0</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{getSummaryText(mgrAvg, 9)}</p>

            {/* Score bars */}
            <div style={{ marginTop: '.875rem' }}>
              {COMPETENCIES.map((c, i) => {
                const s = mgrScores[i]
                const gi = getGradeInfo(s)
                const css2 = gradeCss(gi.grade)
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', width: 200, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.id}. {c.name.length > 28 ? c.name.substring(0, 28) + '…' : c.name}
                    </div>
                    <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div style={{ height: '100%', width: `${(s / 3) * 100}%`, background: css2.color, borderRadius: 99, transition: 'width .6s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, width: 80, textAlign: 'right', color: 'var(--muted)', flexShrink: 0 }}>
                      {gi.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Self result */}
          <div style={{ background: 'var(--purple-bg, #F5EEFA)', border: '1px solid var(--purple-light, #CDB8E0)', borderRadius: 'var(--radius)', padding: '1.5rem 2rem' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '.875rem' }}>
              Само-оценка (9/9 компетенций)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                padding: '10px 22px', borderRadius: 3, fontSize: 20, fontWeight: 700, border: `2px solid ${selfCss.border}`,
                background: selfCss.bg, color: selfCss.color,
              }}>
                {selfGi.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                Средний балл: <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>{selfAvg.toFixed(2)}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}> из 3.0</span>
              </div>
            </div>

            <div style={{ marginTop: '.875rem' }}>
              {COMPETENCIES.map((c, i) => {
                const s = selfScores[i]
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', width: 200, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.id}. {c.name.length > 28 ? c.name.substring(0, 28) + '…' : c.name}
                    </div>
                    <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--purple-light, #CDB8E0)' }}>
                      <div style={{ height: '100%', width: `${(s / 3) * 100}%`, background: 'var(--purple)', borderRadius: 99, transition: 'width .6s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, width: 80, textAlign: 'right', color: 'var(--muted)', flexShrink: 0 }}>
                      {getGradeInfo(s).label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Gap chart */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Анализ расхождений</div>
              <div className="card-sub">Само-оценка минус оценка руководителя по каждой компетенции</div>
            </div>
          </div>
          <div className="card-body">
            {/* Legend */}
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {[
                { color: 'var(--purple)', label: 'Завышена само-оценка' },
                { color: 'var(--red, #991B1B)', label: 'Занижена само-оценка' },
                { color: 'var(--green)', label: 'Совпадение' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>

            {COMPETENCIES.map((c, i) => {
              const m   = mgrScores[i]
              const s   = selfScores[i]
              const diff = s - m
              const pct  = (Math.abs(diff) / 3) * 100
              const isOver  = diff > 0.2
              const isUnder = diff < -0.2
              const barColor = isOver ? 'var(--purple)' : isUnder ? 'var(--red, #991B1B)' : 'var(--green)'
              const labelText = isOver ? `+${diff.toFixed(1)}` : isUnder ? diff.toFixed(1) : '≈'
              const labelColor = isOver ? 'var(--purple)' : isUnder ? 'var(--red, #991B1B)' : 'var(--green)'
              const leftPct = diff < 0 ? 50 - pct / 2 : 50

              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', width: 220, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.id}. {c.name.length > 28 ? c.name.substring(0, 28) + '…' : c.name}
                  </div>
                  <div style={{ flex: 1, position: 'relative', height: 18 }}>
                    {/* Center line */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 2, height: 18, background: 'var(--border2)' }} />
                    {/* Gap bar */}
                    <div style={{
                      position: 'absolute', top: 3, height: 12, borderRadius: 2,
                      background: barColor, opacity: .75, transition: 'all .6s ease',
                      left: diff < 0 ? `${leftPct}%` : '50%',
                      width: diff === 0 ? '2%' : `${pct / 2}%`,
                    }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, width: 70, textAlign: 'right', flexShrink: 0, color: labelColor }}>
                    {labelText}
                  </div>
                </div>
              )
            })}

            {/* Gap interpretation */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--blue-light)', borderRadius: 3, padding: '1.125rem 1.5rem', marginTop: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem' }}>
                Интерпретация расхождений
              </div>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{gapInterpret}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
