import type { NextRequest } from "next/server"
import type { MarketBuyer } from "@/lib/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const crop = searchParams.get("crop") || "Wheat"
  void crop

  const buyers: Array<MarketBuyer> = [
    { id: "b1", name: "Shivaji Traders", location: "Nagpur Mandi", pricePerQuintal: 2300, trend: "up" },
    {
      id: "b2",
      name: "eNAM Buyer #42",
      location: "Online",
      pricePerQuintal: 2250,
      trend: "stable",
      contactUrl: "https://enam.gov.in",
    },
  ]
  return Response.json(buyers)
}
