import type { NextRequest } from "next/server"
import type { FarmLocation } from "@/lib/types"

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Partial<FarmLocation> | null
  if (!body?.lat || !body?.lon) {
    return new Response(JSON.stringify({ error: "lat/lon required" }), { status: 400 })
  }
  // TODO: Save to Firestore or MongoDB Atlas here. For now, echo back.
  const payload: FarmLocation = { lat: body.lat, lon: body.lon, savedAt: new Date().toISOString() }
  return Response.json(payload)
}
