import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get("lat") ?? 0)
  const lon = Number(searchParams.get("lon") ?? 0)
  void lat
  void lon

  // Note: OpenWeather historical requires paid tiers; we provide an integration-ready stub.
  // If OPENWEATHER_API_KEY is present, you could aggregate past data using One Call (timemachine) endpoints.

  const months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    return {
      date: d.toISOString().slice(0, 7),
      tempC: 22 + ((i % 5) - 2),
      rainfallMm: 40 + (i % 3) * 10,
    }
  })

  const seasonalRecommendations = [
    "Prefer drought-tolerant varieties in the coming kharif due to projected dry spells.",
    "Advance sowing by ~1 week to align with early monsoon onset probability.",
    "Consider short-duration pulses post main crop to utilize residual moisture.",
  ]

  return Response.json({ months, seasonalRecommendations })
}
