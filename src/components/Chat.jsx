import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useToast } from './Toast'
import { api } from '../services/api'

// Phone numbers and e-mail addresses are hidden in chat (Figma note under the messages).
const MASK = (t) => t
  .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '••••••')
  .replace(/(\+?\d[\d\s().-]{7,}\d)/g, '••••••')

export default function Chat({ threadId, contact, initial = [], logo, initials, className = '' }) {
  const [msgs, setMsgs] = useState(initial)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [masked, setMasked] = useState(false)
  const end = useRef(null)
  const file = useRef(null)
  const toast = useToast()
  useEffect(() => { setMsgs(initial) }, [threadId]) // eslint-disable-line
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs, typing])

  const send = async () => {
    const raw = text.trim()
    if (!raw) return
    const clean = MASK(raw)
    setMasked(clean !== raw)
    setText('')
    const m = await api.sendMessage(threadId, clean)
    setMsgs((s) => [...s, m])
    toast('Message sent')
    setTyping(true); setTimeout(() => setTyping(false), 1600)
  }
  const attach = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setMsgs((s) => [...s, { id: Date.now(), from: 'me', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }), text: `📎 ${f.name}` }])
    toast('File attached'); e.target.value = ''
  }

  return (
    <section className={`chat ${className}`} aria-label={`Chat with ${contact.name}`}>
      <header className="chat__head">
        <span className="logo sm" style={{ background: logo }}>{initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="body-sm-m">{contact.name}</div>
          <div className="caption t3">{contact.note}</div>
        </div>
        <Icon name="more" style={{ color: 'var(--text-secondary)' }} />
      </header>
      <div className="chat__msgs" role="log" aria-live="polite">
        {msgs.map((m) => (
          <div key={m.id} style={{ display: 'contents' }}>
            {m.day && <div className="chat__day caption t3">{m.day}</div>}
            <div className={`msg ${m.from === 'me' ? 'me' : ''}`}>
              <div className="bub">{m.text}</div>
              <span className="caption t3">{m.from === 'me' ? m.time : `${contact.first} · ${m.time}`}</span>
            </div>
          </div>
        ))}
        {typing && <div className="typing" aria-label="typing"><i /><i /><i /></div>}
        <div ref={end} />
      </div>
      <div className="chat__note caption t3">{masked ? 'We hid a phone number or email in your message.' : 'Phone numbers and email addresses are hidden in chat.'}</div>
      <div className="composer">
        <button className="iconbtn" onClick={() => file.current?.click()} aria-label="Attach a file"><Icon name="paperclip" /></button>
        <input ref={file} type="file" hidden onChange={attach} />
        <input className="txt" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={`Message ${contact.first}`} aria-label="Message" />
        <button className="sendbtn" onClick={send} disabled={!text.trim()} aria-label="Send message"><Icon name="send" size={16} /></button>
      </div>
    </section>
  )
}
