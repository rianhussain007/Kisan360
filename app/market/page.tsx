"use client"

import useSWR from "swr"
import { Nav } from "@/components/nav"
import type { MarketBuyer } from "@/lib/types"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MarketPage() {
  const [crop, setCrop] = useState("Wheat")
  const { data } = useSWR<Array<MarketBuyer>>(`/api/market?crop=${encodeURIComponent(crop)}`, fetcher)

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        <h1 className="text-xl font-semibold">Smart Market Connect</h1>

        <div className="rounded-md border p-4">
          <label className="text-sm text-muted-foreground mr-2">Crop</label>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="rounded-md border px-3 py-2 bg-background"
            aria-label="Crop name"
          />
        </div>

        {data ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {data.map((b) => (
              <li key={b.id} className="rounded-md border p-4">
                <div className="font-medium">{b.name}</div>
                <div className="text-sm text-muted-foreground">{b.location}</div>
                <div className="mt-2">Price: ₹{b.pricePerQuintal}/quintal</div>
                <div className="text-sm">
                  Trend:{" "}
                  <span
                    className={
                      b.trend === "up"
                        ? "text-green-600"
                        : b.trend === "down"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }
                  >
                    {b.trend}
                  </span>
                </div>
                {b.contactUrl ? (
                  <a className="text-sm underline" href={b.contactUrl} target="_blank" rel="noreferrer">
                    Contact Buyer
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">Loading buyers…</div>
        )}
      </main>
    </>
  )
}
