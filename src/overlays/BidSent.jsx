import { useNavigate } from 'react-router-dom'
import Dialog from '../components/Dialog'
import { Button, rupee } from '../components/ui'

export default function BidSent({ bid, job, onClose }) {
  const nav = useNavigate()
  return (
    <Dialog tone="success" icon="check" title="Bid sent" onClose={onClose}
      rows={[['Job', job.title], ['Your bid', rupee(bid.amount)], ['Closes', job.closesFull]]}
      actions={<><Button onClick={() => { onClose(); nav('/jobs') }}>Keep browsing</Button><Button variant="primary" onClick={() => { onClose(); nav('/bids') }}>View my bids</Button></>}>
      {job.brand} will see your bid when bidding closes. You can edit or withdraw it until then.
    </Dialog>
  )
}
