import { signIn } from '@/lib/auth'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '3rem 3.5rem',
        width: '420px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <svg width="110" height="34" viewBox="0 0 110 34" fill="none">
            <text x="0" y="20" fontFamily="Georgia,serif" fontSize="22" fontWeight="700" letterSpacing="2.5" fill="#1C1B18">SMINEX</text>
            <line x1="0" y1="24" x2="110" y2="24" stroke="#C9C5BC" strokeWidth="0.75"/>
            <text x="1" y="32" fontFamily="system-ui,sans-serif" fontSize="7" letterSpacing="2.2" fill="#A09C96">FINE DEVELOPMENT</text>
          </svg>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: '.375rem',
        }}>
          Sminex People
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Платформа оценки и развития сотрудников
        </p>

        {/* Sign in form */}
        <form
          action={async () => {
            'use server'
            await signIn('microsoft-entra-id', { redirectTo: '/' })
          }}
        >
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '.75rem',
              width: '100%',
              padding: '12px 1.5rem',
              background: 'var(--surface)',
              border: '1.5px solid var(--border2)',
              borderRadius: '3px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .18s',
            }}
          >
            {/* Microsoft icon */}
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Войти через Microsoft
          </button>
        </form>

        <p style={{ fontSize: '11px', color: 'var(--hint)', marginTop: '1.75rem', lineHeight: 1.7 }}>
          Используется корпоративная учётная запись Sminex.<br/>
          SSO через Azure Active Directory.<br/><br/>
          <span style={{ color: 'var(--blue)', fontWeight: 500 }}>
            Роль определяется автоматически — назначается HR в системе.
          </span>
        </p>
      </div>
    </div>
  )
}
