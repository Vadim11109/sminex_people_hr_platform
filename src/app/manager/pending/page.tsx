export default function ManagerPendingPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Ожидают оценки</h1>
          <span className="role-pill role-pill-manager">Руководитель</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--muted)', padding: '5px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px' }}>
          Q1 2025 · до 31 марта
        </span>
      </div>

      <div className="page-body">
        <div style={{
          background: 'var(--amber-bg)', border: '1px solid var(--amber-light)', borderRadius: 'var(--radius)',
          padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '.875rem', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>ℹ️</span>
          <div style={{ fontSize: '13px', color: 'var(--amber)', lineHeight: 1.7 }}>
            <strong>Оценивайте только после того, как сотрудник завершил само-оценку.</strong>{' '}
            Сотрудники, не завершившие само-оценку, недоступны для оценки руководителем.
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Сотрудники, ожидающие вашей оценки</div>
          </div>
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Само-оценка</th>
                  <th>Грейд (прошлый)</th>
                  <th>Дедлайн</th>
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
                  <td><span className="badge badge-m">Мидл Ранг 3</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--amber)' }}>31 марта</span></td>
                  <td><a href="/manager/assess/2" className="btn btn-primary btn-sm">Оценить →</a></td>
                </tr>
                <tr style={{ opacity: 0.5 }}>
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
                  <td><span className="badge badge-m">Мидл Ранг 1</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>31 марта</span></td>
                  <td><button className="btn btn-sm" disabled style={{ opacity: .5 }}>Ожидаем само-оценку</button></td>
                </tr>
                <tr style={{ opacity: 0.5 }}>
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
                  <td><span className="badge badge-j">Джуниор Ранг 3</span></td>
                  <td><span style={{ fontSize: '12px', color: 'var(--hint)' }}>31 марта</span></td>
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
