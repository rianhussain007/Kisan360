import type { NextRequest } from "next/server"
import type { ResourcePlace } from "@/lib/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get("lat") ?? 0)
  const lon = Number(searchParams.get("lon") ?? 0)
  void lat
  void lon

  // If you have GOOGLE_MAPS_API_KEY, call Places Nearby here.

  const data: Array<ResourcePlace> = [
    {
      id: "p1",
      name: "GreenField Seeds",
      type: "seed",
      distanceKm: 5.2,
      rating: 4.4,
      directionsUrl: "https://maps.google.com",
    },
    {
      id: "p2",
      name: "AgriMart Fertilizers",
      type: "fertilizer",
      distanceKm: 8.1,
      rating: 4.1,
      directionsUrl: "https://maps.google.com",
    },
  ]
  return Response.json(data)
}
