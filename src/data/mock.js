// Sample data used when VITE_USE_MOCK=true. Shapes match what the real API should return.

export const me = {
  name: 'Ananya Kumar', handle: '@ananya.eats', initials: 'AK',
  counts: { bids: 4, activeJobs: 2, messages: 3, notifications: 3 },
}

export const jobs = [
  { id: 'spice-bowl', brand: 'Spice Bowl', city: 'Vijayawada', posted: '2h ago', platform: 'Instagram Reel', title: 'Reel for our new biryani menu', length: '30–45s', minViews: 12000, min: 5000, max: 8000, usual: 6000, bids: 14, closes: 'Tue 20', urgent: true, grad: ['#8a4422', '#4c2513'], saved: false },
  { id: 'fithub-gym', brand: 'FitHub Gym', city: 'Vijayawada', posted: '5h ago', platform: 'YouTube Short', title: 'Walkthrough of the new strength floor', length: '45–60s', minViews: 15000, min: 7000, max: 10000, usual: 7500, bids: 6, closes: 'Wed 21 Oct', urgent: false, grad: ['#2b4350', '#18252c'], saved: false },
  { id: 'glow-salon', brand: 'Glow Salon', city: 'Vijayawada', posted: '2d ago', platform: 'Instagram Reel', title: 'Bridal look, before and after', length: '30–45s', minViews: 10000, min: 6000, max: 9000, usual: 5000, bids: 4, closes: 'Fri 23 Oct', urgent: false, grad: ['#7e3549', '#451d28'], saved: false },
  { id: 'urban-threads', brand: 'Urban Threads', city: 'Hyderabad', posted: '1d ago', platform: 'Instagram Reel', title: 'Diwali edit try-on, three looks', length: '30–60s', minViews: 20000, min: 8000, max: 12000, usual: 5000, bids: 9, closes: 'Thu 22 Oct', urgent: false, grad: ['#4a5836', '#29301e'], saved: false },
  { id: 'chai-adda', brand: 'Chai Adda', city: 'Guntur', posted: '1d ago', platform: 'Instagram Story', title: 'Opening-week stories for the Brodipet outlet', length: '3 frames', minViews: 5000, min: 3000, max: 5000, usual: 2000, bids: 21, closes: 'Mon 19', urgent: true, grad: ['#a6651a', '#5b380e'], saved: false },
  { id: 'techkart', brand: 'TechKart', city: 'Visakhapatnam', posted: '3d ago', platform: 'YouTube Video', title: 'Unboxing a budget 5G phone at our store', length: '6–8 min', minViews: 25000, min: 10000, max: 15000, usual: 15000, bids: 11, closes: 'Sun 25 Oct', urgent: false, grad: ['#24426b', '#14243b'], saved: false },
]

export const home = {
  totalJobs: 128,
  matchedTo: 'food, cafés and Vijayawada',
  needsYou: [
    { id: 't1', tone: 'signal', title: 'Upload your draft for FitHub Gym', body: 'Strength floor walkthrough · due Mon 19 Oct, 3 days left', action: 'Upload draft', kind: 'draft', jobId: 'fithub-gym' },
    { id: 't2', tone: 'brand', title: 'Café Mocha picked your bid', body: 'Accept the agreement for ₹6,500 · the offer stays open until Sun 18 Oct', action: 'Review agreement', kind: 'agreement', jobId: 'cafe-mocha' },
    { id: 't3', tone: 'neutral', title: 'Glow Salon asked about your bid', body: '“Could you do a 60-second version for ₹8,500?”', action: 'Reply', kind: 'reply', jobId: 'glow-salon' },
  ],
  money: { earned: 48500, held: 12000, ready: 18230, bank: 'HDFC ••4821', payoutDate: 'Tue 20 Oct', month: 'October' },
  bidsSummary: { waiting: 4, shortlisted: 2, won: 3, of: 8, month: 'October' },
}

