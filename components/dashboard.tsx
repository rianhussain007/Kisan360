"use client"

import useSWR from "swr"
import { getBrowserLocation, getSavedFarmLocation } from "@/lib/utils-client"
import { MapView } from "@/components/map-view"
import type { AdvisorRecommendation, HistoryPayload } from "@/lib/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  MapPin,
  Camera,
  Store,
  BarChart3,
  Sprout,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CropScannerModal } from "@/components/crop-scanner-modal"
import MarketChart from "@/components/market-chart"
import { WeatherSummary } from "@/components/WeatherSummary"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function toDMS(lat: number, lon: number) {
  const latDeg = Math.floor(Math.abs(lat))
  const latMin = Math.floor((Math.abs(lat) - latDeg) * 60)
  const latSec = (((Math.abs(lat) - latDeg) * 60 - latMin) * 60).toFixed(1)
  const latDir = lat >= 0 ? "N" : "S"

  const lonDeg = Math.floor(Math.abs(lon))
  const lonMin = Math.floor((Math.abs(lon) - lonDeg) * 60)
  const lonSec = (((Math.abs(lon) - lonDeg) * 60 - lonMin) * 60).toFixed(1)
  const lonDir = lon >= 0 ? "E" : "W"

  return `${latDeg}°${latMin}'${latSec}"${latDir} ${lonDeg}°${lonMin}'${lonSec}"${lonDir}`
}

export function Dashboard() {
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({ lat: 28.6139, lon: 77.209 })
  const [scannerOpen, setScannerOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<string>("sorghum")

  useEffect(() => {
    const saved = getSavedFarmLocation()
    if (saved) {
      setCoords({ lat: saved.lat, lon: saved.lon })
    } else {
      getBrowserLocation().then((loc) => {
        if (loc) setCoords(loc)
      })
    }
  }, [])

  const { data: advisor } = useSWR<AdvisorRecommendation>(
    coords.lat != null && coords.lon != null ? `/api/advisor?lat=${coords.lat}&lon=${coords.lon}` : null,
    fetcher,
  )

  const { data: history } = useSWR<HistoryPayload>(
    coords.lat != null && coords.lon != null ? `/api/weather/history?lat=${coords.lat}&lon=${coords.lon}` : null,
    fetcher,
  )

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Farm Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Farm Overview Card */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Farm Overview</h2>
              </div>
              <MapView lat={coords.lat} lon={coords.lon} height={240} />
              <div className="mt-4 space-y-2">
                {coords.lat != null && coords.lon != null ? (
                  <>
                    <p className="text-sm text-muted-foreground font-mono">
                      {toDMS(coords.lat, coords.lon)}
                    </p>
                    <Link href="/farm">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Manage Farm Details
                      </Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No location set.{" "}
                    <Link href="/farm" className="underline text-primary">
                      Set it now
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>

            {/* Seasonal Tasks */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Key Seasonal Tasks</h2>
              </div>
              {history?.seasonalRecommendations?.length ? (
                <ul className="space-y-3">
                  {history.seasonalRecommendations.slice(0, 3).map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">Analyzing climate patterns...</div>
              )}
            </div>
          </div>

          {/* Right Column - Weather + Market */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather Summary */}
            <WeatherSummary />

            {/* Market Watch */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Live Market Prices</h2>
                </div>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="sorghum">Sorghum</option>
                  <option value="chickpea">Chickpea</option>
                  <option value="pearl-millet">Pearl Millet</option>
                  <option value="wheat">Wheat</option>
                </select>
              </div>
              
              {/* Market Chart */}
              <MarketChart 
                crop={selectedCrop}
                data={{
                  'sorghum': [
                    { date: 'Mon', price: 2850 },
                    { date: 'Tue', price: 2920 },
                    { date: 'Wed', price: 2880 },
                    { date: 'Thu', price: 2950 },
                    { date: 'Fri', price: 3020 },
                    { date: 'Sat', price: 3100 },
                    { date: 'Sun', price: 3150 },
                  ],
                  'chickpea': [
                    { date: 'Mon', price: 5200 },
                    { date: 'Tue', price: 5150 },
                    { date: 'Wed', price: 5300 },
                    { date: 'Thu', price: 5280 },
                    { date: 'Fri', price: 5400 },
                    { date: 'Sat', price: 5450 },
                    { date: 'Sun', price: 5500 },
                  ],
                  'pearl-millet': [
                    { date: 'Mon', price: 2100 },
                    { date: 'Tue', price: 2150 },
                    { date: 'Wed', price: 2120 },
                    { date: 'Thu', price: 2200 },
                    { date: 'Fri', price: 2250 },
                    { date: 'Sat', price: 2280 },
                    { date: 'Sun', price: 2300 },
                  ],
                  'wheat': [
                    { date: 'Mon', price: 2400 },
                    { date: 'Tue', price: 2420 },
                    { date: 'Wed', price: 2450 },
                    { date: 'Thu', price: 2480 },
                    { date: 'Fri', price: 2500 },
                    { date: 'Sat', price: 2520 },
                    { date: 'Sun', price: 2550 },
                  ]
                }[selectedCrop] || []} 
              />

              {/* AI Crop Recommendations */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="font-semibold text-lg mb-4">Top Crop Recommendations for Your Farm</h2>
                {advisor?.crops?.length ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {advisor.crops.map((crop, i) => (
                      <div
                        key={i}
                        className="group rounded-lg border bg-gradient-to-br from-card to-secondary/20 p-5 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {crop.name}
                          </h3>
                          <Sprout className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{crop.rationale}</p>
                        {crop.expectedYieldIncreaseX && (
                          <div className="flex items-center gap-2 text-sm font-medium text-primary">
                            <TrendingUp className="h-4 w-4" />
                            Potential Yield: {crop.expectedYieldIncreaseX}x
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                        >
                          View Planting Guide
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Loading recommendations...</div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 sm:grid-cols-3">
                <button
                  onClick={() => setScannerOpen(true)}
                  className="rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 p-6 hover:shadow-lg hover:border-primary transition-all text-left group"
                >
                  <Camera className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-lg mb-2">Scan for Disease</h3>
                  <p className="text-sm text-muted-foreground">Upload leaf images for AI diagnosis</p>
                </button>

                <Link
                  href="/resources"
                  className="rounded-lg border bg-gradient-to-br from-accent/20 to-accent/10 p-6 hover:shadow-lg hover:border-primary transition-all group"
                >
                  <Store className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-lg mb-2">Find Nearby Resources</h3>
                  <p className="text-sm text-muted-foreground">Locate seed & fertilizer stores</p>
                </Link>

                <Link
                  href="/market"
                  className="rounded-lg border bg-gradient-to-br from-secondary/30 to-secondary/15 p-6 hover:shadow-lg hover:border-primary transition-all group"
                >
                  <BarChart3 className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-lg mb-2">Explore Market & Buyers</h3>
                  <p className="text-sm text-muted-foreground">Check prices and connect with buyers</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CropScannerModal open={scannerOpen} onOpenChange={setScannerOpen} />
    </>
  )
}
