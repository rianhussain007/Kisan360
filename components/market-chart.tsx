"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Props = {
  crop: string
}

// Mock market data
const marketData: Record<string, Array<{ date: string; price: number }>> = {
  sorghum: [
    { date: "Mon", price: 2850 },
    { date: "Tue", price: 2920 },
    { date: "Wed", price: 2880 },
    { date: "Thu", price: 2950 },
    { date: "Fri", price: 3020 },
    { date: "Sat", price: 3100 },
    { date: "Sun", price: 3150 },
  ],
  chickpea: [
    { date: "Mon", price: 5200 },
    { date: "Tue", price: 5150 },
    { date: "Wed", price: 5300 },
    { date: "Thu", price: 5280 },
    { date: "Fri", price: 5400 },
    { date: "Sat", price: 5450 },
    { date: "Sun", price: 5500 },
  ],
  "pearl-millet": [
    { date: "Mon", price: 2100 },
    { date: "Tue", price: 2150 },
    { date: "Wed", price: 2120 },
    { date: "Thu", price: 2200 },
    { date: "Fri", price: 2250 },
    { date: "Sat", price: 2280 },
    { date: "Sun", price: 2300 },
  ],
  wheat: [
    { date: "Mon", price: 2400 },
    { date: "Tue", price: 2420 },
    { date: "Wed", price: 2450 },
    { date: "Thu", price: 2480 },
    { date: "Fri", price: 2500 },
    { date: "Sat", price: 2520 },
    { date: "Sun", price: 2550 },
  ],
}

export function MarketChart({ crop }: Props) {
  const data = marketData[crop] || marketData.sorghum
  const currentPrice = data[data.length - 1].price

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">₹{currentPrice}</span>
        <span className="text-sm text-muted-foreground">per quintal</span>
      </div>
      <p className="text-xs text-muted-foreground">Last 7 days trend from nearest mandi</p>
      <ChartContainer
        config={{
          price: {
            label: "Price",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-[200px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
