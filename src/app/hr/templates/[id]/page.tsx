import Link from 'next/link'
import { getTemplate } from '@/lib/template-data'
import { notFound } from 'next/navigation'

export default async function TemplateViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = getTemplate(id)
  if (!t) notFound()

  const statusEl = t.status === 'active'
    ? <span className="status status-done">Активный</span>
    : t.status === 'archive'
    ? <span className="status status-pending">Архив</span>
    : <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--hint)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px', padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '.06em' }}>В разработке</span>

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <Link href="/hr/templates" className="btn btn-ghost btn-sm">
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" style={{ marginRight: 2 }}>
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Шаблоны
          </Link>
          <h1 style={{ fontSize: '15px', fontWeight: 600 }}>{t.name}</h1>
          {statusEl}
        </div>
        <Link href={`/hr/templates/${id}/edit`} className="btn btn-primary btn-sm">
          Редактировать
        </Link>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Meta */}
        <div className="card">
          <div className="card-body" style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '.5rem' }}>{t.description}</div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '12px', color: 'var(--hint)' }}>
                <span>{t.role}</span>
                <span>{t.competencies.length} компетенций</span>
                {t.cycles > 0 && <span>Использован в {t.cycles} циклах</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {t.competencies.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '.5rem' }}>
              Компетенции не заданы
            </div>
            <Link href={`/hr/templates/${id}/edit`} className="btn btn-primary btn-sm">
              Открыть конструктор
            </Link>
          </div>
        )}

        {/* Competency cards */}
        {t.competencies.map((comp, idx) => (
          <div key={comp.id} className="card">
            <div className="card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <span style={{ fontSize: '11px', color: 'var(--hint)', fontWeight: 600, minWidth: 16 }}>
                  {idx + 1}
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '.07em',
                  color: 'var(--blue)', background: 'var(--blue-bg)',
                  border: '1px solid var(--blue-light)', borderRadius: '3px',
                  padding: '2px 7px',
                }}>
                  {comp.code}
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{comp.name}</div>
                  {comp.sub && <div style={{ fontSize: '11px', color: 'var(--hint)' }}>{comp.sub}</div>}
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--hint)' }}>{comp.criteria.length} критериев</span>
            </div>

            {/* Criteria grid */}
            <div className="card-body-flush">
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr 1fr' }}>
                {['Критерий', 'Junior', 'Middle', 'Senior'].map((h, i) => (
                  <div key={h} style={{
                    padding: '.5rem 1rem', fontSize: '10px', fontWeight: 700,
                    color: 'var(--hint)', letterSpacing: '.12em', textTransform: 'uppercase',
                    background: 'var(--surface2)',
                    borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {h}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {comp.criteria.map((crit, ci) => (
                <div
                  key={crit.id}
                  style={{
                    display: 'grid', gridTemplateColumns: '200px 1fr 1fr 1fr',
                    borderBottom: ci < comp.criteria.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ padding: '.75rem 1rem', fontSize: '12px', fontWeight: 600, color: 'var(--text)', borderRight: '1px solid var(--border)', lineHeight: 1.5 }}>
                    {crit.name}
                  </div>
                  <div style={{ padding: '.75rem 1rem', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, borderRight: '1px solid var(--border)' }}>
                    {crit.j}
                  </div>
                  <div style={{ padding: '.75rem 1rem', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, borderRight: '1px solid var(--border)' }}>
                    {crit.m}
                  </div>
                  <div style={{ padding: '.75rem 1rem', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                    {crit.s}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
