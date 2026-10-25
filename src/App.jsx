import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import { ToastProvider } from './components/Toast'
import Home from './pages/Home'
import Stub from './pages/Stub'
import FindJobs from './pages/FindJobs'
import JobDetails from './pages/JobDetails'
import MyBids from './pages/MyBids'
import ActiveJob, { ActiveList } from './pages/ActiveJob'
import Earnings from './pages/Earnings'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Agreement from './pages/Agreement'
import More from './pages/More'
import Help from './pages/Help'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="jobs" element={<FindJobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="bids" element={<MyBids />} />
          <Route path="active" element={<ActiveList />} />
          <Route path="active/:id" element={<ActiveJob />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="agreement/:id" element={<Agreement />} />
          <Route path="more" element={<More />} />
          <Route path="help" element={<Help />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:id" element={<Messages />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
