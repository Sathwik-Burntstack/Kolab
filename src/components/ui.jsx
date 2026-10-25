import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

export function Button({ variant = 'secondary', size, block, className = '', children, icon, ...rest }) {
  const cls = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', block && 'btn--block', className].filter(Boolean).join(' ')
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  )
}

export const Chip = ({ on, children, className = '', ...rest }) => (
  <button className={`chip ${on ? 'chip--on' : ''} ${className}`} aria-pressed={!!on} {...rest}>{children}</button>
)

export const Badge = ({ tone = 'brand', children }) => <span className={`badge badge--${tone}`}>{children}</span>

export function Avatar({ initials = 'AK', size = 40 }) {
  return <span className="avatar" style={{ width: size, height: size, fontSize: size > 34 ? 13 : 11 }}>{initials}</span>
}

/** Fade/slide in when scrolled into view. */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setShown(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms`, ...rest.style }} {...rest}>
      {children}
    </Tag>
  )
}

/** Animated number (count-up). format = (n) => string */
export function CountUp({ value, format = (n) => n.toLocaleString('en-IN'), duration = 900 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf, start
    const from = 0
    const step = (t) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(from + (value - from) * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <>{format(n)}</>
}

export const rupee = (n) => '₹' + Number(n).toLocaleString('en-IN')
export const range = (a, b) => `₹${a.toLocaleString('en-IN')} – ${b.toLocaleString('en-IN')}`

/** Budget range track from the Figma "Budget range" component. */
export function BudgetRange({ min, max, usual }) {
  const span = max - min
  const pos = Math.max(0, Math.min(1, (usual - min) / span))
  let text, tone = 't2', fill = [pos, 1]
  if (usual < min) { text = 'Pays above your usual rate'; tone = 'brand'; fill = [0, 1] }
  else if (usual >= max) { text = 'Tops out at your usual rate'; fill = null }
  else text = `Your usual ${rupee(usual)} is in range`
  const [shown, setShown] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShown(true), 60); return () => clearTimeout(t) }, [])
  const markerAt = usual < min ? 0 : usual >= max ? 1 : pos
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div style={{ position: 'relative', height: 12, width: '100%' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 4, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        {fill && (
          <div style={{
            position: 'absolute', top: 4, height: 4, borderRadius: 2, background: 'var(--brand)',
            left: `${fill[0] * 100}%`, width: shown ? `${(fill[1] - fill[0]) * 100}%` : 0,
            transition: 'width .8s var(--ease)',
          }} />
        )}
        <div style={{ position: 'absolute', top: 0, width: 2, height: 12, background: 'var(--ink)', left: `calc(${markerAt * 100}% - ${markerAt === 1 ? 2 : markerAt === 0 ? 0 : 1}px)` }} />
      </div>
      <span className="caption" style={{ color: tone === 'brand' ? 'var(--brand-text)' : 'var(--text-secondary)' }}>{text}</span>
    </div>
  )
}

export const PlatformPill = ({ platform }) => {
  const yt = platform.toLowerCase().includes('youtube')
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 8px', borderRadius: 6, background: 'rgba(255,255,255,.16)', color: '#fff', fontSize: 12, lineHeight: '16px' }}>
      <Icon name={yt ? 'youtube' : 'instagram'} size={13} />
      {platform}
    </span>
  )
}

export function Skeleton({ h = 16, w = '100%', r = 6, style }) {
  return <div className="skeleton" style={{ height: h, width: w, borderRadius: r, ...style }} />
}

export function EmptyState({ title, body, action }) {
  return (
    <div style={{ padding: '48px 16px', textAlign: 'center', border: '1px dashed var(--border-strong)', borderRadius: 12 }}>
      <p className="h3" style={{ margin: '0 0 4px' }}>{title}</p>
      <p className="body-sm t2" style={{ margin: '0 0 16px' }}>{body}</p>
      {action}
    </div>
  )
}

export function Checkbox({ checked, onChange, label, count }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="check__box"><Icon name="check" size={12} strokeWidth={2.4} /></span>
      <span className="check__label">{label}</span>
      {count !== undefined && <span className="caption t3">{count}</span>}
    </label>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle-row">
      <span className="body-sm t2" style={{ flex: 1 }}>{label}</span>
      <button type="button" role="switch" aria-checked={checked} className={`toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}><i /></button>
    </label>
  )
}

/** Small custom dropdown (used for sorting). options = [[value, label], ...] */
export function Dropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  const current = options.find(([v]) => v === value)
  return (
    <div className="dd" ref={ref}>
      <button type="button" className="dd__btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="body-sm-m">{current?.[1]}</span>
        <Icon name="chevronDown" size={16} style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <ul className="dd__menu" role="listbox">
          {options.map(([v, l]) => (
            <li key={v} role="option" aria-selected={v === value}>
              <button type="button" className={v === value ? 'sel' : ''} onClick={() => { onChange(v); setOpen(false) }}>{l}{v === value && <Icon name="check" size={14} />}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SearchBox({ value, onChange, placeholder = 'Search by brand or keyword', className = '' }) {
  return (
    <label className={`searchbox ${className}`}>
      <Icon name="search" size={16} style={{ color: 'var(--text-tertiary)' }} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button type="button" onClick={() => onChange('')} aria-label="Clear search" style={{ color: 'var(--text-tertiary)' }}><Icon name="x" size={14} /></button>}
    </label>
  )
}
