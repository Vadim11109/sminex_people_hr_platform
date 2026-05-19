interface Props {
  params: Promise<{ userId: string }>
}

const COMPETENCIES = [
  'Стратегическое мышление',
  'Работа с данными',
  'Управление командой',
  'Коммуникация',
  'Технические знания',
  'Управление продуктом',
  'Клиентоориентированность',
  'Agile / процессы',
  'Лидерство',
]

export default async function ManagerGapPage({ params }: Props) {
  const { userId } = await params

  // Stub data (will come from DB)
  const employees: Record<string, { name: string; initials: string; prevGrade: string; prevCls: string; newGrade: string; newCls: string }> = {
    '2': {
      name: 'Анна Сидорова',
      initials: 'АС',
      prevGrade: 'Мидл Ранг 3',
      prevCls: 'badge-m',
      newGrade: 'Сеньор Ранг 1',
      newCls: 'badge-s',
    },
  }

  const emp = employees[userId] ?? {
    name: 'Сотрудник',
    initials: '??',
    prevGrade: '—',
    prevCls: 'badge-j',
    newGrade: '—',
    newCls: 'badge-j',
  }

  // Stub scores
  const stubScores = [
    { self: 2.5, mgr: 2.4 },
    { self: 2.2, mgr: 2.0 },
    { self: 2.7, mgr: 2.5 },
    { self: 2.0, mgr: 1.8 },
    { self: 2.3, mgr: 2.1 },
    { self: 2.4, mgr: 2.3 },
    { self: 2.6, mgr: 2.5 },
    { self: 1.9, mgr: 1.8 },
    { self: 2.2, mgr: 2.0 },
  ]

  const avgSelf = (stubScores.reduce((s, r) => s + r.self, 0) / stubScores.length).toFixed(2)
  const avgMgr = (stubScores.reduce((s, r) => s + r.mgr, 0) / stubScores.length).toFixed(2)
  const avgGap = (parseFloat(avgSelf) - parseFloat(avgMgr)).toFixed(2)

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <a href="/manager/results" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Результаты</a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Gap-анализ: {emp.name}</h1>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--muted)', padding: '5px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px' }}>
          Q1 2025
        </span>
      </div>

      <div className="page-body">
        {/* Employee summary */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '17px' }}>{emp.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '.375rem' }}>{emp.name}</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', color: 'var(--muted)', flexWrap: 'wrap' }}>
                  <span>Прошлый грейд: <span className={`badge ${emp.prevCls}`}>{emp.prevGrade}</span></span>
                  <span>→</span>
                  <span>Новый грейд: <span className={`badge ${emp.newCls}`}>{emp.newGrade}</span></span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', minWidth: '320px' }}>
                {[
                  { label: 'Само-оценка', value: avgSelf, color: 'var(--blue)' },
                  { label: 'Оценка руководителя', value: avgMgr, color: 'var(--purple)' },
                  { label: 'Gap', value: `+${avgGap}`, color: Math.abs(parseFloat(avgGap)) > 0.3 ? 'var(--amber)' : 'var(--green)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ textAlign: 'center', background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '.75rem' }}>
                    <div style={{ fontSize: '11px', color: 'var(--hint)', marginBottom: '.25rem' }}>{label}</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competency table */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Оценка по компетенциям</div>
          </div>
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Компетенция</th>
                  <th>Само-оценка</th>
                  <th>Оценка руководителя</th>
                  <th>Gap</th>
                  <th>Визуализация</th>
                </tr>
              </thead>
              <tbody>
                {COMPETENCIES.map((comp, idx) => {
                  const { self, mgr } = stubScores[idx]
                  const gap = (self - mgr).toFixed(2)
                  const gapNum = parseFloat(gap)
                  return (
                    <tr key={comp}>
                      <td style={{ fontWeight: 500, fontSize: '13px' }}>{comp}</td>
                      <td style={{ fontSize: '13px', color: 'var(--blue)' }}>{self.toFixed(1)}</td>
                      <td style={{ fontSize: '13px', color: 'var(--purple)' }}>{mgr.toFixed(1)}</td>
                      <td style={{
                        fontSize: '12px', fontWeight: 600,
                        color: Math.abs(gapNum) > 0.3 ? 'var(--amber)' : 'var(--muted)',
                      }}>
                        {gapNum > 0 ? '+' : ''}{gap}
                      </td>
                      <td style={{ minWidth: '160px' }}>
                        <div style={{ position: 'relative', height: '10px', display: 'flex', gap: '2px' }}>
                          <div className="prog-track" style={{ flex: 1, margin: 0 }}>
                            <div style={{ height: '100%', width: `${(self / 3) * 100}%`, background: 'var(--blue)', borderRadius: '2px', opacity: 0.4 }} />
                          </div>
                          <div className="prog-track" style={{ flex: 1, margin: 0 }}>
                            <div style={{ height: '100%', width: `${(mgr / 3) * 100}%`, background: 'var(--purple)', borderRadius: '2px' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
