export default function HrUsersPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Сотрудники</h1>
          <span className="role-pill role-pill-hr">HR</span>
        </div>
        <div style={{ display: 'flex', gap: '.75rem' }}>
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            style={{
              padding: '5px 12px', fontSize: '13px', border: '1px solid var(--border)',
              borderRadius: '3px', background: 'var(--surface2)', color: 'var(--text)',
              width: '240px', outline: 'none',
            }}
          />
          <button className="btn btn-primary btn-sm">+ Добавить</button>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-body-flush">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Команда</th>
                  <th>Должность</th>
                  <th>Роли</th>
                  <th>Текущий грейд</th>
                  <th>Статус Q1 2025</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Алексей Морозов', initials: 'АМ', email: 'a.morozov@sminex.ru', team: 'IT Products', position: 'Руководитель', roles: ['MANAGER', 'EMPLOYEE'], grade: 'Сеньор Ранг 2', gradeCls: 'badge-s', status: 'done' },
                  { name: 'Иван Петров', initials: 'ИП', email: 'i.petrov@sminex.ru', team: 'IT Products', position: 'Product Owner', roles: ['EMPLOYEE'], grade: 'Мидл Ранг 1', gradeCls: 'badge-m', status: 'progress' },
                  { name: 'Анна Сидорова', initials: 'АС', email: 'a.sidorova@sminex.ru', team: 'IT Products', position: 'Product Owner', roles: ['EMPLOYEE'], grade: 'Мидл Ранг 3', gradeCls: 'badge-m', status: 'done' },
                  { name: 'Дмитрий Козлов', initials: 'ДК', email: 'd.kozlov@sminex.ru', team: 'IT Products', position: 'Junior PO', roles: ['EMPLOYEE'], grade: 'Джуниор Ранг 3', gradeCls: 'badge-j', status: 'pending' },
                  { name: 'Наталья Иванова', initials: 'НИ', email: 'n.ivanova@sminex.ru', team: 'HR', position: 'HR BP', roles: ['HR', 'EMPLOYEE'], grade: 'Мидл Ранг 2', gradeCls: 'badge-m', status: 'pending' },
                ].map(({ name, initials, email, team, position, roles, grade, gradeCls, status }) => (
                  <tr key={email}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                        <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '11px' }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>{team}</td>
                    <td style={{ fontSize: '13px' }}>{position}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap' }}>
                        {roles.map(r => (
                          <span key={r} className={`role-pill role-pill-${r.toLowerCase()}`} style={{ fontSize: '10px' }}>
                            {r === 'EMPLOYEE' ? 'Сотрудник' : r === 'MANAGER' ? 'Руководитель' : 'HR'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td><span className={`badge ${gradeCls}`}>{grade}</span></td>
                    <td>
                      {status === 'done' && <span className="status status-done">Готово</span>}
                      {status === 'progress' && <span className="status status-progress">В процессе</span>}
                      {status === 'pending' && <span className="status status-pending">Не начато</span>}
                    </td>
                    <td>
                      <button className="btn btn-sm">Редактировать</button>
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
