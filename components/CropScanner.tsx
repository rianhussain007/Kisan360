'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Loader2, Leaf } from 'lucide-react';

interface ClassMap {
  [key: string]: string;
}

interface Prediction {
  label: string;
  confidence: string;
}

const CropScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [classMap, setClassMap] = useState<ClassMap>({});
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load model + class names
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Try WebGL first
        try {
          await tf.setBackend('webgl');
        } catch (backendError) {
          console.warn('WebGL backend failed, trying CPU:', backendError);
          await tf.setBackend('cpu');
        }
        await tf.ready();
        const [loadedModel, classResponse] = await Promise.all([
          tf.loadLayersModel('/model/tensorflowjs-model/model.json'),
          fetch('/model/class_indices.json').then(res => res.json())
        ]);

        setModel(loadedModel);
        setClassMap(classResponse);

        // Warm up the model
        const dummyInput = tf.zeros([1, 224, 224, 3]);
        await loadedModel.predict(dummyInput);
        dummyInput.dispose();

      } catch (err) {
        console.error('Model load error:', err);
        setError('Failed to load the AI model. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadModel();

    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, []);

  // Setup camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        if (!navigator.mediaDevices) {
          throw new Error('Camera access not supported on this device');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError('Could not access the camera. Please check your permissions.');
      }
    };

    if (!loading) {
      setupCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [loading]);

  // Scan Crop Logic
  const scanCrop = async () => {
    if (!model || !videoRef.current) return;

    try {
      const video = videoRef.current;
      setLoading(true);
      setPrediction(null);

      // Preprocess the image
      const tensor = tf.tidy(() => {
        return tf.browser.fromPixels(video)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(tf.scalar(255))
          .expandDims();
      });

      // Make prediction
      const preds = model.predict(tensor) as tf.Tensor;
      const data = await preds.data();

      // Find the top prediction
      const maxIdx = Array.from(data).indexOf(Math.max(...Array.from(data)));
      const label = classMap[maxIdx.toString()] || 'Unknown';

      setPrediction({
        label: label,
        confidence: (data[maxIdx] * 100).toFixed(2),
      });

      // Cleanup
      tf.dispose([tensor, preds]);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Error making prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md w-full">
          <h2 className="font-semibold text-lg mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
          <Leaf className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">AI Crop Health Scanner</h1>
        <p className="text-gray-600 mt-1">Scan plant leaves to detect potential diseases</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative aspect-[4/3] bg-black">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
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

        <div className="p-4">
          <button
            onClick={scanCrop}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              loading
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Analyzing...
              </span>
            ) : (
              'Scan Crop'
            )}
          </button>

          {prediction && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Scan Result</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Condition:</span> {prediction.label}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Confidence:</span>
                    <span>{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>For best results, ensure good lighting and focus on a single leaf.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropScanner;
