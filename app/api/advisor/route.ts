import { NextRequest } from "next/server"
import type { AdvisorRecommendation } from "@/lib/types"

// If you want to enable AI, uncomment and configure the model:
// import { generateText } from 'ai'
// const MODEL = 'openai/gpt-5-mini' // Uses Vercel AI Gateway by default

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  void lat
  void lon

  // Example AI usage (commented):
  // const { text } = await generateText({
  //   model: MODEL,
  //   prompt: `Recommend 3 crops for coordinates (${lat}, ${lon}) considering climate resilience, include one-line rationale each.`,
  // })

  const rec: AdvisorRecommendation = {
    summary: "Based on recent weather trends and geo-context, consider these resilient crops for the coming season.",
    crops: [
      {
        name: "Sorghum",
        rationale: "Heat and drought tolerant; stable yields under variability.",
        expectedYieldIncreaseX: 3,
      },
      { name: "Chickpea", rationale: "Fits rabi season; good market demand; moderate water needs." },
      {
        name: "Pearl Millet",
        rationale: "Performs in marginal soils; resilient to dry spells.",
        expectedYieldIncreaseX: 4,
      },
    ],
  }
  return Response.json(rec)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  void body
  // Process soil info or custom parameters if supplied
  return GET(new NextRequest(new URL("/api/advisor", req.url)))
}
