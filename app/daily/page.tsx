"use client"

import useSWR from "swr"
import { Nav } from "@/components/nav"
import { getSavedFarmLocation, getBrowserLocation } from "@/lib/utils-client"
import type { DailyAdvisor, WeatherSummary } from "@/lib/types"
import { useEffect, useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DailyPage() {
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({})
  useEffect(() => {
    const saved = getSavedFarmLocation()
    if (saved) setCoords(saved)
    else getBrowserLocation().then((c) => c && setCoords(c))
  }, [])

  const { data: weather } = useSWR<WeatherSummary>(
    coords.lat != null && coords.lon != null ? `/api/weather?lat=${coords.lat}&lon=${coords.lon}` : null,
    fetcher,
  )

  const { data: daily } = useSWR<DailyAdvisor>("/api/advisor/daily", fetcher)

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
                <li key={i} className="rounded-md border p-3">
                  <div className="text-sm text-muted-foreground">{d.date}</div>
                  <div className="font-medium">{d.tempC}°C</div>
                  <div className="text-sm">{d.condition}</div>
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
              {daily.tasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-md border p-2">
                  <span>{t.title}</span>
                  <span
                    className={t.done ? "text-green-600 text-sm" : "text-orange-600 text-sm"}
                    aria-label={t.done ? "Done" : "Pending"}
                  >
                    {t.done ? "Done" : "Pending"}
                  </span>
                </li>
              ))}
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
