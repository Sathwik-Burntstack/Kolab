import { useState } from 'react'
import Dialog from '../components/Dialog'
import { Button, CountUp, Reveal, Skeleton, rupee } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../components/Toast'
import { api } from '../services/api'

const TONE = { brand: 'var(--brand-text)', signal: 'var(--signal-text)', muted: 'var(--text-secondary)', faint: 'var(--text-tertiary)' }
const TABS = [['all', 'All'], ['in', 'Money in'], ['out', 'Withdrawals']]
const fmt2 = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Slip({ slip }) {
  const fee = slip.price * 0.1, tds = slip.price * 0.01, net = slip.price - fee - tds
  return (
    <aside className="slip" key={slip.ref} aria-label="Payout slip">
      <div>
        <h2 className="h2">Payout slip</h2>
        <div className="body-sm t2">{slip.job}</div>
        <div className="mono t3">{slip.ref}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="ln"><span>Agreed price</span><span className="mono">{fmt2(slip.price)}</span></div>
        <div className="ln"><span>Kolab fee 10%</span><span className="mono">− {fmt2(fee)}</span></div>
        <div className="ln"><span>TDS 1%</span><span className="mono">− {fmt2(tds)}</span></div>
      </div>
      <hr className="dashed" />
      <div style={{ display: 'flex', alignItems: 'center' }}><span className="body-sm-m" style={{ flex: 1, fontSize: 14 }}>You get</span><span className="numeric">{rupee(Math.round(net))}</span></div>
      <div className="insts">
        {[slip.first, slip.last].map((p) => (
          <div key={p.label}>
            <div style={{ flex: 1 }}><div className="body-sm-m">{p.label}</div><div className="caption" style={{ color: TONE[p.tone] }}>{p.note}</div></div>
            <span className="body-sm-m">{rupee(p.amount)}</span>
          </div>
        ))}
      </div>
      <p className="caption t3" style={{ margin: 0 }}>Questions about a payout? Reply from the job’s chat and we’ll sort it out within a working day.</p>
    </aside>
  )
}

export default function Earnings() {
  const { data: e, loading, reload } = useAsync(() => api.getEarnings(), [])
  const [tab, setTab] = useState('all')
  const [sel, setSel] = useState('s1')
  const [ask, setAsk] = useState(false)
  const [done, setDone] = useState(null)
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  if (loading || !e) return <><Skeleton h={48} w={240} style={{ marginBottom: 28 }} /><Skeleton h={100} style={{ marginBottom: 36 }} /><Skeleton h={360} /></>
  const b = e.balances
  const rows = e.ledger.filter((r) => tab === 'all' || (tab === 'in' ? r.kind === 'in' || r.kind === 'held' : r.kind === 'out'))

  const withdraw = async () => {
    setBusy(true)
    try { const r = await api.withdraw(); setAsk(false); setDone(r); reload() } catch (err) { toast(err.message || 'Withdrawal failed', 'info') } finally { setBusy(false) }
  }
  const statement = async () => { await api.downloadStatement(); toast('Statement downloaded') }

  return (
    <>
      <div className="page-header">
        <div>
          <span className="body-sm t3">Paid to {e.bank} every Tuesday</span>
          <h1 className="display">Earnings</h1>
        </div>
        <Button onClick={statement}>Download statement</Button>
        <Button variant="primary" disabled={!b.ready} onClick={() => setAsk(true)}>Withdraw {rupee(b.ready)}</Button>
      </div>

      <Reveal className="balances">
        <div><span className="body-sm t2">Ready to withdraw</span><span className="bignum"><CountUp value={b.ready} format={rupee} /></span><span className="caption t3">{b.ready ? `Goes out ${e.payoutDay} if you don’t` : 'Nothing waiting right now'}</span></div>
        <div><span className="body-sm t2">Held for active jobs</span><span className="bignum"><CountUp value={b.held} format={rupee} /></span><span className="caption t3">{b.heldFor}</span></div>
        <div><span className="body-sm t2">Earned in October</span><span className="bignum"><CountUp value={b.earned} format={rupee} /></span><span className="caption" style={{ color: 'var(--brand-text)' }}>{b.delta}</span></div>
        <div><span className="body-sm t2">TDS this financial year</span><span className="bignum"><CountUp value={b.tds} format={rupee} /></span><span className="caption t3">Shows up in your Form 26AS</span></div>
      </Reveal>

      <div className="er-cols">
        <section className="ledger" aria-label="Activity">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', paddingBottom: 12 }}>
            <h2 className="h2" style={{ flex: 1, minWidth: 100 }}>Activity</h2>
            <div className="tabs" role="tablist">{TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>)}</div>
          </div>
          {rows.length === 0 && <p className="body-sm t2" style={{ padding: '24px 0', borderTop: '1px solid var(--border)' }}>Nothing here yet.</p>}
          {rows.map((r) => {
            const Tag = r.slip ? 'button' : 'div'
            return (
              <Tag key={r.id} className={`lrow2 ${r.slip ? 'click' : ''} ${r.slip && sel === r.slip ? 'sel' : ''}`} onClick={r.slip ? () => setSel(r.slip) : undefined}>
                <span className="d">{r.date}</span>
                <span className="m"><span className="body-sm-m">{r.title}</span><span className="caption t3">{r.sub}</span></span>
                <span className="st" style={{ color: TONE[r.tone] }}>{r.status}</span>
                <span className="am" style={{ color: r.kind === 'in' ? 'var(--brand-text)' : undefined }}>
                  {r.kind === 'in' ? '+ ' : r.amount < 0 ? '− ' : ''}{rupee(Math.abs(r.amount))}
                </span>
              </Tag>
            )
          })}
        </section>
        <Slip slip={e.slips[sel] || e.slips.s1} />
      </div>

      {ask && (
        <Dialog tone="brand" icon="wallet" title={`Withdraw ${rupee(b.ready)}?`} onClose={() => setAsk(false)}
          rows={[['To', e.bank], ['Arrives', 'Usually within 2 hours'], ['Fee', 'None']]}
          actions={<><Button onClick={() => setAsk(false)}>Cancel</Button><Button variant="primary" disabled={busy} onClick={withdraw}>{busy ? 'Sending…' : `Withdraw ${rupee(b.ready)}`}</Button></>}>
          The money goes straight to your bank account.
        </Dialog>
      )}
      {done && (
        <Dialog tone="success" icon="check" title={`${rupee(done.amount)} is on its way`} onClose={() => setDone(null)}
          actions={<Button variant="primary" onClick={() => setDone(null)}>Done</Button>}>
          It should reach {done.bank} within 2 hours. You’ll find it in your activity list.
        </Dialog>
      )}
    </>
  )
}
