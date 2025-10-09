"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import * as tf from '@tensorflow/tfjs'

interface ClassMap {
  [key: string]: string;
}

interface Prediction {
  label: string;
  confidence: string;
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CropScannerModal({ open, onOpenChange }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [model, setModel] = useState<tf.GraphModel | null>(null)
  const [classMap, setClassMap] = useState<ClassMap>({})
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Load model + class names
  useEffect(() => {
    if (!open) return

    const loadModel = async () => {
      try {
        setModelLoading(true)
        setError(null)
        await tf.setBackend('webgl')
        await tf.ready()
        const [loadedModel, classResponse] = await Promise.all([
          tf.loadGraphModel('/tensorflow_model/model.json'),
          fetch('/model/class_indices.json').then(res => res.json())
        ])

        setModel(loadedModel)
        setClassMap(classResponse)

        // Warm up the model
        const dummyInput = tf.zeros([1, 224, 224, 3])
        await loadedModel.predict(dummyInput)
        dummyInput.dispose()

      } catch (err) {
        console.error('Model load error:', err)
        setError('Failed to load the AI model. Please try again later.')
      } finally {
        setModelLoading(false)
      }
    }

    loadModel()
  }, [open])

  // Setup camera
  useEffect(() => {
    if (!open || modelLoading) return

    const setupCamera = async () => {
      try {
        if (!navigator.mediaDevices) {
          throw new Error('Camera access not supported on this device')
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })

        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          await videoRef.current.play()
        }
      } catch (err) {
        console.error('Camera error:', err)
        setError('Could not access the camera. Please check your permissions.')
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }
  }, [open, modelLoading])

  // Cleanup on modal close
  useEffect(() => {
    if (!open) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
      if (model) {
        model.dispose()
        setModel(null)
      }
      setPrediction(null)
      setError(null)
      setModelLoading(true)
    }
  }, [open, stream, model])

  const scanCrop = async () => {
    if (!model || !videoRef.current) return

    try {
      setLoading(true)
      setPrediction(null)
      setError(null)

      const video = videoRef.current

      // Preprocess the image
      const tensor = tf.tidy(() => {
        return tf.browser.fromPixels(video)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(tf.scalar(255))
          .expandDims()
      })

      // Make prediction
      const preds = model.predict(tensor) as tf.Tensor
      const data = await preds.data()

      // Find the top prediction
      const maxIdx = Array.from(data).indexOf(Math.max(...Array.from(data)))
      const label = classMap[maxIdx.toString()] || 'Unknown'

      setPrediction({
        label: label,
        confidence: (data[maxIdx] * 100).toFixed(2),
      })

      // Cleanup
      tf.dispose([tensor, preds])
    } catch (err) {
      console.error('Prediction error:', err)
      setError('Error making prediction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">AI Crop Health Scanner</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md w-full">
              <h2 className="font-semibold text-lg mb-2">Error</h2>
              <p>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="destructive"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {modelLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Loading AI model...</p>
                  </div>
                </div>
              ) : loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing...</p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              )}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={scanCrop}
                disabled={loading || modelLoading || !model}
                className="w-full max-w-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  'Scan Crop'
                )}
              </Button>
            </div>

            {prediction && (
              <div className="rounded-lg bg-muted/50 p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Scan Result
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Condition:</span> {prediction.label}
                  </p>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence:</span>
                      <span>{prediction.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground text-center">
              <p>For best results, ensure good lighting and focus on a single leaf.</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
