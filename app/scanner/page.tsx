import { Nav } from "@/components/nav"
import { UploadImage } from "@/components/upload-image"

export default function ScannerPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        <h1 className="text-xl font-semibold">Crop Health Scanner</h1>
        <div className="rounded-md border p-4">
          <UploadImage />
        </div>
        <p className="text-sm text-muted-foreground">
          This POC uses a stubbed Vision API. Replace the /api/vision route with Google Cloud Vision or a HuggingFace
          model and wire environment variables in Project Settings.
        </p>
      </main>
    </>
  )
}