export const notifications = [
  { id: 'n1', title: 'Café Mocha picked your bid', body: 'Accept the agreement for ₹6,500', time: '12 min ago', unread: true },
  { id: 'n2', title: 'Glow Salon sent a message', body: 'Could you do a 60-second version for ₹8,500?', time: '1h ago', unread: true },
  { id: 'n3', title: 'Draft due in 3 days', body: 'FitHub Gym · Strength floor walkthrough', time: '3h ago', unread: true },
  { id: 'n4', title: 'Payment released', body: '₹4,800 from Spice Bowl is on its way to HDFC ••4821', time: 'Yesterday', unread: false },
]

// ---- extra fields used by Find Jobs rows (description, category, logo colour, full close date) ----
const META = {
  'spice-bowl':    { initials: 'SB', logo: '#7a3b1e', category: 'Food and cafés', closesFull: 'Tue 20 Oct', desc: '30–45s reel shot inside the MG Road outlet at lunch. Show the dum being opened and your first bite.' },
  'fithub-gym':    { initials: 'FH', logo: '#22333b', category: 'Fitness', closesFull: 'Wed 21 Oct', desc: 'A Short covering the new racks and a 5-minute beginner routine. Mention the free trial week.' },
  'glow-salon':    { initials: 'GS', logo: '#6b2e3e', category: 'Beauty', closesFull: 'Fri 23 Oct', desc: 'Film a bridal transformation in the salon. Credit the lead artist and put the booking link in the caption.' },
  'urban-threads': { initials: 'UT', logo: '#3e4a2e', category: 'Fashion', closesFull: 'Thu 22 Oct', desc: 'Style three looks from the festive edit. Mention the Banjara Hills store and the 20% launch offer.' },
  'chai-adda':     { initials: 'CA', logo: '#9a5b13', category: 'Food and cafés', closesFull: 'Mon 19 Oct', desc: 'Three story frames with a poll sticker and the location tag on each.' },
  'techkart':      { initials: 'TK', logo: '#1f3a5f', category: 'Electronics', closesFull: 'Sun 25 Oct', desc: 'Honest 6–8 minute unboxing and first impressions. Pick the phone up from the Dwaraka Nagar store.' },
}
jobs.forEach((j) => Object.assign(j, META[j.id]))

const EXTRA = [
  ['Biryani Junction', 'Hyderabad', 'Instagram Reel', 'Food and cafés', 'Weekend thali walkthrough', '30–45s', 12000, 4500, 7000, 5200, 8, 'Sat 24 Oct', '#7a2e1e', '#4a1d12'],
  ['Pulse Fitness', 'Visakhapatnam', 'YouTube Short', 'Fitness', '30-day transformation teaser', '45–60s', 18000, 8000, 12000, 7500, 12, 'Mon 26 Oct', '#27404a', '#162830'],
  ['Saree Studio', 'Vijayawada', 'Instagram Reel', 'Fashion', 'Pattu saree drape in 3 styles', '30–60s', 15000, 6000, 9500, 6000, 7, 'Tue 27 Oct', '#7d3b52', '#43202c'],
  ['Brew Lab', 'Guntur', 'Instagram Story', 'Food and cafés', 'Cold coffee launch stories', '4 frames', 6000, 2500, 4000, 3000, 15, 'Fri 23 Oct', '#5b4630', '#31251a'],
  ['Mobile Hub', 'Hyderabad', 'YouTube Video', 'Electronics', 'Top 5 phones under ₹15,000', '8–10 min', 30000, 12000, 18000, 15000, 5, 'Wed 28 Oct', '#26395a', '#16223a'],
  ['Lotus Spa', 'Vijayawada', 'Instagram Reel', 'Beauty', 'Facial treatment experience', '30–45s', 9000, 5000, 8000, 5000, 9, 'Thu 29 Oct', '#6a3a55', '#3a1f2f'],
]
for (let i = 0; i < 4; i++) EXTRA.forEach((e, k) => {
  const [brand, city, platform, category, title, length, minViews, min, max, usual, bids, closesFull, g1, g2] = e
  jobs.push({
    id: `${brand.toLowerCase().replace(/\s+/g, '-')}-${i}`, brand, city, posted: `${(i + 1) * 3 + k}h ago`, platform, title: i ? `${title} (${i + 1})` : title,
    length, minViews, min, max, usual, bids: bids + i * 2, closes: closesFull.replace(/ Oct$/, ''), urgent: false, grad: [g1, g2], saved: false,
    initials: brand.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), logo: g1, category, closesFull,
    desc: `${title}. Shoot on location and share the draft within two days of acceptance.`,
  })
})

