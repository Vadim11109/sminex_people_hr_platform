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

const SCORE_LABELS: Record<number, string> = {
  0: 'Не проявляется',
  1: 'Базовый уровень',
  2: 'Уверенный уровень',
  3: 'Экспертный уровень',
}

export default async function ManagerAssessPage({ params }: Props) {
  const { userId } = await params

  // Stub employee data (will come from DB)
  const employees: Record<string, { name: string; initials: string; grade: string; gradeCls: string }> = {
    '1': { name: 'Иван Петров', initials: 'ИП', grade: 'Мидл Ранг 1', gradeCls: 'badge-m' },
    '2': { name: 'Анна Сидорова', initials: 'АС', grade: 'Мидл Ранг 3', gradeCls: 'badge-m' },
    '3': { name: 'Дмитрий Козлов', initials: 'ДК', grade: 'Джуниор Ранг 3', gradeCls: 'badge-j' },
  }

  const emp = employees[userId] ?? { name: 'Сотрудник', initials: '??', grade: '—', gradeCls: 'badge-j' }

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <a href="/manager" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>← Команда</a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Оценка: {emp.name}</h1>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--muted)', padding: '5px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px' }}>
          Q1 2025 · до 31 марта
        </span>
      </div>

      <div className="page-body">
        {/* Employee header */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '17px' }}>{emp.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '.25rem' }}>{emp.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Текущий грейд: <span className={`badge ${emp.gradeCls}`}>{emp.grade}</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--hint)', marginBottom: '.25rem' }}>Прогресс оценки</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>0 / 9</div>
            </div>
          </div>
        </div>

        {/* Competency cards */}
        {COMPETENCIES.map((comp, idx) => (
          <div key={comp} className="card" style={{ marginBottom: '.75rem' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--hint)', marginBottom: '.25rem' }}>
                    Компетенция {idx + 1} из {COMPETENCIES.length}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{comp}</div>
                </div>
                <span className="status status-pending">Не оценено</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.5rem' }}>
                {[0, 1, 2, 3].map(score => (
                  <button
                    key={score}
                    className="btn btn-sm"
                    style={{
                      padding: '.5rem',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '.25rem',
                      height: 'auto',
                    }}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 700, color: ['var(--hint)', 'var(--amber)', 'var(--blue)', 'var(--green)'][score] }}>
                      {score}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>{SCORE_LABELS[score]}</span>
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Комментарий к оценке (необязательно)..."
                style={{
                  marginTop: '.75rem',
                  width: '100%',
                  padding: '.625rem .75rem',
                  fontSize: '13px',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  background: 'var(--surface2)',
                  color: 'var(--text)',
                  resize: 'vertical',
                  minHeight: '60px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        ))}

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem', marginTop: '1rem' }}>
          <a href="/manager" className="btn btn-sm">Отмена</a>
          <button className="btn btn-primary" disabled style={{ opacity: .5 }}>
            Завершить оценку (0 / 9)
          </button>
        </div>
      </div>
    </>
  )
}
