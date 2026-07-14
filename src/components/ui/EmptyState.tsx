import type { ReactNode } from 'react'

type Tone = 'amber' | 'blue' | 'green' | 'purple' | 'neutral'

const TONES: Record<Tone, { color: string; bg: string; border: string }> = {
  amber:   { color: 'var(--amber)',  bg: 'var(--amber-bg)',  border: 'var(--amber-light)' },
  blue:    { color: 'var(--blue)',   bg: 'var(--blue-bg)',   border: 'var(--blue-light)' },
  green:   { color: 'var(--green)',  bg: 'var(--green-bg)',  border: 'var(--green-light)' },
  purple:  { color: 'var(--purple)', bg: 'var(--purple-bg)', border: 'var(--purple-light)' },
  neutral: { color: 'var(--hint)',   bg: 'var(--surface2)',  border: 'var(--border)' },
}

/**
 * Единый пустой / заглушечный экран в фирменном стиле: центрированная карточка,
 * кружок с иконкой, Playfair-заголовок, текст и опциональные чип / действие.
 * Портирован из корп-модуля (components/EmptyState.tsx) под стиль Next.js-прототипа.
 */
export function EmptyState({
  icon, title, text, tone = 'neutral', chip, action,
}: {
  icon: ReactNode
  title: string
  text?: ReactNode
  tone?: Tone
  chip?: ReactNode
  action?: ReactNode
}) {
  const t = TONES[tone]
  return (
    <div className="card" style={{ maxWidth: 540, margin: '8px auto', textAlign: 'center', padding: '52px 40px' }}>
      <div style={{
        width: 78, height: 78, borderRadius: '50%', margin: '0 auto 22px',
        display: 'grid', placeItems: 'center', background: t.bg, border: `1px solid ${t.border}`,
      }}>
        <span style={{ fontSize: 30, color: t.color, lineHeight: 1, display: 'grid', placeItems: 'center' }}>{icon}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 600, margin: '0 0 10px', color: 'var(--text)' }}>
        {title}
      </h3>
      {text && (
        <p style={{ maxWidth: 400, margin: '0 auto', fontSize: 14, lineHeight: 1.65, color: 'var(--muted)' }}>{text}</p>
      )}
      {chip && (
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 500,
            color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '6px 14px',
          }}>{chip}</span>
        </div>
      )}
      {action && <div style={{ marginTop: 22 }}>{action}</div>}
    </div>
  )
}
