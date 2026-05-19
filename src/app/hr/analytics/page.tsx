export default function HrAnalyticsPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Аналитика</h1>
          <span className="role-pill role-pill-hr">HR</span>
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {['Q1 2025', 'Q4 2024', 'Q3 2024'].map((q, i) => (
            <button key={q} className={`btn btn-sm${i === 0 ? ' btn-primary' : ''}`}>{q}</button>
          ))}
        </div>
      </div>

      <div className="page-body">
        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          <div className="stat-card stat-accent-blue">
            <div className="stat-label">Средний балл по компании</div>
            <div className="stat-value">1.94</div>
            <div className="stat-sub">↑ +0.12 vs Q4 2024</div>
          </div>
          <div className="stat-card stat-accent-green">
            <div className="stat-label">Завершили оценку</div>
            <div className="stat-value">16</div>
            <div className="stat-sub">из 48 сотрудников</div>
          </div>
          <div className="stat-card stat-accent-amber">
            <div className="stat-label">Средний gap (само vs руководитель)</div>
            <div className="stat-value">−0.21</div>
            <div className="stat-sub">само-оценка выше</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Competency breakdown */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Оценка по компетенциям</div>
                <div className="card-sub">Средний балл руководителей · Q1 2025</div>
              </div>
            </div>
            <div className="card-body">
              {[
                { name: 'Стратегическое мышление', score: 2.4 },
                { name: 'Работа с данными', score: 2.1 },
                { name: 'Управление командой', score: 1.9 },
                { name: 'Коммуникация', score: 2.3 },
                { name: 'Технические знания', score: 1.7 },
                { name: 'Управление продуктом', score: 2.2 },
                { name: 'Клиентоориентированность', score: 2.5 },
                { name: 'Agile / процессы', score: 1.8 },
                { name: 'Лидерство', score: 1.6 },
              ].map(({ name, score }) => (
                <div key={name} style={{ marginBottom: '.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '.3rem' }}>
                    <span>{name}</span>
                    <span style={{ fontWeight: 600, color: score >= 2.4 ? 'var(--green)' : score >= 1.6 ? 'var(--blue)' : 'var(--amber)' }}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill prog-fill-purple" style={{ width: `${(score / 3) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gap analysis per team */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Gap-анализ по командам</div>
                <div className="card-sub">Само-оценка vs оценка руководителя</div>
              </div>
            </div>
            <div className="card-body-flush">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Команда</th>
                    <th>Само-оценка</th>
                    <th>Оценка руководителя</th>
                    <th>Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { team: 'IT Products', self: 2.15, mgr: 1.95 },
                    { team: 'Analytics', self: 2.30, mgr: 2.10 },
                    { team: 'Marketing', self: 1.85, mgr: 1.70 },
                    { team: 'Finance', self: 2.00, mgr: 1.90 },
                    { team: 'Operations', self: 1.75, mgr: 1.65 },
                  ].map(({ team, self, mgr }) => {
                    const gap = (self - mgr).toFixed(2)
                    const gapNum = parseFloat(gap)
                    return (
                      <tr key={team}>
                        <td style={{ fontSize: '13px', fontWeight: 500 }}>{team}</td>
                        <td style={{ fontSize: '13px' }}>{self.toFixed(2)}</td>
                        <td style={{ fontSize: '13px' }}>{mgr.toFixed(2)}</td>
                        <td>
                          <span style={{
                            fontSize: '12px', fontWeight: 600,
                            color: Math.abs(gapNum) > 0.3 ? 'var(--amber)' : 'var(--muted)',
                          }}>
                            {gapNum > 0 ? '+' : ''}{gap}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Grade movement */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-head">
            <div>
              <div className="card-title">Движение грейдов</div>
              <div className="card-sub">Q4 2024 → Q1 2025 (по завершённым оценкам)</div>
            </div>
          </div>
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Команда</th>
                  <th>Прошлый грейд</th>
                  <th>Текущий грейд</th>
                  <th>Изменение</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Анна Сидорова', team: 'IT Products', prev: 'Мидл Ранг 2', prevCls: 'badge-m', curr: 'Мидл Ранг 3', currCls: 'badge-m', change: '↑ Ранг +1' },
                  { name: 'Марина Волкова', team: 'Analytics', prev: 'Джуниор Ранг 3', prevCls: 'badge-j', curr: 'Мидл Ранг 1', currCls: 'badge-m', change: '↑ Повышение' },
                  { name: 'Алексей Морозов', team: 'IT Products', prev: 'Сеньор Ранг 2', prevCls: 'badge-s', curr: 'Сеньор Ранг 2', currCls: 'badge-s', change: '— Без изменений' },
                  { name: 'Роман Кузнецов', team: 'Finance', prev: 'Мидл Ранг 1', prevCls: 'badge-m', curr: 'Джуниор Ранг 3', currCls: 'badge-j', change: '↓ Снижение' },
                ].map(({ name, team, prev, prevCls, curr, currCls, change }) => (
                  <tr key={name}>
                    <td style={{ fontWeight: 500, fontSize: '13px' }}>{name}</td>
                    <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{team}</td>
                    <td><span className={`badge ${prevCls}`}>{prev}</span></td>
                    <td><span className={`badge ${currCls}`}>{curr}</span></td>
                    <td style={{
                      fontSize: '12px', fontWeight: 600,
                      color: change.startsWith('↑') ? 'var(--green)' : change.startsWith('↓') ? 'var(--amber)' : 'var(--muted)',
                    }}>
                      {change}
                    </td>
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
