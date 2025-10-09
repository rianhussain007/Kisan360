"use client"
import useSWR from "swr"
import { getBrowserLocation, getSavedFarmLocation } from "@/lib/utils-client"
import { MapView } from "@/components/map-view"
import type { AdvisorRecommendation, HistoryPayload } from "@/lib/types"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
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

// Type definitions that match our API responses
interface CropRecommendation {
  name: string;
  rationale: string;
  expectedYieldIncreaseX?: number;
}

interface AdvisorResponse {
  crops: CropRecommendation[];
  summary: string;
}

interface HistoryResponse {
  months: Array<{
    date: string;
    tempC: number;
    rainfallMm: number;
  }>;
  seasonalRecommendations: string[];
}

const fetcher = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

function toDMS(lat: number | undefined, lon: number | undefined): string {
  if (lat === undefined || lon === undefined) return 'Location not available';
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
  const [actionItems, setActionItems] = useState<Array<{id: string; task: string; done: boolean}>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true;
    
    const getLocation = async () => {
      try {
        const saved = getSavedFarmLocation();
        if (saved) {
          if (mounted) setCoords({ lat: saved.lat, lon: saved.lon });
        } else {
          const loc = await getBrowserLocation();
          if (mounted && loc) setCoords({ lat: loc.lat, lon: loc.lon });
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocation();
    
    return () => {
      mounted = false;
    };
  }, [setCoords]);

  // Fetch advisor recommendations
  const { data: advisor } = useSWR<AdvisorResponse>(
    coords.lat != null && coords.lon != null 
      ? `/api/advisor?lat=${coords.lat}&lon=${coords.lon}`
      : null,
    fetcher
  );

  // Fetch weather history
  const { data: history } = useSWR<HistoryResponse>(
    coords.lat != null && coords.lon != null
      ? `/api/weather/history?lat=${coords.lat}&lon=${coords.lon}`
      : null,
    fetcher
  );

  const fetchActionItems = useCallback(async () => {
    if (!coords.lat || !coords.lon) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: coords.lat,
          lon: coords.lon,
          crop: selectedCrop,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch action items');
      }

      const data = await response.json();
      setActionItems(data.items.map((item: string, index: number) => ({
        id: `item-${index}`,
        task: item,
        done: false
      })));
    } catch (error) {
      console.error('Error fetching action items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [coords.lat, coords.lon, selectedCrop]);

  useEffect(() => {
    if (coords.lat && coords.lon) {
      fetchActionItems();
    }
  }, [coords.lat, coords.lon, selectedCrop, fetchActionItems]);

  const toggleTask = (id: string) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your farm.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Farm Overview */}
          <div className="space-y-6">
            {/* Farm Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Farm Overview</h2>
                </div>
                
                <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                  <MapView lat={coords.lat} lon={coords.lon} height={200} />
                </div>
                
                <div className="space-y-3">
                  {coords.lat != null && coords.lon != null ? (
                    <>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-mono text-gray-700">
                          {toDMS(coords.lat, coords.lon)}
                        </p>
                      </div>
                      <Link href="/farm">
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Manage Farm Details
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600">
                        No location set.{" "}
                        <Link href="/farm" className="text-blue-600 hover:underline">
                          Set it now
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seasonal Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Sprout className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Key Seasonal Tasks</h2>
                </div>
                
                <div className="space-y-3">
                  {history?.seasonalRecommendations?.length ? (
                    <ul className="space-y-3">
                      {history.seasonalRecommendations.slice(0, 3).map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Analyzing climate patterns...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Weather + Market */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather Summary */}
            <WeatherSummary />
          </div>
        </div>

        {/* AI Crop Recommendations */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Crop Recommendations for Your Farm</h2>
          {advisor?.crops?.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {advisor.crops.map((crop, i) => (
                <div
                  key={i}
                  className="group rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 p-5 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {crop.name}
                    </h3>
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{crop.rationale}</p>
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
            <div className="text-sm text-gray-600">Loading recommendations...</div>
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
            <p className="text-sm text-gray-600">Upload leaf images for AI diagnosis</p>
          </button>

          <Link
            href="/resources"
            className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-6 hover:shadow-lg hover:border-primary transition-all group"
          >
            <Store className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-2">Find Nearby Resources</h3>
            <p className="text-sm text-gray-600">Locate seed & fertilizer stores</p>
          </Link>

          <Link
            href="/market"
            className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-6 hover:shadow-lg hover:border-primary transition-all group"
          >
            <BarChart3 className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-2">Explore Market & Buyers</h3>
            <p className="text-sm text-gray-600">Check prices and connect with buyers</p>
          </Link>
        </div>
      </div>
      <CropScannerModal open={scannerOpen} onOpenChange={setScannerOpen} />
    </div>
  )
}