export const facets = {
  city: { Vijayawada: 38, Guntur: 4, Hyderabad: 61, Visakhapatnam: 25 },
  platform: { 'Instagram Reel': 74, 'Instagram Story': 22, 'YouTube Short': 19, 'YouTube Video': 13 },
  category: { 'Food and cafés': 31, Fitness: 12, Fashion: 18, Beauty: 9, Electronics: 7 },
}

// ---- job detail (brief, deliverables, rules...) ----
export const bidStore = [] // filled by placeBid in mock mode (see services/api.js)

export function jobDetail(job) {
  if (job.id === 'spice-bowl') {
    return {
      ...job, kind: 'Restaurant', postBy: 'Wed 28 Oct', closesAt: 'Tue 20 Oct at midnight', defaultPostDate: '2026-10-26',
      brief: 'We’re launching a Hyderabadi dum biryani menu and want a warm, food-first reel shot inside our MG Road outlet. Open on the handi being unsealed, cut to plating, and end on your honest first bite. Lunch service (12–3 PM) gives you a full room in the background.',
      deliver: ['One Instagram Reel, 30–45 seconds, vertical', 'Shot at the MG Road outlet, not at home', 'Tag @spicebowl.vja and add the store location', 'Keep the post up for at least 30 days'],
      rules: ['Mark it as a paid partnership', 'No other restaurant names or logos in frame', 'One round of changes is included in the price'],
      where: { address: '12-4-56, MG Road, Labbipet, Vijayawada 520010', note: 'Ask for Ravi at the counter. Parking behind the building.', maps: 'https://maps.google.com/?q=MG+Road+Labbipet+Vijayawada' },
      about: { since: 'March 2026', verified: 'GST verified', hired: 12, rating: 4.8, approves: 'usually approves within a day' },
      last10Avg: 15200, similar: [{ title: 'Biryani trail: 5 spots in Vijayawada', views: '22.4k views', platform: 'instagram' }, { title: 'Best filter coffee in town', views: '18.1k views', platform: 'instagram' }],
    }
  }
  return {
    ...job, kind: job.category, postBy: 'Wed 28 Oct', closesAt: `${job.closesFull} at midnight`, defaultPostDate: '2026-10-27',
    brief: `${job.desc} Please keep the tone natural and show the place the way a regular customer would see it.`,
    deliver: [`One ${job.platform}, ${job.length}`, `Shot at the ${job.brand} outlet in ${job.city}`, `Tag @${job.brand.toLowerCase().replace(/\s+/g, '')} and add the store location`, 'Keep the post up for at least 30 days'],
    rules: ['Mark it as a paid partnership', 'No competitor names or logos in frame', 'One round of changes is included in the price'],
    where: { address: `${job.brand}, main road, ${job.city}`, note: 'The brand will share exact timings once your bid is picked.', maps: `https://maps.google.com/?q=${encodeURIComponent(job.brand + ' ' + job.city)}` },
    about: { since: 'January 2026', verified: 'GST verified', hired: 6, rating: 4.6, approves: 'usually approves within two days' },
    last10Avg: Math.round(job.minViews * 1.2 / 100) * 100,
    similar: [{ title: `${job.category} walkthrough in ${job.city}`, views: '14.2k views', platform: 'instagram' }],
  }
}


