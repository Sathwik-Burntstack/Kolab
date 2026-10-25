import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

const ITEMS = [['/earnings', 'wallet', 'Earnings', 'Balances, payouts and statements'], ['/messages', 'message', 'Messages', 'Chats with brands'], ['/profile', 'user', 'Profile', 'What brands see when you bid'], ['/help', 'help', 'Help', 'Answers and support']]

export default function More() {
  return (
    <>
      <div className="page-header"><div><h1 className="display">More</h1></div></div>
      <div className="rows">
        {ITEMS.map(([to, ic, t, s]) => (
          <Link to={to} key={to} className="bidrow" style={{ gap: 14 }}>
            <Icon name={ic} size={20} />
            <span className="bidrow__main"><span className="body-sm-m" style={{ fontSize: 14 }}>{t}</span><span className="caption t3">{s}</span></span>
            <Icon name="chevronRight" size={16} style={{ color: 'var(--text-tertiary)' }} />
          </Link>
        ))}
        <button className="bidrow" style={{ gap: 14, width: '100%', textAlign: 'left' }} onClick={() => window.dispatchEvent(new Event('kolab:notifications'))}>
          <Icon name="bell" size={20} />
          <span className="bidrow__main"><span className="body-sm-m" style={{ fontSize: 14 }}>Notifications</span><span className="caption t3">Bids, drafts and payments</span></span>
          <Icon name="chevronRight" size={16} style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>
    </>
  )
}
