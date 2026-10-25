import { useState } from 'react'
import Icon from '../components/Icon'
import EditProfile from '../overlays/EditProfile'
import { Badge, Button, Chip, Reveal, Skeleton, Toggle, rupee } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

const VIS = [['followers', 'Follower counts', 'Anyone with the link'], ['audience', 'Audience breakdown', 'Only brands you’re working with'], ['rates', 'Rates', 'Anyone with the link']]

export default function Profile() {
  const { data: p, loading, reload } = useAsync(() => api.getProfile(), [])
  const [edit, setEdit] = useState(false)
  const toast = useToast()
  if (loading || !p) return <><Skeleton h={48} w={200} style={{ marginBottom: 28 }} /><div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}><div style={{ flex: 1, minWidth: 280 }}><Skeleton h={500} /></div><div style={{ width: 300, maxWidth: '100%' }}><Skeleton h={500} /></div></div></>

  const copy = async () => {
    try { await navigator.clipboard.writeText(p.mediaKit) } catch { /* clipboard may be blocked; still confirm */ }
    toast('Link copied')
  }
  const setVis = async (k, v) => { await api.updateProfile({ visibility: { ...p.visibility, [k]: v } }); reload() }

  return (
    <>
      <div className="page-header">
        <div><span className="body-sm t3">Brands see this page when you bid</span><h1 className="display">Profile</h1></div>
        <Button icon="link" onClick={copy}>Copy media kit link</Button>
        <Button variant="primary" onClick={() => setEdit(true)}>Edit profile</Button>
      </div>

      <div className="pf-cols">
        <div className="pf-main">
          <Reveal style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span className="avatar-lg">{p.initials}</span>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><h2 className="h1">{p.name}</h2>{p.verified && <Badge tone="success">ID verified</Badge>}</div>
              <span className="t2">{p.headline} · {p.languages.join(', ')}</span>
            </div>
          </Reveal>
          <Reveal><p style={{ margin: 0 }}>{p.bio}</p></Reveal>

          <Reveal>
            <div className="sec-h"><h2 className="h2">Audience</h2><span className="body-sm t3">Pulled from Instagram and YouTube · synced {p.synced}</span></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="atable">
                <thead><tr><th>Account</th><th>Followers</th><th>Avg. views</th><th>Engagement</th><th>Lives in AP / TS</th></tr></thead>
                <tbody>{p.accounts.map((a) => (
                  <tr key={a.name}><td><span><Icon name={a.platform} size={16} />{a.name}</span></td><td>{a.followers}</td><td>{a.views}</td><td>{a.engagement}</td><td>{a.local}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <div className="sec-h"><h2 className="h2">Recent work</h2><span className="body-sm t3">Pinned by you</span></div>
            <div className="work">
              {p.work.map((w) => (
                <figure key={w.id}>
                  <div className="thumb" style={{ backgroundImage: `linear-gradient(180deg, ${w.from}, #17171c)` }}><span><Icon name="eye" size={13} />{w.views}</span></div>
                  <figcaption><div className="body-sm-m">{w.title}</div><div className="caption t3">{w.brand}</div></figcaption>
                </figure>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="sec-h"><h2 className="h2">What brands said</h2><span className="body-sm t3">{p.reviews.avg} average from {p.reviews.jobs} jobs</span></div>
            {p.reviews.items.map((r) => <div className="review" key={r.by}><p style={{ margin: 0 }}>“{r.text}”</p><span className="caption t3">{r.by}</span></div>)}
          </Reveal>
        </div>

        <aside className="pf-side">
          <Reveal><div className="sec-h"><h2 className="h2">Rates</h2><span className="body-sm t3">Starting price</span></div>{p.rates.map(([l, v]) => <div className="kv" key={l}><span>{l}</span><b>{rupee(v)}</b></div>)}</Reveal>
          <Reveal delay={60}><div className="sec-h"><h2 className="h2">Track record</h2></div>{p.track.map(([l, v]) => <div className="kv" key={l}><span>{l}</span><b>{v}</b></div>)}</Reveal>
          <Reveal delay={120}><div className="sec-h"><h2 className="h2">Topics</h2></div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{p.topics.map((t) => <Chip key={t}>{t}</Chip>)}</div></Reveal>
          <Reveal delay={180} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="sec-h"><h2 className="h2">Who sees what</h2></div>
            {VIS.map(([k, l, s]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}><div className="body-sm-m">{l}</div><div className="caption t3">{s}</div></div>
                <Toggle checked={!!p.visibility[k]} onChange={(v) => setVis(k, v)} label="" />
              </div>
            ))}
          </Reveal>
        </aside>
      </div>
      {edit && <EditProfile profile={p} onClose={() => setEdit(false)} onSaved={reload} />}
    </>
  )
}