export const bids = [
  { id: 'b1', jobId: 'cafe-mocha', brand: 'Café Mocha', initials: 'CM', logo: '#4a3426', title: 'Weekend latte-art reel', platform: 'Instagram Reel', amount: 6500, status: 'won', statusText: 'Accept by Sun 18 Oct', why: 'Latte art is my strongest niche.', views: 15000 },
  { id: 'b2', jobId: 'glow-salon', brand: 'Glow Salon', initials: 'GS', logo: '#6b2e3e', title: 'Bridal look, before and after', platform: 'Instagram Reel', amount: 8000, status: 'shortlisted', statusText: 'Brand asked you a question', question: true, why: 'Bridal content with before/after cuts performs well for me.', views: 14000 },
  { id: 'b3', jobId: 'techkart', brand: 'TechKart', initials: 'TK', logo: '#1f3a5f', title: 'Unboxing a budget 5G phone', platform: 'YouTube Video', amount: 14000, status: 'shortlisted', statusText: 'Closes Sun 25 Oct', why: 'Detailed tech reviews are what I do best.', views: 25000 },
  { id: 'b4', jobId: 'spice-bowl', brand: 'Spice Bowl', initials: 'SB', logo: '#7a3b1e', title: 'Reel for our new biryani menu', platform: 'Instagram Reel', amount: 7000, status: 'sent', statusText: 'Closes Tue 20 Oct', why: 'Food reels in Vijayawada are my main strength.', views: 15000 },
  { id: 'b5', jobId: 'urban-threads', brand: 'Urban Threads', initials: 'UT', logo: '#3e4a2e', title: 'Diwali edit try-on, three looks', platform: 'Instagram Reel', amount: 10500, status: 'sent', statusText: 'Closes Thu 22 Oct', why: 'Festive try-ons get high saves for me.', views: 20000 },
  { id: 'b6', jobId: 'book-nook', brand: 'Book Nook', initials: 'BN', logo: '#2f4858', title: 'Reading corner reel', platform: 'Instagram Reel', amount: 5000, status: 'notpicked', statusText: 'Brand picked another creator' },
  { id: 'b7', jobId: 'chai-adda', brand: 'Chai Adda', initials: 'CA', logo: '#9a5b13', title: 'Stories for the Benz Circle outlet', platform: 'Instagram Story', amount: 4000, status: 'withdrawn', statusText: 'You withdrew on 12 Oct' },
  { id: 'b8', jobId: 'daily-bakes', brand: 'Daily Bakes', initials: 'DB', logo: '#5a4a2f', title: 'Diwali sweets box reel', platform: 'Instagram Reel', amount: 3500, status: 'cancelled', statusText: 'Brand cancelled the job' },
]
export const bidSummary = { month: 'October', total: 8, won: 3 }

