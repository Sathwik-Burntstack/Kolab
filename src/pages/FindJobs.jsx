import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import { BudgetRange, Button, Checkbox, Dropdown, EmptyState, Reveal, SearchBox, Skeleton, Toggle, range } from '../components/ui'
import { useToast } from '../components/Toast'
import { useIsMobile } from '../hooks/useMedia'
import { api } from '../services/api'

const DEFAULTS = {
  city: ['Vijayawada', 'Guntur'],
  platform: ['Instagram Reel', 'Instagram Story', 'YouTube Short'],
  category: ['Food and cafés'],
  minBudget: 3000,
  usualOnly: false,
}
const CITIES = ['Vijayawada', 'Guntur', 'Hyderabad', 'Visakhapatnam']
const PLATFORMS = ['Instagram Reel', 'Instagram Story', 'YouTube Short', 'YouTube Video']
const CATEGORIES = ['Food and cafés', 'Fitness', 'Fashion', 'Beauty', 'Electronics']
const SORTS = [['closing', 'Closing soonest'], ['highest', 'Highest pay'], ['newest', 'Newest']]

function Filters({ f, set, facets, onClear }) {
  const toggle = (key, val) => (on) => set({ [key]: on ? [...f[key], val] : f[key].filter((x) => x !== val) })
  const group = (title, key, items) => (
    <div className="fgroup">
      <span className="overline">{title}</span>
      {items.map((it) => <Checkbox key={it} label={it} count={facets?.[key]?.[it]} checked={f[key].includes(it)} onChange={toggle(key, it)} />)}
    </div>
  )
  return (
    <>
      {group('City', 'city', CITIES)}
      {group('Platform', 'platform', PLATFORMS)}
      {group('Category', 'category', CATEGORIES)}
      <div className="fgroup">
        <span className="overline">Budget at least</span>
        <label className="money-input">
          <span className="body-sm" style={{ marginRight: 2 }}>₹</span>
          <input inputMode="numeric" value={f.minBudget ? f.minBudget.toLocaleString('en-IN') : ''} placeholder="0"
            onChange={(e) => set({ minBudget: Number(e.target.value.replace(/\D/g, '')) || 0 })} aria-label="Minimum budget" />
        </label>
        <Toggle label="Only jobs that pay my usual rate" checked={f.usualOnly} onChange={(v) => set({ usualOnly: v })} />
      </div>
      <button className="link" style={{ textAlign: 'left' }} onClick={onClear}>Clear filters</button>
    </>
  )
}

export default function FindJobs() {
  const [f, setF] = useState(DEFAULTS)
  const [q, setQ] = useState('')
  const [dq, setDq] = useState('')
  const [sort, setSort] = useState('closing')
  const [limit, setLimit] = useState(6)
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sheet, setSheet] = useState(false)
  const toast = useToast()
  const nav = useNavigate()
  const mobile = useIsMobile()
  const set = (patch) => { setF((s) => ({ ...s, ...patch })); setLimit(6) }

  useEffect(() => { const t = setTimeout(() => setDq(q), 250); return () => clearTimeout(t) }, [q])
  const key = useMemo(() => JSON.stringify([f, dq, sort, limit]), [f, dq, sort, limit])
  useEffect(() => {
    let live = true
    setLoading(true)
    api.getJobs({ ...f, q: dq, sort, limit }).then((r) => { if (live) { setRes(r); setLoading(false) } })
    return () => { live = false }
  }, [key])

  const clear = () => { setF({ city: [], platform: [], category: [], minBudget: 0, usualOnly: false }); setQ(''); setLimit(6); toast('Filters cleared') }
  const more = () => { setLimit((l) => l + 20); toast('More jobs') }
  const items = res?.items || []

  return (
    <>
      <div className="fj-head">
        <div className="titles">
          <span className="body-sm t3">Andhra Pradesh and Telangana</span>
          <h1 className="display">Find jobs</h1>
        </div>
        <div className="tools" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <SearchBox value={q} onChange={setQ} />
          <Button className="filter-btn" icon="filter" onClick={() => setSheet(true)}>Filters</Button>
          <Dropdown value={sort} onChange={setSort} options={SORTS} />
        </div>
      </div>

      <div className="fj-cols">
        <aside className="filters desktop" aria-label="Filters">
          <Filters f={f} set={set} facets={res?.facets} onClear={clear} />
        </aside>

        <section className="results" aria-live="polite">
          <p className="body-sm t2" style={{ margin: '0 0 4px' }}>{loading && !res ? 'Finding jobs…' : `${res?.total ?? 0} jobs match your filters`}</p>
          {loading && !res && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={96} style={{ margin: '12px 0' }} />)}
          {res && items.length === 0 && <EmptyState title="No jobs match these filters" body="Try removing a city or platform." action={<Button onClick={clear}>Clear filters</Button>} />}
          <div style={{ opacity: loading && res ? 0.55 : 1, transition: 'opacity .2s' }}>
            {items.map((j, i) => (
              <Reveal key={j.id} delay={Math.min(i, 5) * 40}>
                <div className="jobrow" role="link" tabIndex={0} onClick={() => nav(`/jobs/${j.id}`)} onKeyDown={(e) => e.key === 'Enter' && nav(`/jobs/${j.id}`)}>
                  <span className="logo" style={{ background: j.logo }}>{j.initials}</span>
                  <div className="jobrow__main">
                    <span className="caption t3">{j.brand} · {j.city} · {j.posted}</span>
                    <h3 className="h3">{j.title}</h3>
                    <p className="body-sm t2" style={{ margin: 0 }}>{j.desc}</p>
                    <span className="jobrow__plat"><Icon name={j.platform.includes('YouTube') ? 'youtube' : 'instagram'} size={14} />{j.platform} · {j.length} · min. {(j.minViews / 1000).toLocaleString('en-IN')}k views</span>
                  </div>
                  <div className="jobrow__budget">
                    <span className="numeric">{range(j.min, j.max)}</span>
                    <BudgetRange min={j.min} max={j.max} usual={j.usual} />
                  </div>
                  <div className="jobrow__action">
                    <span className="body-sm-m" style={{ color: j.urgent ? 'var(--signal-text)' : undefined }}>Closes {j.closesFull}</span>
                    <span className="caption t3">{j.bids} bids so far</span>
                    <span style={{ height: 8 }} />
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); nav(`/jobs/${j.id}`) }}>View job</Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {res && res.total > items.length && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
              <Button onClick={more}>Show {Math.min(20, res.total - items.length)} more</Button>
            </div>
          )}
        </section>
      </div>

      {sheet && mobile && (
        <Modal title="Filters" onClose={() => setSheet(false)} footer={<><Button onClick={clear}>Clear filters</Button><Button variant="primary" onClick={() => setSheet(false)}>Show {res?.total ?? ''} jobs</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}><Filters f={f} set={set} facets={res?.facets} onClear={clear} /></div>
        </Modal>
      )}
    </>
  )
}
