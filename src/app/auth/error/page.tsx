export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem', width: '400px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '.5rem' }}>Ошибка авторизации</h2>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '1.5rem' }}>
          {searchParams.error === 'AccessDenied'
            ? 'У вашей учётной записи нет доступа к платформе. Обратитесь к HR-администратору.'
            : 'Что-то пошло не так при входе. Попробуйте снова.'}
        </p>
        <a href="/auth/signin" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          Попробовать снова
        </a>
      </div>
    </div>
  )
}