// ---- active jobs ----
export const activeJobs = [
  {
    id: 'fithub-gym', brand: 'FitHub Gym', initials: 'FH', logo: '#22333b', platform: 'YouTube Short', price: 9000,
    title: 'Walkthrough of the new strength floor', due: 'Mon 19 Oct', daysLeft: 3, stage: 'draft', signed: '12 Oct', goesLive: 'Fri 30 Oct', roundsLeft: 2,
    terms: [
      ['Price', '₹9,000, held by Kolab since 12 Oct'], ['Deliverable', 'One YouTube Short, 45–60 seconds'],
      ['Must show', 'The new squat racks, a 5-minute beginner routine, the free trial week'], ['Changes', 'Up to 2 rounds'],
      ['Goes live', 'By Fri 30 Oct, stays up 30 days'], ['Payment', '70% when FitHub approves · 30% after the 7-day view check'],
    ],
    contact: { name: 'Kiran at FitHub Gym', note: 'Usually replies within an hour', first: 'Kiran' },
    messages: [
      { id: 1, day: 'Wednesday', from: 'brand', time: '10:02', text: 'Hi Ananya, can you open on the squat racks? They’re what we’re proudest of.' },
      { id: 2, from: 'me', time: '10:05', text: 'Yes — racks first, then the routine, and I’ll close on the free trial week.' },
      { id: 3, from: 'brand', time: '10:07', text: 'Mornings 7–9 have the best light on the floor. I’ll keep that bay free for you.' },
      { id: 4, day: 'Today', from: 'me', time: '09:41', text: 'Shot it this morning. Editing now, draft by Saturday.' },
    ],
  },
  {
    id: 'sri-sweets', brand: 'Sri Sweets', initials: 'SS', logo: '#8a4422', platform: 'Instagram Reel', price: 6000,
    title: 'Diwali mithai gift box reel', due: 'Thu 15 Oct', daysLeft: 0, stage: 'review', signed: '8 Oct', goesLive: 'Wed 21 Oct', roundsLeft: 2,
    terms: [
      ['Price', '₹6,000, held by Kolab since 8 Oct'], ['Deliverable', 'One Instagram Reel, 30–45 seconds'],
      ['Must show', 'The gift box opening, three sweets, the festive offer'], ['Changes', 'Up to 2 rounds'],
      ['Goes live', 'By Wed 21 Oct, stays up 30 days'], ['Payment', '70% when Sri Sweets approves · 30% after the 7-day view check'],
    ],
    contact: { name: 'Lakshmi at Sri Sweets', note: 'Usually replies within two hours', first: 'Lakshmi' },
    messages: [{ id: 1, day: 'Today', from: 'brand', time: '08:15', text: 'Draft received, thank you. We’ll review it by tomorrow evening.' }],
  },
]

// ---- earnings ----
export const earnings = {
  bank: 'HDFC Bank ••4821', payoutDay: 'Tue 20 Oct',
  balances: { ready: 18230, held: 12000, earned: 48500, tds: 1246, heldFor: 'FitHub Gym and Café Mocha', delta: '₹11,200 more than September' },
  ledger: [
    { id: 'l1', date: '14 Oct', title: 'Café Mocha', sub: '70% on approval · Weekend latte-art reel', status: 'Paid', tone: 'brand', amount: 4050, kind: 'in', slip: 's1' },
    { id: 'l2', date: '12 Oct', title: 'FitHub Gym', sub: 'Money held for your job', status: 'Held', tone: 'signal', amount: 9000, kind: 'held' },
    { id: 'l3', date: '08 Oct', title: 'HDFC Bank ••4821', sub: 'Withdrawal', status: 'Sent to bank', tone: 'muted', amount: -15000, kind: 'out' },
    { id: 'l4', date: '05 Oct', title: 'Glow Salon', sub: '30% after view check · Navratri look reel', status: 'Paid', tone: 'brand', amount: 1620, kind: 'in', slip: 's2' },
    { id: 'l5', date: '01 Oct', title: 'Urban Threads', sub: '70% on approval · Store tour reel', status: 'Paid', tone: 'brand', amount: 5512, kind: 'in', slip: 's3' },
    { id: 'l6', date: '28 Sep', title: 'Chai Adda', sub: 'Job cancelled by brand, nothing owed', status: 'Refunded to brand', tone: 'faint', amount: 0, kind: 'none' },
  ],
  slips: {
    s1: { ref: 'KLB-2026-1048', job: 'Café Mocha · Weekend latte-art reel', price: 6500, first: { label: 'First 70% · 14 Oct', amount: 4050, note: 'Paid', tone: 'brand' }, last: { label: 'Last 30% · 21 Oct', amount: 1735, note: 'After view check · 14.8k of 14k views', tone: 'signal' } },
    s2: { ref: 'KLB-2026-0987', job: 'Glow Salon · Navratri look reel', price: 6067, first: { label: 'First 70% · 28 Sep', amount: 3780, note: 'Paid', tone: 'brand' }, last: { label: 'Last 30% · 05 Oct', amount: 1620, note: 'Paid · 16.2k of 10k views', tone: 'brand' } },
    s3: { ref: 'KLB-2026-0951', job: 'Urban Threads · Store tour reel', price: 8847, first: { label: 'First 70% · 01 Oct', amount: 5512, note: 'Paid', tone: 'brand' }, last: { label: 'Last 30% · 08 Oct', amount: 2362, note: 'Paid · 21.4k of 20k views', tone: 'brand' } },
  },
}

