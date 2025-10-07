import { Nav } from "@/components/nav"

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <h1 className="text-xl font-semibold">Business Summary</h1>
        <section className="space-y-3">
          <h2 className="font-medium">Problem</h2>
          <p className="text-pretty text-muted-foreground">
            Farmers face uncertain weather, pests, fragmented markets, and limited access to expert advice, leading to
            suboptimal yields and income volatility.
          </p>
          <h2 className="font-medium">Solution</h2>
          <p className="text-pretty text-muted-foreground">
            Kishan360 provides geo-intelligent mapping, climate insights, GenAI advisory, and computer vision crop
            scanning to deliver daily, actionable recommendations and connect farmers with markets and local resources.
          </p>
          <h2 className="font-medium">AI Differentiators</h2>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>Geo-contextual advisory combining climate, soil (optional), and location.</li>
            <li>Vision-based pest/disease detection with instant remediation steps.</li>
            <li>Continuous learning loops from outcomes and feedback.</li>
          </ul>
          <h2 className="font-medium">Scalability</h2>
          <p className="text-pretty text-muted-foreground">
            Serverless APIs, modular AI providers, and cloud databases allow global scale with localized models and
            content.
          </p>
          <h2 className="font-medium">Impact</h2>
          <p className="text-pretty text-muted-foreground">
            Targeting 3–4x yield improvements, improved income stability, and sustainable resource use with data-driven
            decisions.
          </p>
        </section>

        <section>
          <h2 className="font-medium mb-2">System Architecture</h2>
          <img
            src="/images/kishan360-architecture.jpg"
            alt="Kishan360 architecture diagram: clients (web/mobile) → backend → AI layer → external APIs and DB with feedback loops."
            className="rounded-md border"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Clients (Web/Mobile) → Backend → AI Layer → APIs (Maps, Weather, Market) → Database (Firestore/Mongo).
            Feedback loops for continuous learning.
          </p>
        </section>
      </main>
    </>
  )
}
