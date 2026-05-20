'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  {
    role: 'HR',
    color: 'var(--green)',
    bg: 'var(--green-bg)',
    border: 'var(--green-light)',
    items: [
      { href: '/hr',           label: 'Дашборд' },
      { href: '/hr/cycles',    label: 'Циклы оценки' },
      { href: '/hr/users',     label: 'Сотрудники' },
      { href: '/hr/analytics', label: 'Аналитика' },
      { href: '/hr/grades',    label: 'Система грейдов' },
      { href: '/hr/templates', label: 'Шаблоны' },
    ],
  },
  {
    role: 'Руководитель',
    color: 'var(--blue)',
    bg: 'var(--blue-bg)',
    border: 'var(--blue-light)',
    items: [
      { href: '/manager',              label: 'Команда' },
      { href: '/manager/pending',      label: 'Ожидают оценки' },
      { href: '/manager/results',      label: 'Результаты' },
      { href: '/manager/assess/1',     label: 'Оценить: И. Петров' },
      { href: '/manager/assess/2',     label: 'Оценить: А. Сидорова' },
      { href: '/manager/assess/3',     label: 'Оценить: Д. Козлов' },
      { href: '/manager/gap/2',        label: 'Gap: А. Сидорова' },
    ],
  },
  {
    role: 'Сотрудник',
    color: 'var(--purple)',
    bg: 'var(--purple-bg)',
    border: 'var(--purple-light)',
    items: [
      { href: '/employee',                          label: 'Мои ассесменты' },
      { href: '/employee/history',                  label: 'История' },
      { href: '/employee/assessment/current',       label: 'Само-оценка (текущая)' },
    ],
  },
]

export function GlobalNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Overlay backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(28,27,24,.35)', backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Nav panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '3.5rem', right: '1.5rem', zIndex: 9999,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 6, boxShadow: '0 8px 40px rgba(0,0,0,.18)',
          padding: '1.25rem', display: 'flex', gap: '1.5rem',
          minWidth: 560,
        }}>
          {/* Header */}
          <div style={{
            position: 'absolute', top: '-.75rem', left: '1.25rem',
            background: 'var(--text)', color: '#fff',
            fontSize: 9, fontWeight: 700, letterSpacing: '.18em',
            textTransform: 'uppercase', padding: '3px 10px', borderRadius: 2,
          }}>
            Admin · Полная навигация
          </div>

          {SECTIONS.map(section => (
            <div key={section.role} style={{ flex: 1 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '.18em',
                textTransform: 'uppercase', color: section.color,
                marginBottom: '.625rem', paddingBottom: '.375rem',
                borderBottom: `1px solid ${section.border}`,
              }}>
                {section.role}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map(item => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'block', padding: '5px 9px',
                        borderRadius: 3, fontSize: 12, fontWeight: isActive ? 600 : 400,
                        textDecoration: 'none', transition: 'all .12s',
                        background: isActive ? section.bg : 'transparent',
                        color: isActive ? section.color : 'var(--muted)',
                        borderLeft: `2px solid ${isActive ? section.color : 'transparent'}`,
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: open ? 'var(--text)' : 'var(--surface)',
          color: open ? '#fff' : 'var(--muted)',
          border: `1px solid ${open ? 'var(--text)' : 'var(--border)'}`,
          borderRadius: 4, padding: '6px 14px',
          fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
          textTransform: 'uppercase', cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,.12)',
          transition: 'all .15s', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ fontSize: 9, opacity: .7 }}>◈</span>
        {open ? 'Закрыть' : 'Навигация'}
      </button>
    </>
  )
}
