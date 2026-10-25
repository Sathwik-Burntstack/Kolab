import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Dialog from '../components/Dialog'
import Icon from '../components/Icon'
import { Button, EmptyState, Skeleton, rupee } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

export default function Agreement() {
  const { id } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const { data: a, loading, error } = useAsync(() => api.getAgreement(id), [id])
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [declining, setDeclining] = useState(false)

  if (error) return <EmptyState title="We couldn’t find that agreement" body="It may have expired or already been answered." action={<Link to="/bids"><Button>Back to my bids</Button></Link>} />
  if (loading || !a) return <><Skeleton h={20} w={80} style={{ marginBottom: 20 }} /><Skeleton h={48} w="55%" style={{ marginBottom: 28 }} /><div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}><div style={{ flex: 1, minWidth: 280 }}><Skeleton h={420} /></div><div style={{ width: 360, maxWidth: '100%' }}><Skeleton h={380} /></div></div></>

  const fee = Math.round(a.price * 0.1), tds = Math.round(a.price * 0.01), net = a.price - fee - tds
  const accept = async () => { setBusy(true); try { await api.acceptAgreement(a.id); setDone(true) } catch (e) { toast(e.message || 'Could not accept', 'info') } finally { setBusy(false) } }
  const decline = async () => { setBusy(true); await api.declineAgreement(a.id, {}); setBusy(false); setDeclining(false); toast('Offer declined'); nav('/bids') }

  return (
    <>
      <Link to="/bids" className="back"><Icon name="chevronLeft" size={16} />My bids</Link>
      <div className="aj-head">
        <span className="logo" style={{ background: a.logo, width: 40, height: 40, borderRadius: 8 }}>{a.initials}</span>
        <div className="titles">
          <span className="body-sm t3">{a.brand} picked your bid · Agreement</span>
          <h1 className="display">{a.title}</h1>
        </div>
        <span className="pill-signal"><Icon name="clock" size={16} />Accept by {a.acceptBy}</span>
      </div>

      <div className="jd-cols" style={{ paddingTop: 12 }}>
        <section style={{ flex: 1, minWidth: 0 }}>
          <h2 className="h2" style={{ marginBottom: 12 }}>What you’re agreeing to</h2>
          <div className="terms agree">{a.terms.map(([k, v]) => <div key={k}><span>{k}</span><span style={{ flex: 1 }}>{v}</span></div>)}</div>
        </section>
        <aside className="bidpanel" style={{ width: 360 }}>
          <h2 className="h2">Your money</h2>
          <div className="recv">
            <div><span>Price</span><span>{rupee(a.price)}</span></div>
            <div><span>Kolab fee (10%)</span><span>− {rupee(fee)}</span></div>
            <div><span>TDS (1%)</span><span>− {rupee(tds)}</span></div>
            <div className="total"><span>You receive</span><span className="numeric">{rupee(net)}</span></div>
          </div>
          <label className="check" style={{ alignItems: 'flex-start', color: 'var(--text-primary)' }}>
            <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
            <span className="check__box" style={{ marginTop: 2 }}><Icon name="check" size={12} strokeWidth={2.4} /></span>
            <span className="check__label">I’ve read the terms and can post by {a.postBy}</span>
          </label>
          <Button variant="primary" block disabled={!ok || busy} onClick={accept}>{busy && !declining ? 'Accepting…' : 'Accept agreement'}</Button>
          <Button block className="ghost" onClick={() => setDeclining(true)}>Decline</Button>
          <p className="caption t3" style={{ margin: 0 }}>If you don’t answer by {a.acceptBy}, {a.brand} can pick another creator.</p>
        </aside>
      </div>

      {done && (
        <Dialog tone="success" icon="check" title="Agreement accepted" onClose={() => setDone(false)}
          rows={[['Held by Kolab', rupee(a.price)], ['Post by', a.postBy], ['You receive', rupee(net)]]}
          actions={<><Button onClick={() => nav('/bids')}>Back to my bids</Button><Button variant="primary" onClick={() => nav(`/active/${a.id}`)}>Go to active job</Button></>}>
          {a.brand} has paid Kolab and the money is held safely until your work is approved.
        </Dialog>
      )}
      {declining && (
        <Dialog tone="danger" icon="x" title={`Decline ${a.brand}’s offer?`} onClose={() => setDeclining(false)}
          actions={<><Button onClick={() => setDeclining(false)}>Keep the offer</Button><Button variant="primary" disabled={busy} onClick={decline}>{busy ? 'Declining…' : 'Decline offer'}</Button></>}>
          They’ll be told you can’t take the job and may pick another creator. This can’t be undone.
        </Dialog>
      )}
    </>
  )
}
