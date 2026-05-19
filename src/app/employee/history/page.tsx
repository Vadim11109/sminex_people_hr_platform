export default function EmployeeHistoryPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>История оценок</h1>
          <span className="role-pill role-pill-employee">Сотрудник</span>
        </div>
      </div>

      <div className="page-body">
        {/* Grade trend */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-head">
            <div>
              <div className="card-title">Динамика грейда</div>
              <div className="card-sub">Изменение оценки за последние 4 цикла</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '80px', padding: '0 .5rem' }}>
              {[
                { cycle: 'Q2 2024', avg: 1.65, grade: 'М1', cls: 'badge-m' },
                { cycle: 'Q3 2024', avg: 1.82, grade: 'М2', cls: 'badge-m' },
                { cycle: 'Q4 2024', avg: 2.01, grade: 'М2', cls: 'badge-m' },
                { cycle: 'Q1 2025', avg: 2.18, grade: 'М3', cls: 'badge-m' },
              ].map(({ cycle, avg, grade, cls }, i) => (
                <div key={cycle} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.375rem', flex: 1 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{avg.toFixed(2)}</span>
                  <div style={{
                    width: '100%',
                    height: `${(avg / 3) * 70}px`,
                    background: i === 3 ? 'var(--purple)' : 'var(--surface3, var(--border))',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height .3s',
                  }} />
                  <span className={`badge ${cls}`} style={{ fontSize: '10px' }}>{grade}</span>
                  <span style={{ fontSize: '11px', color: 'var(--hint)' }}>{cycle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cycle list */}
        {[
          { cycle: 'Q1 2025', date: 'Март 2025', grade: 'Мидл Ранг 3', gradeCls: 'badge-m', avgSelf: 2.31, avgMgr: 2.18, status: 'done', isCurrent: true },
          { cycle: 'Q4 2024', date: 'Декабрь 2024', grade: 'Мидл Ранг 2', gradeCls: 'badge-m', avgSelf: 2.12, avgMgr: 2.01, status: 'done', isCurrent: false },
          { cycle: 'Q3 2024', date: 'Сентябрь 2024', grade: 'Мидл Ранг 2', gradeCls: 'badge-m', avgSelf: 1.95, avgMgr: 1.82, status: 'done', isCurrent: false },
          { cycle: 'Q2 2024', date: 'Июнь 2024', grade: 'Мидл Ранг 1', gradeCls: 'badge-m', avgSelf: 1.78, avgMgr: 1.65, status: 'done', isCurrent: false },
        ].map(({ cycle, date, grade, gradeCls, avgSelf, avgMgr, isCurrent }) => (
          <div
            key={cycle}
            className="card"
            style={{
              marginBottom: '.75rem',
              borderLeft: isCurrent ? '3px solid var(--purple)' : undefined,
              opacity: isCurrent ? 1 : 0.8,
            }}
          >
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontSize: '24px' }}>{isCurrent ? '📝' : '✅'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.375rem' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{cycle} — PO Assessment</span>
                  {isCurrent && <span className="status status-done">Текущий</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <span>📅 {date}</span>
                  <span>📊 Само: {avgSelf.toFixed(2)} · Руководитель: {avgMgr.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${gradeCls}`}>{grade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
