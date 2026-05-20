'use client'

import { useState } from 'react'

const POSITIONS = [
  {
    id: 'product-owner',
    title: 'Product Owner',
    dept: 'IT-продукты',
    levels: 3,
    ranks: 9,
    grades: [
      {
        level: 'Junior', short: 'J',
        color: '#B45309', bg: '#FFFBEB', border: '#FDE68A',
        ranks: [
          { rank: 1, score: '1.00 – 1.33', salary: '90 000 – 115 000', desc: 'Входит в профессию. Работает строго по задачам в рамках одной фичи под руководством ментора. Изучает процессы, инструменты и продуктовый подход компании.' },
          { rank: 2, score: '1.34 – 1.66', salary: '115 000 – 145 000', desc: 'Самостоятельно ведёт задачи в рамках спринта. Формулирует требования, проводит груминги. Работает под надзором руководителя, задаёт правильные вопросы.' },
          { rank: 3, score: '1.67 – 1.99', salary: '145 000 – 175 000', desc: 'Уверенно управляет бэклогом, взаимодействует с командой разработки. Начинает работать с метриками и данными. Готов к росту до Middle.' },
        ],
      },
      {
        level: 'Middle', short: 'M',
        color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0',
        ranks: [
          { rank: 1, score: '2.00 – 2.33', salary: '175 000 – 220 000', desc: 'Самостоятельно ведёт один продукт или стрим. Приоритизирует бэклог на основе данных, взаимодействует со стейкхолдерами, выстраивает коммуникацию с командой.' },
          { rank: 2, score: '2.34 – 2.66', salary: '220 000 – 275 000', desc: 'Уверенно управляет продуктом на всём цикле. Формирует продуктовую стратегию в рамках стрима. Менторит джуниоров, участвует в найме.' },
          { rank: 3, score: '2.67 – 2.99', salary: '275 000 – 340 000', desc: 'Высокий уровень самостоятельности. Ведёт сложные продукты с ощутимым влиянием на бизнес. Лидирует кросс-функциональные инициативы, предлагает системные решения.' },
        ],
      },
      {
        level: 'Senior', short: 'S',
        color: '#6D28D9', bg: '#F5F3FF', border: '#DDD6FE',
        ranks: [
          { rank: 1, score: '3.00 – 3.33', salary: '340 000 – 420 000', desc: 'Формирует продуктовое видение на уровне направления. Влияет на стратегию компании. Развивает команду, создаёт процессы и стандарты работы.' },
          { rank: 2, score: '3.34 – 3.66', salary: '420 000 – 510 000', desc: 'Отвечает за несколько продуктов или крупное направление. Экспертный уровень во всех компетенциях. Представляет продуктовую позицию на уровне топ-менеджмента.' },
          { rank: 3, score: '3.67 – 4.00', salary: 'от 510 000',        desc: 'Топ-уровень. Формирует культуру продуктовой разработки в компании. Принимает ключевые продуктовые решения, задаёт планку качества для всей команды.' },
        ],
      },
    ],
  },
]

const COMING_SOON = [
  { title: 'Backend разработчик',    dept: 'IT-продукты' },
  { title: 'Frontend разработчик',   dept: 'IT-продукты' },
  { title: 'BIM-менеджер',           dept: 'Строительство' },
  { title: 'Инженер-строитель',      dept: 'Строительство' },
  { title: 'Менеджер по продажам',   dept: 'Коммерческий отдел' },
  { title: 'Оценщик недвижимости',   dept: 'Коммерческий отдел' },
  { title: 'Руководитель проекта',   dept: 'Управление' },
  { title: 'Менеджер по охране труда', dept: 'Строительство' },
]

