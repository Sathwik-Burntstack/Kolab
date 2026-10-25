import { useState } from 'react'
import Modal from '../components/Modal'
import { Button, Chip } from '../components/ui'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

const ALL_TOPICS = ['Food', 'Cafés', 'Street food', 'Local business', 'Fitness meals', 'Fashion', 'Beauty', 'Tech', 'Travel']
const ALL_LANGS = ['Telugu', 'English', 'Hindi', 'Tamil', 'Kannada']

export default function EditProfile({ profile, onClose, onSaved }) {
  const [f, setF] = useState({ name: profile.name, headline: profile.headline, bio: profile.bio, languages: profile.languages, topics: profile.topics, rates: profile.rates.map(([l, v]) => [l, v]) })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState({})
  const toast = useToast()
  const flip = (k, v) => setF((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }))
  const save = async () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Your name can’t be empty.'
    if (f.bio.trim().length < 30) e.bio = 'Write at least a couple of sentences.'
    setErr(e)
    if (Object.keys(e).length) return
    setBusy(true)
    try { await api.updateProfile({ ...f, initials: f.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() }); toast('Profile saved'); onSaved(); onClose() } catch (x) { toast(x.message || 'Could not save', 'info') } finally { setBusy(false) }
  }
  return (
    <Modal drawer wide title="Edit profile" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 80 }}>
        <div className="field"><label htmlFor="ep-name">Name</label><input id="ep-name" className={`input ${err.name ? 'err' : ''}`} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />{err.name && <span className="err-msg">{err.name}</span>}</div>
        <div className="field"><label htmlFor="ep-head">One-line intro</label><input id="ep-head" className="input" value={f.headline} onChange={(e) => setF({ ...f, headline: e.target.value })} /></div>
        <div className="field"><label htmlFor="ep-bio">About you</label><textarea id="ep-bio" className={`textarea ${err.bio ? 'err' : ''}`} style={{ minHeight: 130 }} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />{err.bio && <span className="err-msg">{err.bio}</span>}</div>
        <div className="field"><label>Languages</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{ALL_LANGS.map((l) => <Chip key={l} on={f.languages.includes(l)} onClick={() => flip('languages', l)}>{l}</Chip>)}</div></div>
        <div className="field"><label>Topics</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{ALL_TOPICS.map((t) => <Chip key={t} on={f.topics.includes(t)} onClick={() => flip('topics', t)}>{t}</Chip>)}</div></div>
        <div className="field"><label>Starting prices</label>
          {f.rates.map(([l, v], i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="body-sm t2" style={{ flex: 1 }}>{l}</span>
              <div className="prefix" style={{ width: 130 }}><span>₹</span><input className="input" inputMode="numeric" value={Number(v).toLocaleString('en-IN')} onChange={(e) => setF((s) => ({ ...s, rates: s.rates.map((r, k) => (k === i ? [r[0], Number(e.target.value.replace(/\D/g, '')) || 0] : r)) }))} /></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'sticky', bottom: -20, margin: '0 -20px -20px', padding: '14px 20px', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save profile'}</Button>
      </div>
    </Modal>
  )
}
