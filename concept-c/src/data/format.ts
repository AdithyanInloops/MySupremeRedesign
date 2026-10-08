const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const parts = (iso: string) => iso.slice(0, 10).split('-').map(Number) as [number, number, number]

/** "2026-10-05" → "Oct 5" (no timezone drift). */
export const shortDate = (iso: string) => { const [, m, d] = parts(iso); return `${MONTHS[m - 1]} ${d}` }
/** "2026-10-05" → "Mon, Oct 5". */
export const dayDate = (iso: string) => { const [y, m, d] = parts(iso); return `${DAYS[new Date(y, m - 1, d).getDay()]}, ${MONTHS[m - 1]} ${d}` }
/** End of an offer's last day, local time. */
export const endOf = (iso: string) => { const [y, m, d] = parts(iso); return new Date(y, m - 1, d, 23, 59, 59).getTime() }
export const greeting = (h = new Date().getHours()) => (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
