import type { DailyAdvisor, WeatherSummary } from "@/lib/types"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET(req: Request) {
  const url = new URL(req.url)
  const lat = url.searchParams.get("lat")
  const lon = url.searchParams.get("lon")
  const crop = url.searchParams.get("crop")
  const season = url.searchParams.get("season")

  if (!lat || !lon || !crop || !season) {
    return Response.json({ error: "Missing required parameters: lat, lon, crop, season" }, { status: 400 })
  }

  // Fetch weather data
  const weatherRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/weather?lat=${lat}&lon=${lon}`)
  if (!weatherRes.ok) {
    return Response.json({ error: "Failed to fetch weather" }, { status: 500 })
  }
  const weather: WeatherSummary = await weatherRes.json()

  // Use Gemini to generate dynamic advisor
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  const prompt = `
You are an agricultural advisor for smallholder farmers in India. Generate a daily advisor response based on the following:

Weather forecast: ${JSON.stringify(weather.forecast.slice(0, 3))}
Current weather: ${weather.current.condition}, ${weather.current.tempC}°C, humidity ${weather.current.humidity}%
Crop: ${crop}
Season: ${season}

Provide:
1. A weather note summarizing key points for farming.
2. 3-4 actionable tasks for today, considering weather impacts (e.g., delay irrigation if rain is coming).
3. A concise tip of the day (under 100 words) with practical advice.

Response format: JSON with keys: weatherNote (string), tasks (array of {id: string, title: string, done: false}), tipOfTheDay (string)
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const generated = JSON.parse(text)

    const today = new Date().toISOString().slice(0, 10)
    const payload: DailyAdvisor = {
      date: today,
      weatherNote: generated.weatherNote,
      tasks: generated.tasks,
      tipOfTheDay: generated.tipOfTheDay,
    }
    return Response.json(payload)
  } catch (err) {
    console.error("Gemini error:", err)
    // Fallback to static
    const today = new Date().toISOString().slice(0, 10)
    const payload: DailyAdvisor = {
      date: today,
      weatherNote: "Light showers in the evening; plan irrigation accordingly.",
      tasks: [
        { id: "t1", title: "Inspect for aphids on lower leaves", done: false },
        { id: "t2", title: "Top-dress nitrogen on wheat (as per schedule)", done: false },
        { id: "t3", title: "Mulch around seedlings to retain moisture", done: false },
      ],
      tipOfTheDay: "Use mulching to reduce evaporation and suppress weeds, improving water efficiency.",
    }
    return Response.json(payload)
  }
}
