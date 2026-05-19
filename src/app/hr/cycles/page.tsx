export default function HrCyclesPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Циклы оценки</h1>
          <span className="role-pill role-pill-hr">HR</span>
        </div>
        <button className="btn btn-primary btn-sm">+ Создать цикл</button>
      </div>

      <div className="page-body">
        {/* Active cycle */}
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem' }}>
          Активный
        </div>
        <div className="card" style={{ marginBottom: '1rem', borderLeft: '3px solid var(--purple)' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Q1 2025 — PO Assessment</span>
                <span className="status status-progress">Активный</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <span>📅 Старт: 1 января 2025</span>
                <span>📅 Дедлайн: 31 марта 2025</span>
                <span>👤 48 участников</span>
                <span>📋 Шаблон: Product Owner v2</span>
              </div>
              <div style={{ marginTop: '.875rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div className="prog-track" style={{ width: '240px' }}>
                  <div className="prog-fill prog-fill-purple" style={{ width: '25%' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>12 / 48 само-оценок</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', flexShrink: 0 }}>
              <button className="btn btn-sm">Редактировать</button>
              <button className="btn btn-sm" style={{ color: 'var(--amber)' }}>Закрыть цикл</button>
            </div>
          </div>
        </div>

        {/* Past cycles */}
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem', marginTop: '2rem' }}>
          Завершённые
        </div>
        <div className="card">
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Период</th>
                  <th>Участников</th>
                  <th>Заполнено</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Q4 2024 — PO Assessment', start: 'Окт 2024', end: 'Дек 2024', total: 44, done: 44 },
                  { name: 'Q3 2024 — PO Assessment', start: 'Июл 2024', end: 'Сен 2024', total: 40, done: 38 },
                  { name: 'Q2 2024 — PO Assessment', start: 'Апр 2024', end: 'Июн 2024', total: 40, done: 36 },
                ].map(({ name, start, end, total, done }) => (
                  <tr key={name}>
                    <td style={{ fontWeight: 500, fontSize: '13px' }}>{name}</td>
                    <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{start} — {end}</td>
                    <td style={{ fontSize: '13px' }}>{total}</td>
                    <td style={{ fontSize: '13px' }}>{done} / {total}</td>
                    <td><span className="status status-done">Завершён</span></td>
                    <td><a href="#" className="btn btn-sm">Результаты</a></td>
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
