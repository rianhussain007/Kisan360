import type { NextRequest } from "next/server"
import type { WeatherSummary } from "@/lib/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  const mock: WeatherSummary = {
    locationName: "Your Farm",
    current: { tempC: 29, condition: "Sunny", humidity: 42 },
    alerts: [{ type: "drought", message: "Low rainfall expected over next 2 weeks." }],
    forecast: Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
      tempC: 28 + ((i % 3) - 1),
      condition: ["Sunny", "Cloudy", "Rain"][i % 3],
    })),
  }

  // If you want to use real OpenWeather API, uncomment below and add OPENWEATHER_API_KEY
  /*
  const apiKey = process.env.OPENWEATHER_API_KEY
  const forceMock = searchParams.get("mock") === "1"

  if (!lat || !lon || forceMock || !apiKey) {
    return Response.json(mock, { headers: { "x-weather-source": "mock" } })
  }

  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { cache: "no-store" },
    )
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { cache: "no-store" },
    )

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("OpenWeather request failed")
    }

    const current = await currentRes.json()
    const forecastJson = await forecastRes.json()

    const summary: WeatherSummary = {
      locationName: current?.name || "Your Farm",
      current: {
        tempC: Math.round(current?.main?.temp ?? 28),
        condition: current?.weather?.[0]?.main ?? "Clear",
        humidity: current?.main?.humidity ?? 40,
      },
      forecast:
        forecastJson?.list?.slice(0, 7).map((f: any) => ({
          date: f?.dt_txt?.split(" ")?.[0] ?? "",
          tempC: Math.round(f?.main?.temp ?? 28),
          condition: f?.weather?.[0]?.main ?? "Clear",
        })) ?? [],
    }
    return Response.json(summary, { headers: { "x-weather-source": "openweather" } })
  } catch (err: any) {
    console.log("[v0] Weather API fallback:", err?.message || "unknown error")
  }
  */

  return Response.json(mock, { headers: { "x-weather-source": "mock" } })
}