export default function HrGradesPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const pos = POSITIONS.find(p => p.id === selected) ?? null

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          {selected ? (
            <>
              <button
                onClick={() => setSelected(null)}
                style={{ display: 'flex', alignItems: 'center', gap: '.375rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '13px', fontFamily: 'inherit', padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Система грейдов
              </button>
              <span style={{ color: 'var(--border2)' }}>/</span>
              <h1 style={{ fontSize: '15px', fontWeight: 600 }}>{pos?.title}</h1>
              <span className="role-pill role-pill-hr">HR</span>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '15px', fontWeight: 600 }}>Система грейдов</h1>
              <span className="role-pill role-pill-hr">HR</span>
            </>
          )}
        </div>
        {!selected && (
          <button className="btn btn-primary btn-sm">+ Добавить должность</button>
        )}
      </div>

      <div className="page-body">

        {/* ── Position list ──────────────────────────────────── */}
        {!selected && (
          <>
            <div style={{ fontSize: '12px', color: 'var(--hint)', marginBottom: '1rem' }}>
              {POSITIONS.length + COMING_SOON.length} должностей · нажмите чтобы открыть
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {POSITIONS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', borderRadius: 'var(--radius)',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderLeft: '3px solid var(--blue)', cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit', width: '100%',
                    transition: 'box-shadow .15s',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.2rem' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.dept} · {p.levels} уровня · {p.ranks} рангов</div>
                  </div>
                  <div style={{ display: 'flex', gap: '.375rem' }}>
                    {(['J','M','S'] as const).map((s, i) => {
                      const colors = [{ color:'#B45309', bg:'#FFFBEB', border:'#FDE68A' }, { color:'#15803D', bg:'#F0FDF4', border:'#BBF7D0' }, { color:'#6D28D9', bg:'#F5F3FF', border:'#DDD6FE' }]
                      const c = colors[i]
                      return (
                        <span key={s} style={{ width: 26, height: 26, borderRadius: '50%', background: c.bg, border: `1.5px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: c.color }}>
                          {s}
                        </span>
                      )
                    })}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--hint)', flexShrink: 0 }}>
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}

              {/* Coming soon */}
              {COMING_SOON.map(p => (
                <div
                  key={p.title}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', borderRadius: 'var(--radius)',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    opacity: .5,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.2rem' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.dept}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--hint)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 2, padding: '2px 8px' }}>
                    В разработке
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Grade detail ───────────────────────────────────── */}
        {selected && pos && (
          <>
            {/* Position summary */}
            <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '3px solid var(--blue)' }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '.25rem' }}>{pos.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{pos.dept} · {pos.levels} уровня · {pos.ranks} рангов · оценка по шкале 1–3</div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {pos.grades.map(g => (
                    <div key={g.level} style={{ textAlign: 'center' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: g.bg, border: `2px solid ${g.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: g.color, margin: '0 auto 4px' }}>{g.short}</div>
                      <div style={{ fontSize: '10px', color: 'var(--hint)' }}>{g.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grade grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {pos.grades.map(g => (
                <div key={g.level}>
                  <div style={{ padding: '8px 14px', borderRadius: '4px 4px 0 0', background: g.bg, border: `1px solid ${g.border}`, borderBottom: 'none', display: 'flex', alignItems: 'center', gap: '.625rem' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', border: `1.5px solid ${g.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: g.color }}>{g.short}</div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: g.color }}>{g.level}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {g.ranks.map((r, ri) => (
                      <div key={r.rank} style={{ background: 'var(--surface)', border: `1px solid ${g.border}`, borderTop: ri === 0 ? `1px solid ${g.border}` : 'none', borderRadius: ri === g.ranks.length - 1 ? '0 0 4px 4px' : 0, padding: '1rem 1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.625rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.04em', padding: '2px 8px', borderRadius: 2, background: g.bg, color: g.color, border: `1px solid ${g.border}` }}>{g.short}{r.rank}</span>
                            <span style={{ fontSize: '11px', color: 'var(--hint)' }}>Ранг {r.rank}</span>
                          </div>
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 2, padding: '1px 6px' }}>{r.score}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.65, margin: '0 0 .75rem' }}>{r.desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', paddingTop: '.625rem', borderTop: '1px solid var(--border)' }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="1" y="2.5" width="10" height="7.5" rx="1.5" stroke="var(--hint)" strokeWidth="1.2"/>
                            <path d="M1 5h10" stroke="var(--hint)" strokeWidth="1.2"/>
                            <path d="M4 2.5V1.5M8 2.5V1.5" stroke="var(--hint)" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          <span style={{ fontSize: '11px', color: 'var(--hint)' }}>Вилка:</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{r.salary} ₽</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
