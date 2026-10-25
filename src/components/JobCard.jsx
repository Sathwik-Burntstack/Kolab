import { Link } from 'react-router-dom'
import Icon from './Icon'
import { BudgetRange, Button, PlatformPill, range } from './ui'

export default function JobCard({ job, onSave }) {
  return (
    <article className="jobcard">
      <div className="jobcard__band" style={{ backgroundImage: `linear-gradient(167deg, ${job.grad[0]} 14%, ${job.grad[1]} 86%)` }}>
        <div className="jobcard__row">
          <PlatformPill platform={job.platform} />
          <span style={{ flex: 1 }} />
          {job.urgent
            ? <span className="urgent"><Icon name="clock" size={12} />Closes {job.closes}</span>
            : <span className="caption" style={{ color: 'rgba(255,255,255,.8)' }}>Closes {job.closes}</span>}
        </div>
        <div>
          <div className="jobcard__brand">{job.brand}</div>
          <div className="jobcard__meta">{job.city} · {job.posted}</div>
        </div>
      </div>
      <div className="jobcard__body">
        <h3 className="h3">{job.title}</h3>
        <div className="body-sm t2">{job.length} · min. {(job.minViews / 1000).toLocaleString('en-IN')}k views</div>
        <div style={{ height: 8 }} />
        <div className="numeric">{range(job.min, job.max)}</div>
        <BudgetRange min={job.min} max={job.max} usual={job.usual} />
      </div>
      <div className="jobcard__foot">
        <span className="caption t3" style={{ flex: 1 }}>{job.bids} bids so far</span>
        <button className={`bookmark ${job.saved ? 'on' : ''}`} onClick={() => onSave?.(job)} aria-label={job.saved ? 'Remove bookmark' : 'Save job'} aria-pressed={!!job.saved}>
          <Icon name="bookmark" />
        </button>
        <Link to={`/jobs/${job.id}`}><Button size="sm" tabIndex={-1}>View job</Button></Link>
      </div>
    </article>
  )
}
