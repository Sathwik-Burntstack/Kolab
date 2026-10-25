import { useEffect } from 'react'
import Icon from './Icon'

const TONES = { brand: ['var(--brand-soft)', 'var(--brand)'], success: ['var(--success-soft)', 'var(--success)'], danger: ['var(--danger-soft)', 'var(--danger)'], signal: ['var(--signal-soft)', 'var(--signal-text)'] }

/** Small confirmation dialog from the Figma overlays (icon circle, title, text, optional rows, two actions). */
export default function Dialog({ icon = 'check', tone = 'success', title, children, rows, actions, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])
  const [bg, fg] = TONES[tone] || TONES.brand
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
        <span className="dialog__icon" style={{ background: bg, color: fg }}><Icon name={icon} size={20} /></span>
        <h2 className="h2">{title}</h2>
        {children && <div className="body-sm t2">{children}</div>}
        {rows && (
          <div className="dialog__rows">
            {rows.map(([k, v]) => <div key={k}><span className="t2">{k}</span><span className="body-sm-m" style={{ color: 'var(--text-primary)' }}>{v}</span></div>)}
          </div>
        )}
        {actions && <div className="dialog__actions">{actions}</div>}
      </div>
    </div>
  )
}
