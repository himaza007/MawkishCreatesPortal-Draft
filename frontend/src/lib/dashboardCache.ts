const KEY = 'dashboard_cache'
const TTL = 60_000

export function readDashboardCache() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > TTL) return null
    return data
  } catch { return null }
}

export function writeDashboardCache(data: object) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), data })) } catch {}
}

export function clearDashboardCache() {
  try { sessionStorage.removeItem(KEY) } catch {}
}
