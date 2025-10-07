"use client"

import type React from "react"
import { useState } from "react"
import { saveLastVisionResult } from "@/lib/utils-client"
import { Upload, Camera, AlertCircle, CheckCircle2 } from "lucide-react"

export function UploadImage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    setFile(f ?? null)
    setResult(null)
    setError(null)
    if (f) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  async function onSubmit() {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("image", file)
      const res = await fetch("/api/vision", { method: "POST", body: fd })
      if (!res.ok) throw new Error(`Scan failed: ${res.status}`)
      const json = await res.json()
      setResult(json)
      saveLastVisionResult(json)
    } catch (e: any) {
      setError(e?.message || "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-6 hover:bg-primary/10 transition-colors h-32">
            <Upload className="h-8 w-8 text-primary" />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Upload Photo</p>
              <p className="text-xs text-muted-foreground">From gallery</p>
            </div>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onSelect}
            disabled={loading}
          />
        </label>

        <label htmlFor="camera-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-primary bg-primary p-6 hover:bg-primary/90 transition-colors h-32">
            <Camera className="h-8 w-8 text-primary-foreground" />
            <div className="text-center">
              <p className="text-sm font-semibold text-primary-foreground">Take Photo</p>
              <p className="text-xs text-primary-foreground/80">Use camera</p>
            </div>
          </div>
          <input
            id="camera-upload"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onSelect}
            disabled={loading}
          />
        </label>
      </div>

      {preview && (
        <div className="rounded-lg border overflow-hidden">
          <img
            src={preview || "/placeholder.svg"}
            alt="Selected crop"
            className="w-full max-h-64 object-contain bg-muted"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={!file || loading}
          className="rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium disabled:opacity-60 hover:bg-primary/90 transition-colors"
        >
          {loading ? "Scanning..." : "Scan Image"}
        </button>
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="rounded-lg border p-4 bg-card space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Scan Result</h3>
          </div>
          {result.detections?.map((d: any, i: number) => (
            <div key={i} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{d.label}</span>
                <span className="text-sm text-muted-foreground">{Math.round(d.confidence * 100)}% confidence</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Severity: </span>
                <span
                  className={
                    d.severity === "high"
                      ? "text-destructive"
                      : d.severity === "medium"
                        ? "text-orange-600"
                        : "text-green-600"
                  }
                >
                  {d.severity}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Recommendation: </span>
                {d.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
