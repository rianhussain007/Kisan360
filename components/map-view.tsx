"use client"

type Props = {
  lat?: number
  lon?: number
  height?: number
}

export function MapView({ lat, lon, height = 320 }: Props) {
  if (lat == null || lon == null) {
    return (
      <div
        className="w-full rounded-md border bg-muted flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        Set or detect your farm location to see the map.
      </div>
    )
  }
  const src = `https://maps.google.com/maps?q=${lat},${lon}&z=14&output=embed`
  return (
    <div className="w-full rounded-md overflow-hidden border" style={{ height }}>
      <iframe
        title="Farm Map"
        src={src}
        className="w-full h-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
