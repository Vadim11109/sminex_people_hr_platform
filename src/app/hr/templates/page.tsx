export default function HrTemplatesPage() {
  const templates = [
    {
      name: 'Product Owner v2',
      desc: 'Актуальная версия для PO и PM. 9 компетенций, 3 уровня оценки.',
      competencies: 9, cycles: 4, active: true, status: null,
    },
    {
      name: 'Product Owner v1',
      desc: 'Первая версия шаблона PO. Архивная, использовалась до Q2 2024.',
      competencies: 8, cycles: 2, active: false, status: 'archive',
    },
    {
      name: 'Backend разработчик',
      desc: 'Для серверной разработки: архитектура, код-ревью, надёжность систем.',
      competencies: 10, cycles: 0, active: false, status: 'draft',
    },
    {
      name: 'Frontend разработчик',
      desc: 'Для разработки интерфейсов: качество кода, UX-мышление, производительность.',
      competencies: 9, cycles: 0, active: false, status: 'draft',
    },
    {
      name: 'BIM-менеджер',
      desc: 'Управление информационными моделями зданий, координация проектирования.',
      competencies: 8, cycles: 0, active: false, status: 'draft',
    },
    {
      name: 'Инженер-строитель',
      desc: 'Технический надзор, контроль качества строительства, работа с подрядчиками.',
      competencies: 9, cycles: 0, active: false, status: 'draft',
    },
    {
      name: 'Менеджер по охране труда',
      desc: 'Соблюдение норм ОТиПБ на строительных объектах, проверки, обучение.',
      competencies: 7, cycles: 0, active: false, status: 'draft',
    },
    {
      name: 'Менеджер по продажам',
      desc: 'Продажа объектов недвижимости, работа с клиентами, воронка сделок.',
      competencies: 8, cycles: 0, active: false, status: 'draft',
    },
    {
      name: 'Оценщик недвижимости',
      desc: 'Оценка рыночной стоимости объектов, подготовка отчётов, экспертиза.',
      competencies: 7, cycles: 0, active: false, status: 'draft',
    },
    {
      name: 'Руководитель проекта',
      desc: 'Управление строительным проектом: сроки, бюджет, подрядчики, сдача объекта.',
      competencies: 10, cycles: 0, active: false, status: 'draft',
    },
  ]

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Шаблоны оценки</h1>
          <span className="role-pill role-pill-hr">HR</span>
          <span style={{ fontSize: '12px', color: 'var(--hint)' }}>{templates.length} шаблонов</span>
        </div>
        <button className="btn btn-primary btn-sm">+ Новый шаблон</button>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {templates.map(({ name, desc, competencies, cycles, active, status }) => (
            <div key={name} className="card" style={{ borderLeft: active ? '3px solid var(--purple)' : undefined }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.625rem' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.25rem' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {active && <span className="status status-done">Активный</span>}
                    {status === 'archive' && <span className="status status-pending">Архив</span>}
                    {status === 'draft' && (
                      <span style={{
                        fontSize: '10px', fontWeight: 600, letterSpacing: '.06em',
                        color: 'var(--hint)', background: 'var(--surface2)',
                        border: '1px solid var(--border)', borderRadius: '3px',
                        padding: '2px 7px', textTransform: 'uppercase',
                      }}>
                        В разработке
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '12px', color: 'var(--hint)', marginBottom: '1rem' }}>
                  <span>{competencies} компетенций</span>
                  <span>{cycles > 0 ? `Использован в ${cycles} циклах` : 'Не использовался'}</span>
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
