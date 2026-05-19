export default async function EmployeeDashboard() {
  const session = { user: { name: 'Иван Петров' } }

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Мои ассесменты</h1>
          <span className="role-pill role-pill-employee">Сотрудник</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '5px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--muted)' }}>
            🔔 1 активный цикл
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Active assessment */}
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem' }}>
          Активный
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--purple)',
          borderRadius: 'var(--radius)', padding: '1.5rem 1.75rem', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem',
        }}>
          <div style={{ fontSize: '28px' }}>📝</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.25rem' }}>Q1 2025 — PO Assessment</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📅 Срок: 31 марта 2025</span>
              <span>👤 Руководитель: Алексей Морозов</span>
              <span>🏢 IT Products</span>
            </div>
            <div style={{ marginTop: '.75rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div className="prog-track" style={{ width: '200px' }}>
                <div className="prog-fill prog-fill-purple" style={{ width: '33%' }}></div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>3 из 9 компетенций</span>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <span className="status status-progress">В процессе</span>
            <br/>
            <a href="/employee/assessment/current" className="btn btn-primary btn-sm" style={{ marginTop: '.75rem', display: 'inline-flex' }}>
              Продолжить →
            </a>
          </div>
        </div>

        {/* Completed */}
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.875rem', marginTop: '2rem' }}>
          Завершённые
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--green)',
          borderRadius: 'var(--radius)', padding: '1.5rem 1.75rem', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem', opacity: .7,
        }}>
          <div style={{ fontSize: '28px' }}>✅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.25rem' }}>Q4 2024 — PO Assessment</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>📅 Завершён: 15 декабря 2024 · 👤 Алексей Морозов</div>
          </div>
          <span className="status status-done">Завершён</span>
        </div>

        {/* Info note */}
        <div style={{
          background: 'var(--amber-bg)', border: '1px solid var(--amber-light)', borderRadius: 'var(--radius)',
          padding: '1rem 1.25rem', marginTop: '1.5rem', display: 'flex', gap: '.875rem', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <div style={{ fontSize: '13px', color: 'var(--amber)', lineHeight: 1.7 }}>
            <strong>Результаты само-оценки</strong> видны только вашему руководителю и HR — после завершения вы вместе разберёте результаты на 1:1.
          </div>
        </div>
      </div>
    </>
  )
}
