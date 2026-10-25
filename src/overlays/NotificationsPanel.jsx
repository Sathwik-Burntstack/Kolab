import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { Button, Skeleton } from '../components/ui'
import { api } from '../services/api'

export default function NotificationsPanel({ onClose }) {
  const [items, setItems] = useState(null)
  useEffect(() => { api.getNotifications().then(setItems) }, [])
  const readAll = async () => { await api.markAllRead(); setItems((s) => s.map((n) => ({ ...n, unread: false }))) }
  return (
    <Modal drawer title="Notifications" onClose={onClose} footer={null}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <Button size="sm" onClick={readAll}>Mark all read</Button>
      </div>
      {!items ? [1, 2, 3].map((i) => <Skeleton key={i} h={56} style={{ marginBottom: 10 }} />) : items.map((n) => (
        <div key={n.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderTop: '1px solid var(--border)' }}>
          <span style={{ width: 3, borderRadius: 2, background: n.unread ? 'var(--brand)' : 'var(--border-strong)' }} />
          <div style={{ flex: 1 }}>
            <div className="body-sm-m">{n.title}</div>
            <div className="caption t2">{n.body}</div>
            <div className="caption t3" style={{ marginTop: 4 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </Modal>
  )
}
