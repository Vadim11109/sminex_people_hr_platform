export default function HrTemplatesPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Шаблоны оценки</h1>
          <span className="role-pill role-pill-hr">HR</span>
        </div>
        <button className="btn btn-primary btn-sm">+ Новый шаблон</button>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            {
              name: 'Product Owner v2',
              desc: 'Актуальная версия для PO и PM. 9 компетенций, 3 уровня оценки.',
              competencies: 9,
              cycles: 4,
              active: true,
            },
            {
              name: 'Product Owner v1',
              desc: 'Первая версия шаблона PO. Архивная, использовалась до Q2 2024.',
              competencies: 8,
              cycles: 2,
              active: false,
            },
            {
              name: 'Tech Lead',
              desc: 'Для технических лидеров. В разработке.',
              competencies: 10,
              cycles: 0,
              active: false,
            },
          ].map(({ name, desc, competencies, cycles, active }) => (
            <div key={name} className="card" style={{ borderLeft: active ? '3px solid var(--purple)' : undefined }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.25rem' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                  {active && <span className="status status-done">Активный</span>}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '12px', color: 'var(--hint)', marginBottom: '1rem' }}>
                  <span>📋 {competencies} компетенций</span>
                  <span>🔄 Использован в {cycles} циклах</span>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="btn btn-sm">Просмотр</button>
                  <button className="btn btn-sm">Редактировать</button>
                  {!active && cycles === 0 && (
                    <button className="btn btn-sm" style={{ color: 'var(--amber)' }}>Удалить</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
