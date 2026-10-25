import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dialog from '../components/Dialog'
import Modal from '../components/Modal'
import { Badge, Button, Reveal, Skeleton, rupee } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

const BADGE = {
  won: ['success', 'Won'], shortlisted: ['brand', 'Shortlisted'], sent: ['neutral', 'Sent'],
  notpicked: ['neutral', 'Not picked'], withdrawn: ['neutral', 'Withdrawn'], cancelled: ['danger', 'Cancelled'],
}
const GROUPS = [
  { key: 'won', title: 'Won', hint: 'Accept within 48 hours or the brand can pick someone else', match: ['won'] },
  { key: 'waiting', title: 'Waiting on the brand', hint: (n) => `${n} bid${n === 1 ? '' : 's'} · you can still change these`, match: ['shortlisted', 'sent'] },
  { key: 'closed', title: 'Closed', hint: () => 'Last 30 days', match: ['notpicked', 'withdrawn', 'cancelled'] },
]

export function EditBid({ bid, onClose, onSaved }) {
  const [amount, setAmount] = useState(String(bid.amount))
  const [why, setWhy] = useState(bid.why || '')
  const [busy, setBusy] = useState(false)
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const toast = useToast()
  const n = Number(amount.replace(/\D/g, '')) || 0
  const save = async () => {
    if (!n) return toast('Enter a price', 'info')
    setBusy(true)
    await api.updateBid(bid.id, { amount: n, why })
    setBusy(false); toast('Bid updated'); onSaved(); onClose()
  }
  const withdraw = async () => { setBusy(true); await api.withdrawBid(bid.id); setBusy(false); toast('Bid withdrawn'); onSaved(); onClose() }
  if (confirmWithdraw) return (
    <Dialog tone="danger" icon="x" title={`Withdraw your bid for ${bid.brand}?`} onClose={() => setConfirmWithdraw(false)}
      actions={<><Button onClick={() => setConfirmWithdraw(false)}>Keep my bid</Button><Button variant="primary" disabled={busy} onClick={withdraw}>{busy ? 'Withdrawing…' : 'Withdraw bid'}</Button></>}>
      The brand won’t see it when bidding closes. You can bid again while the job is open.
    </Dialog>
  )
  return (
    <Modal title="Edit bid" onClose={onClose}
      footer={<><Button variant="danger" onClick={() => setConfirmWithdraw(true)} style={{ marginRight: 'auto' }}>Withdraw bid</Button><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save changes'}</Button></>}>
      <p className="body-sm t2" style={{ margin: '0 0 14px' }}>{bid.title} · {bid.brand}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="field"><label htmlFor="eb-price">Your price</label>
          <div className="prefix"><span>₹</span><input id="eb-price" className="input" inputMode="numeric" value={n ? n.toLocaleString('en-IN') : ''} onChange={(e) => setAmount(e.target.value)} /></div></div>
        <div className="field"><label htmlFor="eb-why">Why this price</label>
          <textarea id="eb-why" className="textarea" value={why} onChange={(e) => setWhy(e.target.value)} /></div>
      </div>
    </Modal>
  )
}

export default function MyBids() {
  const { data, loading, reload } = useAsync(() => api.getBids(), [])
  const [editing, setEditing] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const nav = useNavigate()
  const items = data?.items || []

  const action = (b) => {
    if (b.status === 'won') return <Button size="sm" variant="primary" onClick={() => nav(`/agreement/${b.jobId}`)}>Review agreement</Button>
    if (b.question) return <Button size="sm" onClick={() => nav('/messages')}>Reply</Button>
    if (b.status === 'shortlisted' || b.status === 'sent') return <Button size="sm" className="ghost" onClick={() => setEditing(b)}>Edit bid</Button>
    if (b.status === 'notpicked') return <Button size="sm" className="ghost" onClick={() => setFeedback(b)}>See feedback</Button>
    return <Button size="sm" className="ghost" onClick={() => nav(`/jobs/${b.jobId}`)}>View</Button>
  }
  const tone = (b) => b.status === 'won' ? 'var(--signal-text)' : b.question ? 'var(--brand-text)' : 'var(--text-secondary)'

  return (
    <>
      <div className="page-header">
        <div>
          <span className="body-sm t3">{data ? `${data.summary.total} bids in ${data.summary.month} · ${data.summary.won} won` : ' '}</span>
          <h1 className="display">My bids</h1>
        </div>
        <Link to="/jobs"><Button>Find more jobs</Button></Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {loading && [1, 2, 3].map((i) => <Skeleton key={i} h={110} r={10} />)}
        {!loading && GROUPS.map((g, gi) => {
          const rows = items.filter((b) => g.match.includes(b.status))
          if (!rows.length) return null
          return (
            <Reveal key={g.key} delay={gi * 70} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <h2 className="h2">{g.title}</h2>
                <span className="body-sm t3">{typeof g.hint === 'function' ? g.hint(rows.length) : g.hint}</span>
              </div>
              <div className="rows">
                {rows.map((b) => (
                  <div className="bidrow" key={b.id}>
                    <span className="logo sm" style={{ background: b.logo }}>{b.initials}</span>
                    <div className="bidrow__main">
                      <span className="body-sm-m" style={{ fontSize: 14, lineHeight: '22px' }}>{b.title}</span>
                      <span className="caption t3">{b.brand} · {b.platform}</span>
                    </div>
                    <span className="numeric bidrow__price">{rupee(b.amount)}</span>
                    <span className="body-sm bidrow__status" style={{ color: tone(b) }}>{b.statusText}</span>
                    <span className="bidrow__badge"><Badge tone={BADGE[b.status][0]}>{BADGE[b.status][1]}</Badge></span>
                    <span className="bidrow__action">{action(b)}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )
        })}
      </div>

      {editing && <EditBid bid={editing} onClose={() => setEditing(null)} onSaved={reload} />}
      {feedback && (
        <Dialog tone="signal" icon="info" title={`Feedback from ${feedback.brand}`} onClose={() => setFeedback(null)} actions={<Button variant="primary" onClick={() => setFeedback(null)}>Got it</Button>}>
          {feedback.feedback || 'Thanks for bidding. We went with a creator who already shoots inside cafés like ours. Your reel style is a good fit, so bid again next time.'}
        </Dialog>
      )}
    </>
  )
}
