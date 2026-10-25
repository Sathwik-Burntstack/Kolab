import { createContext, useCallback, useContext, useState } from 'react'
import Icon from './Icon'

const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((text, icon = 'check') => {
    const id = Math.random().toString(36).slice(2)
    setItems((s) => [...s, { id, text, icon }])
    setTimeout(() => setItems((s) => s.map((t) => (t.id === id ? { ...t, out: true } : t))), 2300)
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2600)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.out ? 'out' : ''}`}>
            <Icon name={t.icon} size={16} style={{ color: 'var(--signal)' }} />
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
