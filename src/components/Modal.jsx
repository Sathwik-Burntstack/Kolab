import { useEffect } from 'react'
import Icon from './Icon'

export default function Modal({ title, onClose, children, footer, wide, drawer, icon }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])
  const Box = drawer ? 'aside' : 'div'
  return (
    <div className={`scrim ${drawer ? 'drawer-scrim' : ''}`} onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <Box className={drawer ? `drawer ${wide ? 'wide' : ''}` : `modal ${wide ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal__head" style={drawer ? { padding: '22px 20px 12px' } : undefined}>
          {icon}
          <h2 className="h2">{title}</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>
        <div className="modal__body" style={drawer ? { padding: '4px 20px 20px', flex: 1 } : undefined}>{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </Box>
    </div>
  )
}
