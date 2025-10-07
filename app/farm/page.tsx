"use client"

import { Nav } from "@/components/nav"
import { MapView } from "@/components/map-view"
import { getBrowserLocation, saveFarmLocation, getSavedFarmLocation } from "@/lib/utils-client"
import { useEffect, useState } from "react"

export default function FarmPage() {
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({})
  const [saving, setSaving] = useState(false)
  const saved = getSavedFarmLocation()

  useEffect(() => {
    if (saved) {
      setCoords({ lat: saved.lat, lon: saved.lon })
    }
  }, [])

  async function detect() {
    const loc = await getBrowserLocation()
    if (loc) setCoords(loc)
  }

  async function save() {
    if (coords.lat == null || coords.lon == null) return
    setSaving(true)
    try {
      // Persist locally and post to backend stub (replace with Firestore/Mongo)
      saveFarmLocation({ lat: coords.lat, lon: coords.lon })
      await fetch("/api/farm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lat: coords.lat, lon: coords.lon }),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <h1 className="text-xl font-semibold">Farm Mapping</h1>
        <div className="rounded-md border p-4 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <button onClick={detect} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">
              Auto-detect Location
            </button>
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              className="w-40 rounded-md border px-2 py-2 bg-background"
              value={coords.lat ?? ""}
              onChange={(e) => setCoords((c) => ({ ...c, lat: Number.parseFloat(e.target.value) }))}
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              className="w-40 rounded-md border px-2 py-2 bg-background"
              value={coords.lon ?? ""}
              onChange={(e) => setCoords((c) => ({ ...c, lon: Number.parseFloat(e.target.value) }))}
            />
            <button
              onClick={save}
              disabled={coords.lat == null || coords.lon == null || saving}
              className="rounded-md bg-secondary px-3 py-2 text-secondary-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Location"}
            </button>
          </div>

          <MapView lat={coords.lat} lon={coords.lon} height={340} />

          <div className="text-sm text-muted-foreground">
            Microclimate layers and soil overlays can be added here using map layers (e.g., heatmaps).
          </div>
        </div>
      </main>
    </>
  )
}
