/**
 * The ONLY file pages talk to for data.
 * - VITE_USE_MOCK=true  -> returns sample data from src/data/mock.js
 * - VITE_USE_MOCK=false -> calls your backend using src/config/endpoints.js
 * To plug in your backend, you normally just change .env and endpoints.js.
 */
import { USE_MOCK } from '../config/env'
import { ENDPOINTS as E } from '../config/endpoints'
import { http } from './http'
import * as mock from '../data/mock'

const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms))
const clone = (x) => JSON.parse(JSON.stringify(x))
const real = (ep, opts) => http(typeof ep === 'function' ? ep() : ep, opts)

// in-memory store so mock actions (save job, withdraw...) feel real during a session
export const store = { jobs: clone(mock.jobs), notifications: clone(mock.notifications), bids: clone(mock.bids), active: clone(mock.activeJobs), earnings: clone(mock.earnings), profile: clone(mock.profile), threads: clone(mock.threads) }

export const api = {
  getMe: async () => (USE_MOCK ? (await wait(150), clone(mock.me)) : real(E.user)),

  getHome: async () => {
    if (!USE_MOCK) return real(E.home)
    await wait(500)
    return { ...clone(mock.home), featured: clone(store.jobs.slice(0, 6)) }
  },

  /**
   * params: { q, sort, city[], platform[], category[], minBudget, usualOnly, limit }
   * Real backend should return { items, total, facets } (facets = counts per filter option).
   */
  getJobs: async (params = {}) => {
    if (!USE_MOCK) {
      const query = { ...params }
      ;['city', 'platform', 'category'].forEach((k) => { if (Array.isArray(query[k])) query[k] = query[k].join(',') })
      return real(E.jobs, { query })
    }
    await wait(450)
    const { q, sort, city = [], platform = [], category = [], minBudget = 0, usualOnly = false, limit = 6 } = params
    let items = clone(store.jobs)
    if (q) items = items.filter((j) => (j.brand + j.title + j.city + j.desc).toLowerCase().includes(q.toLowerCase()))
    if (city.length) items = items.filter((j) => city.includes(j.city))
    if (platform.length) items = items.filter((j) => platform.includes(j.platform))
    if (category.length) items = items.filter((j) => category.includes(j.category))
    if (minBudget) items = items.filter((j) => j.max >= minBudget)
    if (usualOnly) items = items.filter((j) => j.max >= j.usual)
    const order = (j) => new Date(j.closesFull + ' 2026').getTime()
    if (sort === 'highest') items.sort((a, b) => b.max - a.max)
    else if (sort === 'newest') items.reverse()
    else items.sort((a, b) => order(a) - order(b))
    return { items: items.slice(0, limit), total: items.length, facets: mock.facets }
  },

  getJob: async (id) => {
    if (!USE_MOCK) return http(E.job(id))
    await wait(400)
    const j = store.jobs.find((x) => x.id === id)
    if (!j) throw new Error('Job not found')
    return clone(mock.jobDetail(j))
  },

  /** payload: { amount, why, expectedViews, postDate, links[] } */
  placeBid: async (id, payload) => {
    if (!USE_MOCK) return http(E.placeBid(id), { body: payload })
    await wait(700)
    const j = store.jobs.find((x) => x.id === id)
    const bid = { id: 'b-' + Date.now(), jobId: id, brand: j?.brand, initials: j?.initials, logo: j?.logo, title: j?.title, platform: j?.platform, status: 'sent', statusText: `Closes ${j?.closesFull}`, ...payload }
    store.bids.unshift(bid)
    if (j) j.bids += 1
    return bid
  },

  getBids: async () => {
    if (!USE_MOCK) return real(E.bids)
    await wait(400)
    return { items: clone(store.bids), summary: { ...mock.bidSummary, total: mock.bidSummary.total + Math.max(0, store.bids.length - mock.bids.length) } }
  },
  /** payload: { amount, why } */
  updateBid: async (id, payload) => {
    if (!USE_MOCK) return http(E.updateBid(id), { body: payload })
    await wait(500)
    const b = store.bids.find((x) => x.id === id)
    if (b) Object.assign(b, payload)
    return b
  },
  withdrawBid: async (id) => {
    if (!USE_MOCK) return http(E.withdrawBid(id))
    await wait(500)
    const b = store.bids.find((x) => x.id === id)
    if (b) { b.status = 'withdrawn'; b.statusText = 'You withdrew just now' }
    return b
  },

  getActiveJobs: async () => (USE_MOCK ? (await wait(350), clone(store.active)) : real(E.activeJobs)),
  getActiveJob: async (id) => {
    if (!USE_MOCK) return http(E.activeJob(id))
    await wait(400)
    const j = store.active.find((x) => x.id === id)
    if (!j) throw new Error('Active job not found')
    return clone(j)
  },
  /** FormData-friendly: { file?: File, note?: string } */
  submitDraft: async (id, { file, note }) => {
    if (!USE_MOCK) {
      const fd = new FormData()
      if (file) fd.append('file', file)
      if (note) fd.append('note', note)
      return http(E.submitDraft(id), { formData: fd })
    }
    await wait(900)
    const j = store.active.find((x) => x.id === id)
    if (j) { j.stage = 'review'; j.roundsLeft = j.roundsLeft }
    return { ok: true }
  },
  sendMessage: async (id, text) => {
    if (!USE_MOCK) return http(E.sendMessage(id), { body: { text } })
    await wait(250)
    return { id: Date.now(), from: 'me', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }), text }
  },

  getEarnings: async () => (USE_MOCK ? (await wait(450), clone(store.earnings)) : real(E.earnings)),
  withdraw: async () => {
    if (!USE_MOCK) return real(E.withdraw)
    await wait(900)
    const e = store.earnings
    const amount = e.balances.ready
    e.balances.ready = 0
    e.ledger.unshift({ id: 'l' + Date.now(), date: 'Today', title: e.bank, sub: 'Withdrawal', status: 'Sent to bank', tone: 'muted', amount: -amount, kind: 'out' })
    return { amount, bank: e.bank }
  },
  downloadStatement: async () => {
    if (!USE_MOCK) return real(E.statement)
    await wait(500)
    return { ok: true }
  },

  getProfile: async () => (USE_MOCK ? (await wait(400), clone(store.profile)) : real(E.profile)),
  /** partial profile: { name, headline, bio, languages[], topics[], rates[], visibility{} } */
  updateProfile: async (patch) => {
    if (!USE_MOCK) return real(E.updateProfile, { body: patch })
    await wait(500)
    Object.assign(store.profile, patch)
    return clone(store.profile)
  },

  getThreads: async () => (USE_MOCK ? (await wait(300), clone(store.threads)) : real(E.threads)),
  markThreadRead: async (id) => {
    if (USE_MOCK) { const t = store.threads.find((x) => x.id === id); if (t) t.unread = false; return { ok: true } }
    return http(E.thread(id), { method: 'GET' })
  },

  getAgreement: async (id) => {
    if (!USE_MOCK) return http(E.agreement(id))
    await wait(400)
    const a = mock.agreements[id]
    if (!a) throw new Error('Agreement not found')
    return clone(a)
  },
  acceptAgreement: async (id) => {
    if (!USE_MOCK) return http(E.acceptAgreement(id))
    await wait(800)
    const a = mock.agreements[id]
    store.bids = store.bids.filter((b) => b.jobId !== id)
    if (a && !store.active.find((x) => x.id === id)) {
      store.active.unshift({ id, brand: a.brand, initials: a.initials, logo: a.logo, platform: a.platform, price: a.price, title: a.title, due: 'Sat 25 Oct', daysLeft: 8, stage: 'draft', signed: 'today', goesLive: a.postBy, roundsLeft: 1,
        terms: a.terms, contact: { name: `Team at ${a.brand}`, note: 'Usually replies within an hour', first: 'Team' }, messages: [{ id: 1, day: 'Today', from: 'brand', time: '11:40', text: 'We picked your bid! Agreement is ready.' }] })
    }
    return { ok: true }
  },
  /** payload: { reason? } */
  declineAgreement: async (id, payload) => {
    if (!USE_MOCK) return http(E.declineAgreement(id), { body: payload })
    await wait(600)
    const b = store.bids.find((x) => x.jobId === id)
    if (b) { b.status = 'withdrawn'; b.statusText = 'You declined the offer today' }
    return { ok: true }
  },

  toggleSave: async (id) => {
    if (!USE_MOCK) return http(E.saveJob(id))
    const j = store.jobs.find((x) => x.id === id)
    if (j) j.saved = !j.saved
    return { saved: j?.saved }
  },

  getNotifications: async () => (USE_MOCK ? (await wait(250), clone(store.notifications)) : real(E.notifications)),
  markAllRead: async () => {
    if (!USE_MOCK) return real(E.markAllRead)
    store.notifications.forEach((n) => (n.unread = false))
    return { ok: true }
  },
}
