export async function getBrowserLocation(): Promise<{ lat: number; lon: number } | null> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) return null
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 },
    )
  })
}

const FARM_KEY = "kishan360:farmLocation"

export function saveFarmLocation(loc: { lat: number; lon: number }) {
  if (typeof window === "undefined") return
  const payload = { ...loc, savedAt: new Date().toISOString() }
  localStorage.setItem(FARM_KEY, JSON.stringify(payload))
}

export function getSavedFarmLocation(): { lat: number; lon: number; savedAt?: string } | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(FARM_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const LAST_VISION_KEY = "kishan360:lastVision"
export function saveLastVisionResult(payload: unknown) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(LAST_VISION_KEY, JSON.stringify(payload))
}
export function getLastVisionResult<T = unknown>(): T | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(LAST_VISION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
