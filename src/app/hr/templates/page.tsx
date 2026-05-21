import Link from 'next/link'
import { TEMPLATES } from '@/lib/template-data'

export default function HrTemplatesPage() {
  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Шаблоны оценки</h1>
          <span className="role-pill role-pill-hr">HR</span>
          <span style={{ fontSize: '12px', color: 'var(--hint)' }}>{TEMPLATES.length} шаблонов</span>
        </div>
        <Link href="/hr/templates/new" className="btn btn-primary btn-sm">+ Новый шаблон</Link>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              className="card"
              style={{ borderLeft: t.status === 'active' ? '3px solid var(--purple)' : undefined }}
            >
              <div className="card-body">
                {/* Title + status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.625rem' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.25rem' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{t.description}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {t.status === 'active' && <span className="status status-done">Активный</span>}
                    {t.status === 'archive' && <span className="status status-pending">Архив</span>}
                    {t.status === 'draft' && (
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

                {/* Meta */}
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '12px', color: 'var(--hint)', marginBottom: '1rem' }}>
                  <span>{t.competencies.length} компетенций</span>
                  <span>{t.cycles > 0 ? `Использован в ${t.cycles} циклах` : 'Не использовался'}</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <Link href={`/hr/templates/${t.id}`} className="btn btn-sm">Просмотр</Link>
                  <Link href={`/hr/templates/${t.id}/edit`} className="btn btn-sm">Редактировать</Link>
                  {t.status === 'draft' && t.cycles === 0 && (
                    <button className="btn btn-sm" style={{ color: 'var(--amber)', marginLeft: 'auto' }}>
                      Удалить
                    </button>
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
