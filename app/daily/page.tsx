"use client"

import useSWR from "swr"
import { Nav } from "@/components/nav"
import { getSavedFarmLocation, getBrowserLocation } from "@/lib/utils-client"
import type { DailyAdvisor, WeatherSummary } from "@/lib/types"
import { useEffect, useState } from "react"
import { Sun, Cloud, CloudRain, Snowflake } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DailyPage() {
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({})
  const [crop, setCrop] = useState("")
  const [season, setSeason] = useState("")
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const saved = getSavedFarmLocation()
    if (saved) setCoords(saved)
    else getBrowserLocation().then((c) => c && setCoords(c)).catch(() => setCoords({ lat: 28.6139, lon: 77.209 })) // Default to Delhi if geolocation fails

    setCrop(localStorage.getItem("userCrop") || "wheat")
    setSeason(localStorage.getItem("userSeason") || "kharif")

    // Load task states from localStorage
    const today = new Date().toISOString().slice(0, 10)
    const stored = localStorage.getItem(`tasks-${today}`)
    if (stored) {
      setTaskStates(JSON.parse(stored))
    }
  }, [])

  const { data: weather } = useSWR<WeatherSummary>(
    coords.lat != null && coords.lon != null ? `/api/weather?lat=${coords.lat}&lon=${coords.lon}` : null,
    fetcher,
  )

  const { data: daily } = useSWR<DailyAdvisor>(
    crop && season
      ? `/api/advisor/daily?lat=${coords.lat || 28.6139}&lon=${coords.lon || 77.209}&crop=${crop}&season=${season}`
      : null,
    fetcher,
  )

  const toggleTask = (taskId: string) => {
    const today = new Date().toISOString().slice(0, 10)
    const newStates = { ...taskStates, [taskId]: !taskStates[taskId] }
    setTaskStates(newStates)
    localStorage.setItem(`tasks-${today}`, JSON.stringify(newStates))
  }

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase()
    if (lower.includes("sun") || lower.includes("clear")) return <Sun className="h-6 w-6 text-yellow-500" />
    if (lower.includes("rain")) return <CloudRain className="h-6 w-6 text-blue-500" />
    if (lower.includes("snow")) return <Snowflake className="h-6 w-6 text-blue-300" />
    return <Cloud className="h-6 w-6 text-gray-500" />
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <h1 className="text-xl font-semibold">Daily Advisor</h1>

        <section className="rounded-md border p-4">
          <h2 className="font-medium mb-2">Weather Forecast</h2>
          {weather ? (
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {weather.forecast.slice(0, 6).map((d, i) => (
                <li key={i} className="rounded-md border p-3 flex items-center gap-2">
                  {getWeatherIcon(d.condition)}
                  <div>
                    <div className="text-sm text-muted-foreground">{d.date}</div>
                    <div className="font-medium">{d.tempC}°C</div>
                    <div className="text-sm">{d.condition}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground">Loading forecast…</div>
          )}
        </section>

        <section className="rounded-md border p-4">
          <h2 className="font-medium mb-2">Action Checklist</h2>
          {daily ? (
            <ul className="grid gap-2">
              {daily.tasks.map((t) => {
                const isDone = taskStates[t.id] ?? t.done
                return (
                  <li key={t.id} className="flex items-center gap-2 rounded-md border p-2">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleTask(t.id)}
                      className="rounded"
                    />
                    <span className={isDone ? "line-through text-green-600" : "text-orange-600"}>
                      {t.title}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground">Loading tasks…</div>
          )}
        </section>

        <section className="rounded-md border p-4">
          <h2 className="font-medium mb-2">AI Tip of the Day</h2>
          <p className="text-sm text-pretty">{daily?.tipOfTheDay ?? "Generating…"}</p>
        </section>
      </main>
    </>
  )
}
