export default function ManagerDashboard() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Моя команда</h1>
          <span className="role-pill role-pill-manager">Руководитель</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--muted)', padding: '5px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px' }}>
          Q1 2025 · до 31 марта
        </span>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          <div className="stat-card stat-accent-blue">
            <div className="stat-label">Сотрудников</div>
            <div className="stat-value">3</div>
            <div className="stat-sub">в моей команде</div>
          </div>
          <div className="stat-card stat-accent-amber">
            <div className="stat-label">Само-оценок</div>
            <div className="stat-value">1 / 3</div>
            <div className="stat-sub">заполнено сотрудниками</div>
          </div>
          <div className="stat-card stat-accent-green">
            <div className="stat-label">Готовы к оценке</div>
            <div className="stat-value">1</div>
            <div className="stat-sub">ожидают вашей оценки</div>
          </div>
        </div>

        {/* Team table */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Статус ассесмента — Q1 2025</div>
              <div className="card-sub">Нажмите «Оценить» чтобы начать оценку сотрудника</div>
            </div>
          </div>
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Само-оценка</th>
                  <th>Оценка руководителя</th>
                  <th>Грейд (прошлый)</th>
                  <th>Gap-анализ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <div className="avatar">АС</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Анна Сидорова</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>a.sidorova@sminex.ru</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="status status-done">Готово</span></td>
                  <td><span className="status status-pending">Не начата</span></td>
                  <td><span className="badge badge-m">Мидл Ранг 3</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>— ждём оценки</span></td>
                  <td><a href="/manager/assess/2" className="btn btn-primary btn-sm">Оценить →</a></td>
                </tr>
                <tr style={{ opacity: 0.6 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <div className="avatar avatar-purple">ИП</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Иван Петров</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>i.petrov@sminex.ru</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="status status-progress">В процессе (3/9)</span></td>
                  <td><span className="status status-pending">Не начата</span></td>
                  <td><span className="badge badge-m">Мидл Ранг 1</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><button className="btn btn-sm" disabled style={{ opacity: .5 }}>Ожидаем само-оценку</button></td>
                </tr>
                <tr style={{ opacity: 0.6 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <div className="avatar">ДК</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Дмитрий Козлов</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>d.kozlov@sminex.ru</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="status status-pending">Не начата</span></td>
                  <td><span className="status status-pending">Не начата</span></td>
                  <td><span className="badge badge-j">Джуниор Ранг 3</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>—</span></td>
                  <td><button className="btn btn-sm" disabled style={{ opacity: .5 }}>Ожидаем само-оценку</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
