import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import BidSent from '../overlays/BidSent'
import { Avatar, Badge, Button, Chip, PlatformPill, Reveal, Skeleton, range, rupee } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

const FEE = 0.1, TDS = 0.01
const num = (v) => Number(String(v).replace(/\D/g, '')) || 0

function Sits({ job, amount }) {
  const span = job.max - job.min
  const pct = (v) => Math.max(0, Math.min(1, (v - job.min) / span)) * 100
  const out = amount && (amount < job.min || amount > job.max)
  return (
    <div className="sits">
      <span className="overline" style={{ color: 'var(--text-secondary)' }}>Where your bid sits</span>
      <div className="sits__track">
        <div className="base" />
        <div className="fill" style={{ left: `${job.usual < job.min ? 0 : pct(job.usual)}%`, width: `${100 - (job.usual < job.min ? 0 : pct(job.usual))}%` }} />
        {job.usual >= job.min && job.usual <= job.max && <div className="usual" style={{ left: `${pct(job.usual)}%` }} />}
        {amount > 0 && <div className="you" style={{ left: `${pct(amount)}%` }} />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="caption t2">{rupee(job.min)}</span><span className="caption t2">{rupee(job.max)}</span></div>
      <div className="legend caption t2">
        <span><i className="k" />Your usual {rupee(job.usual)}</span>
        <span><i className="c" />This bid</span>
      </div>
      {out && <span className="caption" style={{ color: 'var(--danger)' }}>This is outside the brand’s budget range.</span>}
    </div>
  )
}

function BidPanel({ job, d }) {
  const [price, setPrice] = useState(String(Math.round((job.min + job.max) / 2 / 500) * 500))
  const [why, setWhy] = useState('')
  const [views, setViews] = useState('15000')
  const [postDate, setPostDate] = useState(d.defaultPostDate)
  const [links, setLinks] = useState(d.similar.map((s) => ({ ...s })))
  const [adding, setAdding] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [errs, setErrs] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(null)
  const toast = useToast()
  const amount = num(price)
  const fee = Math.round(amount * FEE), tds = Math.round(amount * TDS), receive = amount - fee - tds

  const validate = () => {
    const e = {}
    if (!amount) e.price = 'Enter your price.'
    else if (amount < job.min || amount > job.max) e.price = `Keep it between ${rupee(job.min)} and ${rupee(job.max)}.`
    if (why.trim().length < 20) e.why = 'Tell the brand why in at least a sentence.'
    if (!num(views)) e.views = 'Enter the views you expect.'
    if (!postDate) e.postDate = 'Pick a post date.'
    setErrs(e)
    return !Object.keys(e).length
  }
  const send = async () => {
    if (!validate()) { toast('Check the highlighted fields', 'info'); return }
    setSending(true)
    try {
      const bid = await api.placeBid(job.id, { amount, why, expectedViews: num(views), postDate, links: links.map((l) => l.url || l.title) })
      setSent(bid)
    } catch (err) { toast(err.message || 'Could not send your bid', 'info') } finally { setSending(false) }
  }
  const addLink = () => {
    if (!/^https?:\/\//i.test(newLink.trim())) { toast('Paste a full link starting with https://', 'info'); return }
    setLinks((l) => [...l, { title: newLink.trim().replace(/^https?:\/\//, '').slice(0, 40), views: 'Link added', url: newLink.trim(), platform: newLink.includes('youtu') ? 'youtube' : 'instagram' }])
    setNewLink(''); setAdding(false); toast('Link added')
  }
  const save = async () => { const r = await api.toggleSave(job.id); toast(r.saved ? 'Saved' : 'Removed from saved') }

  return (
    <aside className="bidpanel" id="bid">
      <div>
        <h2 className="h2">Your bid</h2>
        <span className="body-sm-m" style={{ color: 'var(--signal-text)' }}>Closes {d.closesAt}</span>
      </div>
      <Sits job={job} amount={amount} />

      <div className="field">
        <label htmlFor="price">Your price</label>
        <div className="prefix"><span>₹</span><input id="price" className={`input ${errs.price ? 'err' : ''}`} inputMode="numeric" value={amount ? amount.toLocaleString('en-IN') : ''} onChange={(e) => setPrice(e.target.value)} /></div>
        {errs.price && <span className="err-msg">{errs.price}</span>}
      </div>
      <div className="field">
        <label htmlFor="why">Why this price</label>
        <textarea id="why" className={`textarea ${errs.why ? 'err' : ''}`} style={{ minHeight: 112 }} value={why} onChange={(e) => setWhy(e.target.value)}
          placeholder="Your usual reel costs ₹6,000. Mention your reach, your edit style, or anything that justifies a higher or lower quote." />
        <div style={{ display: 'flex' }}>{errs.why ? <span className="err-msg" style={{ flex: 1 }}>{errs.why}</span> : <span style={{ flex: 1 }} />}<span className="hint">{why.length}/400</span></div>
      </div>
      <div className="field">
        <label htmlFor="views">Views you expect</label>
        <input id="views" className={`input ${errs.views ? 'err' : ''}`} inputMode="numeric" value={num(views) ? num(views).toLocaleString('en-IN') : ''} onChange={(e) => setViews(e.target.value)} />
        <span className="hint">{errs.views || `Your last 10 reels averaged ${d.last10Avg.toLocaleString('en-IN')}`}</span>
      </div>
      <div className="field">
        <label htmlFor="pd">Post date</label>
        <input id="pd" type="date" className={`input ${errs.postDate ? 'err' : ''}`} value={postDate} min="2026-10-18" onChange={(e) => setPostDate(e.target.value)} />
        <span className="hint">{errs.postDate || `The brand needs it live by ${d.postBy}`}</span>
      </div>

      <div className="field">
        <label>Similar work</label>
        {links.map((l, i) => (
          <div className="linkrow" key={i}>
            <Icon name={l.platform === 'youtube' ? 'youtube' : 'instagram'} size={16} style={{ color: 'var(--text-secondary)' }} />
            <div style={{ flex: 1, minWidth: 0 }}><div className="body-sm-m" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div><div className="caption t3">{l.views}</div></div>
            <button aria-label="Remove link" onClick={() => setLinks((x) => x.filter((_, k) => k !== i))}><Icon name="x" size={14} /></button>
          </div>
        ))}
        {adding ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" autoFocus placeholder="https://instagram.com/reel/…" value={newLink} onChange={(e) => setNewLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLink()} />
            <Button size="sm" onClick={addLink}>Add</Button>
          </div>
        ) : <button className="link" style={{ textAlign: 'left' }} onClick={() => setAdding(true)}>+ Add a link</button>}
      </div>

      <div className="recv">
        <div><span>Your price</span><span>{rupee(amount)}</span></div>
        <div><span>Kolab fee (10%)</span><span>− {rupee(fee)}</span></div>
        <div><span>TDS withheld (1%)</span><span>− {rupee(tds)}</span></div>
        <div className="total"><span>You receive</span><span>{rupee(Math.max(0, receive))}</span></div>
      </div>

      <Button variant="primary" block disabled={sending} onClick={send}>{sending ? 'Sending…' : 'Send bid'}</Button>
      <Button block onClick={save}>Save for later</Button>
      <p className="caption t3" style={{ margin: 0 }}>The brand sees all bids after {d.closesAt.split(' at')[0]}. You can edit or withdraw until then.</p>
      {sent && <BidSent bid={sent} job={job} onClose={() => setSent(null)} />}
    </aside>
  )
}

export default function JobDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { data: d, loading, error } = useAsync(() => api.getJob(id), [id])
  const toast = useToast()

  if (error) return <><Link to="/jobs" className="back"><Icon name="arrowLeft" size={16} />Find jobs</Link><p className="t2">We couldn’t find that job. <Link className="link" to="/jobs">Back to all jobs</Link></p></>
  if (loading || !d) return <><Skeleton h={20} w={100} style={{ marginBottom: 20 }} /><Skeleton h={48} w="55%" style={{ marginBottom: 24 }} /><div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}><div style={{ flex: 1, minWidth: 280 }}><Skeleton h={300} /></div><div style={{ width: 384, maxWidth: '100%' }}><Skeleton h={560} /></div></div></>

  return (
    <>
      <Link to="/jobs" className="back"><Icon name="arrowLeft" size={16} />Find jobs</Link>
      <div className="jd-head">
        <div className="titles">
          <span className="body-sm t3">{d.brand} · {d.kind} · {d.city}</span>
          <h1 className="display">{d.title}</h1>
        </div>
        <Button className="mobile-only" variant="primary" onClick={() => document.getElementById('bid')?.scrollIntoView({ behavior: 'smooth' })}>Place a bid</Button>
      </div>

      <div className="jd-cols">
        <div className="jd-brief">
          <Reveal className="keyfacts">
            <div><span className="overline">Budget</span><span className="numeric">{range(d.min, d.max)}</span></div>
            <div><span className="overline">Platform</span><span className="body-sm-m" style={{ fontSize: 14 }}>{d.platform}</span></div>
            <div><span className="overline">Length</span><span className="body-sm-m" style={{ fontSize: 14 }}>{d.length}</span></div>
            <div><span className="overline">Minimum views</span><span className="body-sm-m" style={{ fontSize: 14 }}>{d.minViews.toLocaleString('en-IN')}</span></div>
            <div><span className="overline">Post by</span><span className="body-sm-m" style={{ fontSize: 14 }}>{d.postBy}</span></div>
            <div><span className="overline">Bids so far</span><span className="body-sm-m" style={{ fontSize: 14 }}>{d.bids}</span></div>
          </Reveal>

          <Reveal className="jd-sec"><h2 className="h2">The brief</h2><p style={{ margin: 0, color: 'var(--text-secondary)' }}>{d.brief}</p></Reveal>
          <Reveal className="jd-sec"><h2 className="h2">What you deliver</h2><ul className="bullets">{d.deliver.map((x) => <li key={x}>{x}</li>)}</ul></Reveal>
          <Reveal className="jd-sec"><h2 className="h2">Ground rules</h2><ul className="bullets">{d.rules.map((x) => <li key={x}>{x}</li>)}</ul></Reveal>
          <Reveal className="jd-sec">
            <h2 className="h2">Where you’ll shoot</h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <Icon name="pin" style={{ marginTop: 2, color: 'var(--text-secondary)' }} />
              <div style={{ flex: 1 }}>
                <div className="body-sm-m" style={{ fontSize: 14 }}>{d.where.address}</div>
                <div className="body-sm t2">{d.where.note}</div>
                <a className="link" href={d.where.maps} target="_blank" rel="noreferrer">Open in Maps →</a>
              </div>
            </div>
          </Reveal>
          <Reveal className="jd-sec">
            <h2 className="h2">How you get paid</h2>
            <p className="body-sm t2" style={{ margin: 0 }}>Kolab holds the money once the brand accepts your bid. You are paid in two parts.</p>
            <div>
              <div className="split"><span className="numeric">70%</span><span className="body-sm" style={{ flex: 1 }}>When the brand approves your post</span></div>
              <div className="split"><span className="numeric">30%</span><span className="body-sm" style={{ flex: 1 }}>7 days later, once your views are checked against the {d.minViews.toLocaleString('en-IN')} minimum</span></div>
            </div>
          </Reveal>
          <Reveal className="jd-sec">
            <h2 className="h2">About {d.brand}</h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="logo" style={{ background: d.logo }}>{d.initials}</span>
              <div>
                <div className="body-sm-m" style={{ fontSize: 14 }}>On Kolab since {d.about.since}</div>
                <div className="body-sm t2">{d.about.verified} · hired {d.about.hired} creators · rated {d.about.rating} · {d.about.approves}</div>
              </div>
            </div>
          </Reveal>
        </div>
        <BidPanel job={d} d={d} />
      </div>
    </>
  )
}