// ---- profile ----
export const profile = {
  name: 'Ananya Kumar', initials: 'AK', verified: true, headline: 'Food and local spots in Vijayawada', languages: ['Telugu', 'English', 'Hindi'],
  bio: 'I review restaurants, cafés and street food around Vijayawada and Guntur, mostly in Telugu with English captions. Most of my followers live within 30 km, so a reel from me tends to bring people through the door, not just likes.',
  synced: '2 hours ago', mediaKit: 'https://kolab.app/c/ananya-kumar',
  accounts: [
    { platform: 'instagram', name: '@ananya.eats', followers: '48.2k', views: '15.2k', engagement: '6.8%', local: '82%' },
    { platform: 'youtube', name: 'Ananya Eats', followers: '12.4k', views: '9.1k', engagement: '4.2%', local: '64%' },
  ],
  work: [
    { id: 1, title: 'Biryani trail: 5 spots in Vijayawada', brand: 'Spice Bowl', views: '22.4k views', from: '#6e3a1f' },
    { id: 2, title: 'Best filter coffee in town', brand: 'Café Mocha', views: '18.1k views', from: '#3f2e24' },
    { id: 3, title: '₹100 street food challenge', brand: 'Not sponsored', views: '31.0k views', from: '#7c5a12' },
    { id: 4, title: 'What I eat on gym days', brand: 'FitHub Gym', views: '9.8k views', from: '#22333b' },
  ],
  reviews: { avg: 4.9, jobs: 23, items: [
    { text: 'Delivered a day early. The weekend after the reel went up we ran out of oat milk by Saturday noon.', by: 'Café Mocha · Oct 2026' },
    { text: 'Clear about what she needed from us, and the views beat her own estimate by about a third.', by: 'Urban Threads · Sep 2026' },
  ] },
  rates: [['Instagram Reel', 6000], ['Instagram Story, 3 frames', 2500], ['YouTube Short', 7500], ['YouTube Video', 15000]],
  track: [['Jobs completed', '31'], ['Delivered on time', '30 of 31'], ['Disputes', 'None'], ['Member since', 'Jan 2026']],
  topics: ['Food', 'Cafés', 'Street food', 'Local business', 'Fitness meals'],
  visibility: { followers: true, audience: true, rates: false },
}

