import type { DailyAdvisor } from "@/lib/types"

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)
  const payload: DailyAdvisor = {
    date: today,
    weatherNote: "Light showers in the evening; plan irrigation accordingly.",
    tasks: [
      { id: "t1", title: "Inspect for aphids on lower leaves", done: false },
      { id: "t2", title: "Top-dress nitrogen on wheat (as per schedule)", done: true },
      { id: "t3", title: "Mulch around seedlings to retain moisture", done: false },
    ],
    tipOfTheDay: "Use mulching to reduce evaporation and suppress weeds, improving water efficiency.",
  }
  return Response.json(payload)
}
