export default function ManagerResultsPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Результаты команды</h1>
          <span className="role-pill role-pill-manager">Руководитель</span>
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {['Q1 2025', 'Q4 2024', 'Q3 2024'].map((q, i) => (
            <button key={q} className={`btn btn-sm${i === 0 ? ' btn-primary' : ''}`}>{q}</button>
          ))}
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          <div className="stat-card stat-accent-green">
            <div className="stat-label">Завершено оценок</div>
            <div className="stat-value">1 / 3</div>
            <div className="stat-sub">полный цикл (обе оценки)</div>
          </div>
          <div className="stat-card stat-accent-blue">
            <div className="stat-label">Средний балл команды</div>
            <div className="stat-value">2.15</div>
            <div className="stat-sub">по оценкам руководителя</div>
          </div>
          <div className="stat-card stat-accent-amber">
            <div className="stat-label">Средний gap</div>
            <div className="stat-value">−0.18</div>
            <div className="stat-sub">само-оценка выше средней</div>
          </div>
        </div>

        {/* Results table */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-head">
            <div className="card-title">Сводные результаты — Q1 2025</div>
          </div>
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Само-оценка (avg)</th>
                  <th>Оценка руководителя (avg)</th>
                  <th>Gap</th>
                  <th>Прошлый грейд</th>
                  <th>Новый грейд</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <div className="avatar">АС</div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>Анна Сидорова</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>2.31</td>
                  <td style={{ fontSize: '13px' }}>2.18</td>
                  <td style={{ fontSize: '12px', color: 'var(--muted)' }}>+0.13</td>
                  <td><span className="badge badge-m">Мидл Ранг 3</span></td>
                  <td><span className="badge badge-s">Сеньор Ранг 1</span></td>
                  <td><a href="/manager/gap/2" className="btn btn-sm">Gap-анализ →</a></td>
                </tr>
                <tr style={{ opacity: 0.55 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <div className="avatar avatar-purple">ИП</div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>Иван Петров</div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>В процессе</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><span className="badge badge-m">Мидл Ранг 1</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><button className="btn btn-sm" disabled style={{ opacity: .5 }}>Не готово</button></td>
                </tr>
                <tr style={{ opacity: 0.55 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <div className="avatar">ДК</div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>Дмитрий Козлов</div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>Не начато</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><span className="badge badge-j">Джуниор Ранг 3</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><button className="btn btn-sm" disabled style={{ opacity: .5 }}>Не готово</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