// ---- messages ----
export const threads = [
  { id: 'glow-salon', brand: 'Glow Salon', initials: 'GS', logo: '#6b2e3e', last: 'Could you do a 60-second version for ₹8,500?', time: '3h', unread: true,
    contact: { name: 'Priya at Glow Salon', first: 'Priya', sub: 'About your bid on “Bridal look, before and after” · ₹8,000' },
    bid: { jobId: 'glow-salon', text: 'Your bid · ₹8,000 for one Instagram Reel', sub: 'Sent Tue 14 Oct · bidding closes Fri 23 Oct', platform: 'instagram' },
    messages: [
      { id: 1, from: 'brand', time: '1:12 PM', text: 'Hi Ananya, loved your filter coffee reel. Our brides usually want the full reveal, so 45 seconds feels tight.' },
      { id: 2, from: 'brand', time: '1:14 PM', text: 'Could you do a 60-second version for ₹8,500? Same shoot day, just a longer cut.' },
    ] },
  { id: 'fithub-gym', brand: 'FitHub Gym', initials: 'FH', logo: '#22333b', last: 'Mornings 7–9 have the best light on the floor.', time: 'Wed', unread: false,
    contact: { name: 'Kiran at FitHub Gym', first: 'Kiran', sub: 'Active job · Walkthrough of the new strength floor' },
    messages: [
      { id: 1, day: 'Wednesday', from: 'brand', time: '10:02', text: 'Hi Ananya, can you open on the squat racks? They’re what we’re proudest of.' },
      { id: 2, from: 'me', time: '10:05', text: 'Yes — racks first, then the routine, and I’ll close on the free trial week.' },
      { id: 3, from: 'brand', time: '10:07', text: 'Mornings 7–9 have the best light on the floor. I’ll keep that bay free for you.' },
    ] },
  { id: 'cafe-mocha', brand: 'Café Mocha', initials: 'CM', logo: '#4a3426', last: 'We picked your bid! Agreement is ready.', time: '2h', unread: true,
    contact: { name: 'Rohit at Café Mocha', first: 'Rohit', sub: 'You won · Weekend latte-art reel · ₹6,500' },
    bid: { jobId: 'cafe-mocha', text: 'Your bid · ₹6,500 for one Instagram Reel', sub: 'Won · accept by Sun 18 Oct', platform: 'instagram' },
    messages: [{ id: 1, from: 'brand', time: '11:40 AM', text: 'We picked your bid! Agreement is ready.' }] },
  { id: 'spice-bowl', brand: 'Spice Bowl', initials: 'SB', logo: '#7a3b1e', last: 'Thanks for bidding. We’ll decide after Tuesday.', time: 'Mon', unread: false,
    contact: { name: 'Imran at Spice Bowl', first: 'Imran', sub: 'About your bid on “Reel for our new biryani menu” · ₹7,000' },
    bid: { jobId: 'spice-bowl', text: 'Your bid · ₹7,000 for one Instagram Reel', sub: 'Sent · bidding closes Tue 20 Oct', platform: 'instagram' },
    messages: [{ id: 1, from: 'brand', time: '9:20 AM', text: 'Thanks for bidding. We’ll decide after Tuesday.' }] },
  { id: 'urban-threads', brand: 'Urban Threads', initials: 'UT', logo: '#3e4a2e', last: 'Do you have a sample with festive wear?', time: '9 Oct', unread: false,
    contact: { name: 'Meera at Urban Threads', first: 'Meera', sub: 'About your bid on “Diwali edit try-on, three looks” · ₹10,500' },
    bid: { jobId: 'urban-threads', text: 'Your bid · ₹10,500 for one Instagram Reel', sub: 'Sent · bidding closes Thu 22 Oct', platform: 'instagram' },
    messages: [{ id: 1, from: 'brand', time: '4:05 PM', text: 'Do you have a sample with festive wear?' }] },
]

// ---- agreements ----
export const agreements = {
  'cafe-mocha': {
    id: 'cafe-mocha', brand: 'Café Mocha', initials: 'CM', logo: '#4a3426', title: 'Weekend latte-art reel', platform: 'Instagram Reel', price: 6500, minViews: 14000,
    acceptBy: 'Sun 18 Oct', postBy: 'Sat 25 Oct',
    terms: [
      ['Price', '₹6,500. Café Mocha pays Kolab when you accept.'], ['Deliverable', 'One Instagram Reel, 30–45 seconds, vertical'],
      ['Must show', 'A latte-art pour, the weekend menu board, and the store’s location tag'], ['Where', 'Café Mocha, Benz Circle, Vijayawada. Weekends 8–11 AM are quietest.'],
      ['Post by', 'Sat 25 Oct, and keep it up for 30 days'], ['Changes', 'One round included'],
      ['Payment', '70% when Café Mocha approves the post · 30% after the 7-day check (needs 14,000 views)'],
      ['If they cancel', 'After you’ve shot, you keep 50% of the price'], ['Disclosure', 'Mark the post as a paid partnership'],
    ],
  },
}
