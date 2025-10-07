export type FarmLocation = {
  lat: number
  lon: number
  savedAt?: string
}

export type WeatherSummary = {
  locationName: string
  current: {
    tempC: number
    condition: string
    humidity: number
  }
  alerts?: Array<{ type: "drought" | "flood" | "storm"; message: string }>
  forecast: Array<{ date: string; tempC: number; condition: string }>
}

export type AdvisorRecommendation = {
  crops: Array<{
    name: string
    rationale: string
    expectedYieldIncreaseX?: number
  }>
  summary: string
}

export type VisionResult = {
  status: "ok"
  detections: Array<{
    label: string
    confidence: number
    recommendation: string
    severity: "low" | "medium" | "high"
  }>
}

export type ResourcePlace = {
  id: string
  name: string
  distanceKm: number
  rating?: number
  type: "seed" | "fertilizer" | "agri-store"
  directionsUrl?: string
}

export type MarketBuyer = {
  id: string
  name: string
  location: string
  pricePerQuintal: number
  trend: "up" | "down" | "stable"
  contactUrl?: string
}

export type DailyAdvisor = {
  date: string
  weatherNote: string
  tasks: Array<{ id: string; title: string; done: boolean }>
  tipOfTheDay: string
}

export type HistoryPayload = {
  months: Array<{
    date: string
    tempC: number
    rainfallMm: number
  }>
  seasonalRecommendations: string[]
}
