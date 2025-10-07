"use client"

import { useState, type ChangeEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera, AlertCircle, CheckCircle2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { VisionResult } from "@/lib/types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CropScannerModal({ open, onOpenChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<VisionResult | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResult(null)

    const url = URL.createObjectURL(file)
    setImageUrl(url)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setImageUrl(null)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Crop Health Scanner</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {!result ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  {uploading ? "Analyzing image..." : "Drop image here or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground">Upload a clear photo of the plant leaf for AI diagnosis</p>
              </label>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Uploaded Image</h3>
              {imageUrl && (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Uploaded crop"
                  className="w-full rounded-lg border object-cover"
                  style={{ maxHeight: "400px" }}
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Diagnosis Results</h3>
                {result.detections.map((detection, i) => (
                  <div key={i} className="space-y-3 mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-lg">{detection.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round(detection.confidence * 100)}%
                        </p>
                      </div>
                      <Badge
                        variant={
                          detection.severity === "high"
                            ? "destructive"
                            : detection.severity === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {detection.severity === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {detection.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Recommended Actions
                      </h4>
                      <p className="text-sm text-foreground">{detection.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                  Scan Another
                </Button>
                <Button onClick={() => onOpenChange(false)} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
