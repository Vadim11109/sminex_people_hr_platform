export default function HrDashboard() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>HR Дашборд</h1>
          <span className="role-pill role-pill-hr">HR</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--muted)', padding: '5px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px' }}>
          Q1 2025 · до 31 марта
        </span>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          <div className="stat-card stat-accent-blue">
            <div className="stat-label">Сотрудников</div>
            <div className="stat-value">33</div>
            <div className="stat-sub">всего в системе</div>
          </div>
          <div className="stat-card stat-accent-amber">
            <div className="stat-label">Само-оценок</div>
            <div className="stat-value">12 / 33</div>
            <div className="stat-sub">в текущем цикле</div>
          </div>
          <div className="stat-card stat-accent-green">
            <div className="stat-label">Оценок руководителей</div>
            <div className="stat-value">4 / 33</div>
            <div className="stat-sub">в текущем цикле</div>
          </div>
          <div className="stat-card stat-accent-purple">
            <div className="stat-label">Активных команд</div>
            <div className="stat-value">6</div>
            <div className="stat-sub">участвуют в Q1 2025</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Cycle progress */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Прогресс цикла — Q1 2025</div>
                <div className="card-sub">Статус заполнения по командам</div>
              </div>
              <a href="/hr/cycles" className="btn btn-sm">Управление →</a>
            </div>
            <div className="card-body">
              {[
                { team: 'IT-продукты',       done: 4, total: 8 },
                { team: 'Строительство',      done: 3, total: 6 },
                { team: 'Коммерческий отдел', done: 2, total: 7 },
                { team: 'Финансы',            done: 1, total: 5 },
                { team: 'HR',                 done: 2, total: 4 },
                { team: 'Управление',         done: 0, total: 3 },
              ].map(({ team, done, total }) => (
                <div key={team} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '.375rem' }}>
                    <span style={{ fontWeight: 500 }}>{team}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>{done} / {total}</span>
                  </div>
                  <div className="prog-track">
                    <div
                      className="prog-fill prog-fill-purple"
                      style={{ width: `${Math.round((done / total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade distribution */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Распределение грейдов</div>
                <div className="card-sub">По завершённым оценкам Q1 2025</div>
              </div>
              <a href="/hr/analytics" className="btn btn-sm">Подробнее →</a>
            </div>
            <div className="card-body">
              {[
                { label: 'Сеньор', cls: 'badge-s', count: 3, pct: 18 },
                { label: 'Мидл', cls: 'badge-m', count: 8, pct: 50 },
                { label: 'Джуниор', cls: 'badge-j', count: 5, pct: 31 },
              ].map(({ label, cls, count, pct }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span className={`badge ${cls}`} style={{ minWidth: '90px', textAlign: 'center' }}>{label}</span>
                  <div className="prog-track" style={{ flex: 1 }}>
                    <div className="prog-fill prog-fill-purple" style={{ width: `${pct}%` }} />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', minWidth: '40px', textAlign: 'right' }}>{count} чел.</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '.5rem' }}>
                <div style={{ fontSize: '12px', color: 'var(--hint)', marginBottom: '.625rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  Ещё не оценены
                </div>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>32 сотрудника ожидают завершения цикла</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-head">
            <div className="card-title">Последняя активность</div>
          </div>
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Действие</th>
                  <th>Команда</th>
                  <th>Время</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Анна Сидорова',   initials: 'АС', action: 'Завершила само-оценку',  team: 'IT-продукты',       time: '2 ч. назад' },
                  { name: 'Алексей Воронов', initials: 'АВ', action: 'Оценил 2 сотрудников',   team: 'IT-продукты',       time: '5 ч. назад' },
                  { name: 'Дмитрий Козлов',  initials: 'ДК', action: 'Начал само-оценку',       team: 'IT-продукты',       time: 'вчера' },
                  { name: 'Марина Волкова',  initials: 'МВ', action: 'Завершила само-оценку',  team: 'Строительство',     time: 'вчера' },
                ].map(({ name, initials, action, team, time }) => (
                  <tr key={name}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                        <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>{initials}</div>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>{action}</td>
                    <td><span style={{ fontSize: '12px', color: 'var(--muted)' }}>{team}</span></td>
                    <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>{time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
