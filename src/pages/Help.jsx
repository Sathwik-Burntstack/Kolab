import { useState } from 'react'
import Icon from '../components/Icon'
import { Button } from '../components/ui'
import { useToast } from '../components/Toast'

const FAQ = [
  ['When do I get paid?', 'You receive 70% when the brand approves your post and the remaining 30% after a 7-day view check, if your views meet the minimum in the agreement. Money goes to your bank every Tuesday unless you withdraw earlier.'],
  ['What is the Kolab fee and TDS?', 'Kolab keeps 10% of the agreed price. 1% TDS is withheld and shows up in your Form 26AS.'],
  ['How many rounds of changes can a brand ask for?', 'Each agreement lists the number of rounds (usually one or two). You can see it on the Active job page.'],
  ['Why are phone numbers hidden in chat?', 'Keeping chats on Kolab protects your payment. Numbers and emails are replaced automatically.'],
  ['What if a brand cancels?', 'It depends on the stage. After you have shot the content you keep 50% of the price, as written in the agreement.'],
]

export default function Help() {
  const [open, setOpen] = useState(0)
  const [msg, setMsg] = useState('')
  const toast = useToast()
  return (
    <>
      <div className="page-header"><div><span className="body-sm t3">We reply within a working day</span><h1 className="display">Help</h1></div></div>
      <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <section style={{ flex: 1, minWidth: 280 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>Common questions</h2>
          {FAQ.map(([q, a], i) => (
            <div key={q} style={{ borderTop: '1px solid var(--border)' }}>
              <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', textAlign: 'left' }} aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="body-sm-m" style={{ flex: 1, fontSize: 14 }}>{q}</span>
                <Icon name="chevronDown" size={16} style={{ transition: 'transform .2s', transform: open === i ? 'rotate(180deg)' : 'none' }} />
              </button>
              {open === i && <p className="body-sm t2" style={{ margin: '0 0 14px', animation: 'fadeIn .25s both' }}>{a}</p>}
            </div>
          ))}
        </section>
        <aside className="bidpanel" style={{ width: 360 }}>
          <h2 className="h2">Ask us something</h2>
          <textarea className="textarea" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tell us what happened and which job it is about." />
          <Button variant="primary" block disabled={msg.trim().length < 10} onClick={() => { setMsg(''); toast('Message sent') }}>Send to support</Button>
        </aside>
      </div>
    </>
  )
}
