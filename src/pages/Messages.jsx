import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { EditBid } from './MyBids'
import { Button, SearchBox, Skeleton } from '../components/ui'
import { useToast } from '../components/Toast'
import { useIsMobile } from '../hooks/useMedia'
import { api } from '../services/api'

const MASK = (t) => t.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '••••••').replace(/(\+?\d[\d\s().-]{7,}\d)/g, '••••••')
const now = () => new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })

export default function Messages() {
  const { id } = useParams()
  const nav = useNavigate()
  const mobile = useIsMobile()
  const toast = useToast()
  const [threads, setThreads] = useState(null)
  const [q, setQ] = useState('')
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [editBid, setEditBid] = useState(null)
  const [hint, setHint] = useState(false)
  const end = useRef(null)
  const file = useRef(null)

  useEffect(() => { api.getThreads().then(setThreads) }, [])
  const activeId = id || (!mobile && threads?.[0]?.id) || null
  const t = threads?.find((x) => x.id === activeId)
  useEffect(() => { if (t?.unread) { api.markThreadRead(t.id); setThreads((s) => s.map((x) => (x.id === t.id ? { ...x, unread: false } : x))) } }, [t?.id]) // eslint-disable-line
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [t?.messages?.length, typing, activeId])

  const list = (threads || []).filter((x) => (x.brand + x.last).toLowerCase().includes(q.toLowerCase()))
  const push = (m) => setThreads((s) => s.map((x) => (x.id === activeId ? { ...x, messages: [...x.messages, m], last: m.text, time: 'now' } : x)))

  const send = async () => {
    const raw = text.trim()
    if (!raw || !t) return
    const clean = MASK(raw)
    setHint(clean !== raw); setText('')
    const m = await api.sendMessage(t.id, clean)
    push({ ...m, time: now() })
    toast('Message sent')
    setTyping(true); setTimeout(() => setTyping(false), 1500)
  }
  const attach = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    push({ id: Date.now(), from: 'me', time: now(), text: `📎 ${f.name}` }); toast('File attached'); e.target.value = ''
  }
  const updateBid = async () => {
    const { items } = await api.getBids()
    const b = items.find((x) => x.jobId === t.bid.jobId)
    if (b) setEditBid(b); else nav('/bids')
  }

  return (
    <div className={`inbox ${activeId && (mobile ? id : true) ? 'chat-open' : ''}`}>
      <aside className="threads" aria-label="Conversations">
        <div className="threads__head">
          <h1 className="h1">Messages</h1>
          <SearchBox value={q} onChange={setQ} placeholder="Search messages" />
        </div>
        {!threads && [1, 2, 3, 4].map((i) => <div key={i} style={{ padding: '14px 24px' }}><Skeleton h={44} /></div>)}
        {list.map((x) => (
          <button key={x.id} className={`thread ${x.id === activeId ? 'on' : ''} ${x.unread ? 'unread' : ''}`} onClick={() => nav(`/messages/${x.id}`)}>
            <span className="logo sm" style={{ background: x.logo }}>{x.initials}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="nm"><b>{x.brand}</b><span className="caption t3">{x.time}</span></span>
              <span className="pv" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: x.unread ? 'normal' : 'nowrap' }}>{x.last}</span>
            </span>
            {x.unread && <span className="ud" aria-label="Unread" />}
          </button>
        ))}
        {threads && !list.length && <p className="body-sm t2" style={{ padding: '16px 24px' }}>No conversations match “{q}”.</p>}
      </aside>

      <section className="convo" aria-label="Conversation">
        {!t ? <div style={{ margin: 'auto', textAlign: 'center' }} className="t2">Choose a conversation</div> : (
          <>
            <header className="convo__head">
              <button className="iconbtn back-mobile" onClick={() => nav('/messages')} aria-label="Back to messages"><Icon name="arrowLeft" /></button>
              <span className="logo" style={{ background: t.logo, width: 40, height: 40, borderRadius: 8 }}>{t.initials}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="h3" style={{ fontSize: 15 }}>{t.contact.name}</div>
                <div className="body-sm t2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.contact.sub}</div>
              </div>
              {t.bid && <Button size="sm" onClick={() => nav('/bids')}>View bid</Button>}
            </header>
            <div className="convo__msgs" role="log" aria-live="polite">
              {t.bid && (
                <div className="bidcard">
                  <Icon name={t.bid.platform} size={16} />
                  <div><div className="body-sm-m">{t.bid.text}</div><div className="caption t3">{t.bid.sub}</div></div>
                </div>
              )}
              {t.messages.map((m) => (
                <div key={m.id} style={{ display: 'contents' }}>
                  {m.day && <div className="chat__day caption t3" style={{ textAlign: 'center' }}>{m.day}</div>}
                  <div className={`msg ${m.from === 'me' ? 'me' : ''}`}>
                    <div className="bub">{m.text}</div>
                    <span className="caption t3">{m.from === 'me' ? m.time : `${t.contact.first} · ${m.time}`}</span>
                  </div>
                </div>
              ))}
              {typing && <div className="typing"><i /><i /><i /></div>}
              <div ref={end} />
            </div>
            <div className="convo__note caption t3">{hint ? 'We hid a phone number or email in your message.' : 'Phone numbers and email addresses are hidden in chat.'}</div>
            <div className="convo__foot">
              <button className="iconbtn" onClick={() => file.current?.click()} aria-label="Attach a file"><Icon name="paperclip" /></button>
              <input ref={file} type="file" hidden onChange={attach} />
              <input className="input" style={{ flex: 1, minWidth: 140 }} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={`Message ${t.contact.first}`} aria-label="Message" />
              {t.bid && t.id !== 'cafe-mocha' && <Button className="upd" onClick={updateBid}>Update bid</Button>}
              <Button variant="primary" disabled={!text.trim()} onClick={send}>Send</Button>
            </div>
          </>
        )}
      </section>
      {editBid && <EditBid bid={editBid} onClose={() => setEditBid(null)} onSaved={() => toast('Bid updated')} />}
    </div>
  )
}
