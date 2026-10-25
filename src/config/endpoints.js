/**
 * ALL backend URLs live here. Change a path once and the whole app follows.
 * Each entry shows the HTTP method the frontend uses and what it expects back.
 * (Full request/response shapes are documented in README.md → "Connecting your backend".)
 */
export const ENDPOINTS = {
  // Home
  home:            { method: 'GET',    path: '/creator/home' },                 // { needsYou[], money{}, bidsSummary{}, featured[] }
  user:            { method: 'GET',    path: '/creator/me' },                   // { name, handle, initials, counts{bids,activeJobs,messages} }

  // Jobs
  jobs:            { method: 'GET',    path: '/jobs' },                         // ?sort=&platform=&city=&q=&page=  -> { items[], total }
  job:             (id) => ({ method: 'GET',  path: `/jobs/${id}` }),            // job details
  saveJob:         (id) => ({ method: 'POST', path: `/jobs/${id}/save` }),       // toggle bookmark
  placeBid:        (id) => ({ method: 'POST', path: `/jobs/${id}/bids` }),       // { amount, why, expectedViews, deliveryDate, links[] }

  // Bids
  bids:            { method: 'GET',    path: '/bids' },                         // ?status=  -> { items[] }
  withdrawBid:     (id) => ({ method: 'POST', path: `/bids/${id}/withdraw` }),
  updateBid:       (id) => ({ method: 'PATCH', path: `/bids/${id}` }),

  // Active jobs & agreement
  activeJobs:      { method: 'GET',    path: '/active-jobs' },
  activeJob:       (id) => ({ method: 'GET',  path: `/active-jobs/${id}` }),
  submitDraft:     (id) => ({ method: 'POST', path: `/active-jobs/${id}/draft` }),      // multipart: file / link
  submitPostLink:  (id) => ({ method: 'POST', path: `/active-jobs/${id}/post-link` }),
  agreement:       (id) => ({ method: 'GET',  path: `/agreements/${id}` }),
  acceptAgreement: (id) => ({ method: 'POST', path: `/agreements/${id}/accept` }),
  declineAgreement:(id) => ({ method: 'POST', path: `/agreements/${id}/decline` }),    // { reason }

  // Money
  earnings:        { method: 'GET',    path: '/earnings' },
  withdraw:        { method: 'POST',   path: '/earnings/withdraw' },
  statement:       { method: 'GET',    path: '/earnings/statement' },          // returns file / url

  // Messages
  threads:         { method: 'GET',    path: '/messages' },
  thread:          (id) => ({ method: 'GET',  path: `/messages/${id}` }),
  sendMessage:     (id) => ({ method: 'POST', path: `/messages/${id}` }),

  // Profile & notifications
  profile:         { method: 'GET',    path: '/creator/profile' },
  updateProfile:   { method: 'PATCH',  path: '/creator/profile' },
  notifications:   { method: 'GET',    path: '/notifications' },
  markAllRead:     { method: 'POST',   path: '/notifications/read-all' },

  // Auth (used only if you add a login screen)
  login:           { method: 'POST',   path: '/auth/login' },
}
