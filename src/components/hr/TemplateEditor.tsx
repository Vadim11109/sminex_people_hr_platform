'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { TemplateData, TemplateCompetency, TemplateCriterion } from '@/lib/template-data'
import { emptyCompetency, emptyCriterion } from '@/lib/template-data'

// ─── Auto-resizing textarea ──────────────────────────────────────────────────

function AutoTextarea({
  value, onChange, placeholder, style, rows,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  style?: React.CSSProperties
  rows?: number
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = ref.current.scrollHeight + 'px'
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows ?? 2}
      style={{ resize: 'none', overflow: 'hidden', ...style }}
    />
  )
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

const STATUS_CFG = {
  active:  { label: 'Активный',      bg: 'var(--green-bg)',   color: 'var(--green)',   border: 'var(--green-light)'  },
  archive: { label: 'Архив',         bg: 'var(--surface2)',   color: 'var(--muted)',   border: 'var(--border)'       },
  draft:   { label: 'В разработке',  bg: 'var(--surface2)',   color: 'var(--hint)',    border: 'var(--border)'       },
} as const

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface TemplateEditorProps {
  initialData?: TemplateData
}

export function TemplateEditor({ initialData }: TemplateEditorProps) {
  const [name, setName]        = useState(initialData?.name ?? '')
  const [description, setDesc] = useState(initialData?.description ?? '')
  const [role, setRole]        = useState(initialData?.role ?? '')
  const [status, setStatus]    = useState<'active' | 'archive' | 'draft'>(initialData?.status ?? 'draft')
  const [competencies, setComps] = useState<TemplateCompetency[]>(
    () => JSON.parse(JSON.stringify(initialData?.competencies ?? []))
  )
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [saving, setSaving]    = useState(false)
  const [savedAt, setSavedAt]  = useState<Date | null>(null)

  // ── expand helpers ────────────────────────────────────────────────────────
  const toggle = (id: string) =>
    setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  // ── competency ops ────────────────────────────────────────────────────────
  const updateComp = (id: string, patch: Partial<TemplateCompetency>) =>
    setComps(p => p.map(c => c.id === id ? { ...c, ...patch } : c))

  const addComp = () => {
    const c = emptyCompetency()
    setComps(p => [...p, c])
    setExpanded(p => new Set([...p, c.id]))
  }

  const removeComp = (id: string) => {
    setComps(p => p.filter(c => c.id !== id))
    setExpanded(p => { const n = new Set(p); n.delete(id); return n })
  }

  const moveComp = (id: string, dir: -1 | 1) =>
    setComps(p => {
      const i = p.findIndex(c => c.id === id)
      if (i + dir < 0 || i + dir >= p.length) return p
      const n = [...p];
      [n[i], n[i + dir]] = [n[i + dir], n[i]]
      return n
    })

  // ── criterion ops ─────────────────────────────────────────────────────────
  const updateCrit = (compId: string, critId: string, patch: Partial<TemplateCriterion>) =>
    setComps(p => p.map(c => c.id !== compId ? c : {
      ...c,
      criteria: c.criteria.map(cr => cr.id === critId ? { ...cr, ...patch } : cr),
    }))

  const addCrit = (compId: string) =>
    setComps(p => p.map(c => c.id !== compId ? c : {
      ...c, criteria: [...c.criteria, emptyCriterion()],
    }))

  const removeCrit = (compId: string, critId: string) =>
    setComps(p => p.map(c => c.id !== compId ? c : {
      ...c, criteria: c.criteria.filter(cr => cr.id !== critId),
    }))

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    setSavedAt(new Date())
  }

  const totalCriteria = competencies.reduce((s, c) => s + c.criteria.length, 0)

  return (
    <>
      {/* ── TOPBAR ── */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
          <Link href="/hr/templates" className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" style={{ marginRight: 2 }}>
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Шаблоны
          </Link>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Название шаблона"
            style={{
              fontSize: '15px', fontWeight: 600, border: 'none', outline: 'none',
              background: 'transparent', color: 'var(--text)', flex: 1, minWidth: 0,
              fontFamily: 'inherit',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexShrink: 0 }}>
          {savedAt && !saving && (
            <span style={{ fontSize: '11px', color: 'var(--hint)' }}>
              Сохранено в {savedAt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
            {saving ? 'Сохранение…' : '✓ Сохранить'}
          </button>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Meta card */}
        <div className="card">
          <div className="card-head">
            <span className="card-title">Основное</span>
            {/* Status pills */}
            <div style={{ display: 'flex', gap: '.375rem' }}>
              {(['draft', 'active', 'archive'] as const).map(s => {
                const cfg = STATUS_CFG[s]
                const active = status === s
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    style={{
                      padding: '3px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 600,
                      border: `1px solid ${active ? cfg.border : 'var(--border)'}`,
                      background: active ? cfg.bg : 'transparent',
                      color: active ? cfg.color : 'var(--hint)',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelSt}>Название</label>
              <input className="field" value={name} onChange={e => setName(e.target.value)} placeholder="Product Owner v2" />
            </div>
            <div>
              <label style={labelSt}>Должность / роль</label>
              <input className="field" value={role} onChange={e => setRole(e.target.value)} placeholder="Product Owner / PM" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelSt}>Описание</label>
              <textarea
                className="field"
                value={description}
                onChange={e => setDesc(e.target.value)}
                placeholder="Краткое описание шаблона для HR..."
                rows={2}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Competencies header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 .25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Компетенции</span>
            {competencies.length > 0 && (
              <span style={countBadgeSt}>{competencies.length} компет. · {totalCriteria} критериев</span>
            )}
          </div>
          <button onClick={addComp} className="btn btn-sm">
            + Добавить компетенцию
          </button>
        </div>

        {/* Empty state */}
        {competencies.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '.375rem' }}>Компетенций пока нет</div>
            <div style={{ fontSize: '12px', color: 'var(--hint)' }}>Нажмите «+ Добавить компетенцию» чтобы начать</div>
          </div>
        )}

        {/* Competency cards */}
        {competencies.map((comp, idx) => {
          const isOpen = expanded.has(comp.id)
          return (
            <div key={comp.id} className="card">

              {/* Header */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '.625rem',
                  padding: '.875rem 1.125rem', cursor: 'pointer',
                  borderBottom: isOpen ? '1px solid var(--border)' : 'none',
                  userSelect: 'none',
                }}
                onClick={() => toggle(comp.id)}
              >
                {/* code badge */}
                <span style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '.06em',
                  color: 'var(--blue)', background: 'var(--blue-bg)',
                  border: '1px solid var(--blue-light)', borderRadius: '3px',
                  padding: '2px 7px', flexShrink: 0, minWidth: 32, textAlign: 'center',
                }}>
                  {comp.code || '??'}
                </span>

                {/* name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: comp.name ? 'var(--text)' : 'var(--hint)' }}>
                    {comp.name || 'Новая компетенция'}
                  </span>
                  {comp.sub && (
                    <span style={{ fontSize: '12px', color: 'var(--hint)', marginLeft: '.5rem' }}>
                      / {comp.sub}
                    </span>
                  )}
                </div>

                <span style={{ fontSize: '11px', color: 'var(--hint)', flexShrink: 0 }}>
                  {comp.criteria.length} кр.
                </span>

                {/* controls */}
                <button onClick={e => { e.stopPropagation(); moveComp(comp.id, -1) }}
                  disabled={idx === 0} style={iconBtnSt} title="Вверх">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button onClick={e => { e.stopPropagation(); moveComp(comp.id, 1) }}
                  disabled={idx === competencies.length - 1} style={iconBtnSt} title="Вниз">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button onClick={e => { e.stopPropagation(); removeComp(comp.id) }}
                  style={{ ...iconBtnSt, color: 'var(--red)' }} title="Удалить">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M2 10l8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>

                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ color: 'var(--hint)', flexShrink: 0, transition: 'transform .15s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Body */}
              {isOpen && (
                <div style={{ padding: '1.125rem' }}>

                  {/* Comp meta row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr 1fr', gap: '.625rem', marginBottom: '1.125rem' }}>
                    <div>
                      <label style={labelSt}>Код</label>
                      <input
                        className="field"
                        value={comp.code}
                        onChange={e => updateComp(comp.id, { code: e.target.value.toUpperCase().slice(0, 4) })}
                        placeholder="PT"
                        maxLength={4}
                        style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '.06em' }}
                      />
                    </div>
                    <div>
                      <label style={labelSt}>Название компетенции</label>
                      <input
                        className="field"
                        value={comp.name}
                        onChange={e => updateComp(comp.id, { name: e.target.value })}
                        placeholder="Product Thinking & Problem Ownership"
                      />
                    </div>
                    <div>
                      <label style={labelSt}>Подзаголовок (рус.)</label>
                      <input
                        className="field"
                        value={comp.sub}
                        onChange={e => updateComp(comp.id, { sub: e.target.value })}
                        placeholder="Продуктовое мышление"
                      />
                    </div>
                  </div>

                  {/* Criteria section */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                    <span style={labelSt}>Критерии оценки</span>
                    <button onClick={() => addCrit(comp.id)} className="btn btn-ghost btn-sm">
                      + Критерий
                    </button>
                  </div>

                  {/* Criteria grid header */}
                  {comp.criteria.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 1fr 28px', gap: '4px', marginBottom: '3px', padding: '0 6px' }}>
                      {['Критерий', 'Junior', 'Middle', 'Senior'].map(h => (
                        <div key={h} style={{ fontSize: '10px', fontWeight: 700, color: 'var(--hint)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{h}</div>
                      ))}
                      <div />
                    </div>
                  )}

                  {/* Criteria rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {comp.criteria.map(crit => (
                      <div
                        key={crit.id}
                        style={{
                          display: 'grid', gridTemplateColumns: '180px 1fr 1fr 1fr 28px',
                          gap: '4px', alignItems: 'start',
                          background: 'var(--surface2)', borderRadius: '6px', padding: '6px',
                        }}
                      >
                        <AutoTextarea
                          value={crit.name}
                          onChange={v => updateCrit(comp.id, crit.id, { name: v })}
                          placeholder="Название критерия"
                          style={critTaSt}
                        />
                        <AutoTextarea
                          value={crit.j}
                          onChange={v => updateCrit(comp.id, crit.id, { j: v })}
                          placeholder="Junior…"
                          style={{ ...critTaSt, borderColor: '#a8c4e0' }}
                        />
                        <AutoTextarea
                          value={crit.m}
                          onChange={v => updateCrit(comp.id, crit.id, { m: v })}
                          placeholder="Middle…"
                          style={{ ...critTaSt, borderColor: '#a8d9bc' }}
                        />
                        <AutoTextarea
                          value={crit.s}
                          onChange={v => updateCrit(comp.id, crit.id, { s: v })}
                          placeholder="Senior…"
                          style={{ ...critTaSt, borderColor: '#e8d99a' }}
                        />
                        <button
                          onClick={() => removeCrit(comp.id, crit.id)}
                          style={{ ...iconBtnSt, color: 'var(--hint)', marginTop: '4px' }}
                          title="Удалить критерий"
                        >
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 2l8 8M2 10l8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {comp.criteria.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '.875rem', color: 'var(--hint)', fontSize: '12px',
                      background: 'var(--surface2)', borderRadius: '6px' }}>
                      Нет критериев — нажмите «+ Критерий»
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Bottom add button */}
        {competencies.length > 0 && (
          <button onClick={addComp} className="btn" style={{ alignSelf: 'flex-start' }}>
            + Добавить компетенцию
          </button>
        )}
      </div>
    </>
  )
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 600,
  color: 'var(--hint)', letterSpacing: '.1em', textTransform: 'uppercase',
  marginBottom: '.3rem',
}

const countBadgeSt: React.CSSProperties = {
  fontSize: '11px', color: 'var(--hint)',
  background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: '3px', padding: '1px 8px',
}

const iconBtnSt: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 24, height: 24, border: 'none', background: 'transparent',
  color: 'var(--hint)', cursor: 'pointer', borderRadius: '3px',
  flexShrink: 0, padding: 0, fontFamily: 'inherit',
}

const critTaSt: React.CSSProperties = {
  width: '100%', padding: '6px 8px', fontSize: '12px',
  border: '1px solid var(--border)', borderRadius: '4px',
  background: 'var(--surface)', color: 'var(--text)',
  outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
  minHeight: 48,
}
