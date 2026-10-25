import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Chat from '../components/Chat'
import Dialog from '../components/Dialog'
import Icon from '../components/Icon'
import { Button, EmptyState, Reveal, Skeleton, rupee } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

const STEPS = (j) => [
  { k: 'agreement', label: 'Agreement', sub: `Signed ${j.signed}` },
  { k: 'draft', label: 'Draft', sub: `Due ${j.due}` },
  { k: 'review', label: 'Brand review', sub: `Up to 2 rounds` },
  { k: 'live', label: 'Goes live', sub: `By ${j.goesLive}` },
  { k: 'paid', label: 'Paid', sub: '70% then 30%' },
]
const ORDER = ['agreement', 'draft', 'review', 'live', 'paid']

export function ActiveList() {
  const { data, loading } = useAsync(() => api.getActiveJobs(), [])
  const nav = useNavigate()
  return (
    <>
      <div className="page-header"><div><span className="body-sm t3">{data ? `${data.length} jobs in progress` : ' '}</span><h1 className="display">Active jobs</h1></div></div>
      {loading ? <Skeleton h={180} r={10} /> : !data?.length ? <EmptyState title="No active jobs yet" body="Win a bid and it shows up here." action={<Link to="/jobs"><Button variant="primary">Find jobs</Button></Link>} /> : (
        <div className="rows">
          {data.map((j) => (
            <div className="bidrow" key={j.id} role="link" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => nav(`/active/${j.id}`)} onKeyDown={(e) => e.key === 'Enter' && nav(`/active/${j.id}`)}>
              <span className="logo sm" style={{ background: j.logo }}>{j.initials}</span>
              <div className="bidrow__main"><span className="body-sm-m" style={{ fontSize: 14 }}>{j.title}</span><span className="caption t3">{j.brand} · {j.platform}</span></div>
              <span className="numeric bidrow__price">{rupee(j.price)}</span>
              <span className="body-sm bidrow__status" style={{ color: j.stage === 'draft' ? 'var(--signal-text)' : 'var(--text-secondary)' }}>{j.stage === 'draft' ? `Draft due ${j.due}` : 'Brand is reviewing'}</span>
              <span className="bidrow__badge" />
              <span className="bidrow__action"><Button size="sm" variant={j.stage === 'draft' ? 'primary' : 'secondary'}>Open</Button></span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default function ActiveJob() {
  const { id } = useParams()
  const { data: j, loading, error, reload } = useAsync(() => api.getActiveJob(id), [id])
  const [file, setFile] = useState(null)
  const [over, setOver] = useState(false)
  const [note, setNote] = useState('Shot on Thursday morning when the floor was empty. Captions are in Telugu and English.')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const inp = useRef(null)
  const toast = useToast()
  const nav = useNavigate()

  if (error) return <EmptyState title="We couldn’t find that job" body="It may have been completed." action={<Link to="/active"><Button>Back to active jobs</Button></Link>} />
  if (loading || !j) return <><Skeleton h={48} w="60%" style={{ marginBottom: 28 }} /><Skeleton h={30} style={{ marginBottom: 28 }} /><div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}><div style={{ flex: 1, minWidth: 280 }}><Skeleton h={420} /></div><div style={{ width: 380, maxWidth: '100%' }}><Skeleton h={520} /></div></div></>

  const cur = ORDER.indexOf(j.stage)
  const pick = (f) => {
    if (!f) return
    if (!/\.(mp4|mov)$/i.test(f.name)) return toast('Please choose an MP4 or MOV video', 'info')
    if (f.size > 500 * 1024 * 1024) return toast('That file is over 500 MB', 'info')
    setFile(f)
  }
  const send = async () => {
    if (!file && j.stage === 'draft') return toast('Choose your video first', 'info')
    setBusy(true)
    try { await api.submitDraft(j.id, { file, note }); setSent(true); reload() } catch (e) { toast(e.message || 'Could not send the draft', 'info') } finally { setBusy(false) }
  }

  return (
    <>
      <div className="aj-head">
        <span className="logo" style={{ background: j.logo, width: 40, height: 40, borderRadius: 8 }}>{j.initials}</span>
        <div className="titles">
          <span className="body-sm t3">{j.brand} · {j.platform} · {rupee(j.price)}</span>
          <h1 className="display">{j.title}</h1>
        </div>
        {j.stage === 'draft' && <span className="pill-signal"><Icon name="clock" size={16} />Draft due {j.due} · {j.daysLeft} days</span>}
      </div>

      <div className="steps" aria-label="Job progress">
        {STEPS(j).map((s, i) => (
          <div key={s.k} className={`step ${i < cur ? 'done' : i === cur ? 'cur' : ''}`} style={{ '--i': i }}>
            <div className="bar" style={{ animationDelay: `${i * 90}ms` }} />
            <span className="lbl">{i < cur && <Icon name="check" size={14} />}{s.label}</span>
            <span className="caption t3">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="aj-cols">
        <div className="aj-work">
          <Reveal>
            <h2 className="h2" style={{ marginBottom: 10 }}>What you agreed to</h2>
            <div className="terms">{j.terms.map(([k, v]) => <div key={k}><span>{k}</span><span style={{ flex: 1 }}>{v}</span></div>)}</div>
          </Reveal>

          {j.stage === 'draft' ? (
            <Reveal delay={80} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h2 className="h2">Send your draft</h2>
              <div className={`drop ${over ? 'over' : ''} ${file ? 'has' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
                onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files?.[0]) }}>
                <span className="drop__ic"><Icon name={file ? 'check' : 'upload'} size={18} style={file ? { color: 'var(--success)' } : undefined} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="body-sm-m" style={{ fontSize: 14, lineHeight: '22px' }}>{file ? file.name : 'Drop the video here, or choose a file'}</div>
                  <div className="caption t3">{file ? `${(file.size / 1048576).toFixed(1)} MB · ready to send` : 'MP4 or MOV, vertical, up to 500 MB'}</div>
                </div>
                <input ref={inp} type="file" accept=".mp4,.mov,video/mp4,video/quicktime" hidden onChange={(e) => pick(e.target.files?.[0])} />
                <Button size="sm" onClick={() => inp.current?.click()}>{file ? 'Replace' : 'Choose file'}</Button>
              </div>
              <div className="field">
                <label htmlFor="note">Note for {j.brand.split(' ')[0]} (optional)</label>
                <textarea id="note" className="textarea" style={{ height: 112 }} value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className="body-sm t3" style={{ flex: 1, minWidth: 200 }}>{j.brand.split(' ')[0]} can approve it or ask for changes. {j.roundsLeft} rounds left.</span>
                <Button variant="primary" disabled={busy} onClick={send}>{busy ? 'Sending…' : 'Send draft'}</Button>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={80} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h2 className="h2">Your draft is with {j.brand.split(' ')[0]}</h2>
              <p className="body-sm t2" style={{ margin: 0 }}>They can approve it or ask for changes. You’ll get a notification the moment they reply.</p>
            </Reveal>
          )}
        </div>
        <Chat threadId={j.id} contact={j.contact} initial={j.messages} logo={j.logo} initials={j.initials} />
      </div>

      {sent && (
        <Dialog tone="success" icon="check" title="Draft sent" onClose={() => setSent(false)}
          actions={<><Button onClick={() => setSent(false)}>Stay here</Button><Button variant="primary" onClick={() => nav('/active')}>View active jobs</Button></>}>
          {j.brand} has 48 hours to approve it or ask for changes. Your chat stays open in the meantime.
        </Dialog>
      )}
    </>
  )
}
