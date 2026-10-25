import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import JobCard from '../components/JobCard'
import { Button, Chip, CountUp, Reveal, Skeleton, rupee } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

const SORTS = [['best', 'Best match'], ['closing', 'Closing soon'], ['highest', 'Highest pay'], ['near', 'Near me']]
const MARK = { signal: 'var(--signal)', brand: 'var(--brand)', neutral: 'var(--border-strong)' }

export default function Home() {
  const [sort, setSort] = useState('best')
  const { data, loading } = useAsync(() => api.getHome(), [])
  const [saved, setSaved] = useState({})
  const toast = useToast()
  const nav = useNavigate()

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  const jobs = (data?.featured || []).map((j) => ({ ...j, saved: saved[j.id] ?? j.saved }))
  const sorted = [...jobs].sort((a, b) => sort === 'highest' ? b.max - a.max : sort === 'closing' ? Number(b.urgent) - Number(a.urgent) : 0)

  const save = async (job) => {
    const r = await api.toggleSave(job.id)
    setSaved((s) => ({ ...s, [job.id]: r.saved }))
    toast(r.saved ? 'Saved' : 'Removed from saved')
  }
  const act = (t) => {
    if (t.kind === 'draft') nav(`/active/${t.jobId}`)
    else if (t.kind === 'agreement') nav(`/agreement/${t.jobId}`)
    else nav('/messages')
  }

  return (
    <>
      <div className="page-header">
        <div>
          <span className="body-sm t3">{today}</span>
          <h1 className="display">New jobs for you</h1>
        </div>
        <Link to="/jobs"><Button>Browse all {data?.totalJobs ?? 128} jobs</Button></Link>
      </div>

      <div className="home-cols">
        <section className="home-jobs" aria-label="Jobs matched to you">
          <div className="sortbar">
            {SORTS.map(([k, l]) => <Chip key={k} on={sort === k} onClick={() => setSort(k)}>{l}</Chip>)}
            <span className="spacer" />
            <span className="caption t3">Matched to {data?.matchedTo ?? 'food, cafés and Vijayawada'}</span>
          </div>
          <div className="job-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={330} r={12} />)
              : sorted.map((j, i) => <Reveal key={j.id} delay={i * 60}><JobCard job={j} onSave={save} /></Reveal>)}
          </div>
        </section>

        <aside className="home-side" aria-label="Your day">
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="section-head"><h2 className="h2">Needs you today</h2><span className="body-sm-m" style={{ color: 'var(--signal-text)' }}>{data?.needsYou?.length ?? 3}</span></div>
              <div className="tasks">
                {(data?.needsYou || []).map((t) => (
                  <div className="task" key={t.id}>
                    <span className="marker" style={{ background: MARK[t.tone] }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="body-sm-m">{t.title}</div>
                      <div className="caption t2" style={{ marginTop: 3 }}>{t.body}</div>
                      <div className="actions"><Button size="sm" variant={t.kind === 'draft' ? 'primary' : 'secondary'} onClick={() => act(t)}>{t.action}</Button></div>
                    </div>
                  </div>
                ))}
                {loading && <div style={{ padding: 14 }}><Skeleton h={70} /></div>}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <div className="section-head"><h2 className="h2">Money</h2></div>
              {data && [['Earned in ' + data.money.month, data.money.earned], ['Held for active jobs', data.money.held], ['Ready to withdraw', data.money.ready]].map(([l, v]) => (
                <div className="lrow" key={l}><span className="t2">{l}</span><span className="numeric"><CountUp value={v} format={(n) => rupee(n)} /></span></div>
              ))}
              {data && <>
                <Button block onClick={() => nav('/earnings')} style={{ marginTop: 4 }}>Withdraw {rupee(data.money.ready)}</Button>
                <p className="caption t3" style={{ margin: '8px 0 0' }}>Otherwise it goes to {data.money.bank} on {data.money.payoutDate}.</p>
              </>}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div>
              <div className="section-head"><h2 className="h2">Your bids</h2><Link to="/bids" className="link">Open →</Link></div>
              {data && [['Waiting on brands', data.bidsSummary.waiting], ['Shortlisted', data.bidsSummary.shortlisted], ['Won in ' + data.bidsSummary.month, `${data.bidsSummary.won} of ${data.bidsSummary.of}`]].map(([l, v]) => (
                <div className="lrow" key={l}><span className="t2">{l}</span><span className="body-sm-m" style={{ fontSize: 14 }}>{v}</span></div>
              ))}
            </div>
          </Reveal>
        </aside>
      </div>
    </>
  )
}
