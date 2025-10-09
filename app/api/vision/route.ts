import { NextRequest, NextResponse } from "next/server";

// Inline crop diseases data
const cropDiseases = {
  diseases: [
    {
      id: 1,
      name: "Tomato Blight",
      symptoms: ["brown spots", "yellow leaves", "white mold"],
      description: "A common fungal disease affecting tomato plants, causing leaf spots and fruit rot.",
      recommendation: "Remove and destroy infected plants. Apply copper-based fungicides. Ensure good air circulation and avoid overhead watering.",
      severity: "high"
    },
    {
      id: 2,
      name: "Powdery Mildew",
      symptoms: ["white powder", "yellow leaves", "stunted growth"],
      description: "Fungal disease that forms a white powdery coating on leaves and stems.",
      recommendation: "Apply sulfur or potassium bicarbonate-based fungicides. Remove affected leaves. Improve air circulation.",
      severity: "medium"
    },
    {
      id: 3,
      name: "Leaf Spot",
      symptoms: ["brown spots", "yellow halos", "leaf drop"],
      description: "Fungal or bacterial disease causing circular spots on leaves.",
      recommendation: "Remove infected leaves. Apply appropriate fungicide. Avoid overhead watering.",
      severity: "medium"
    },
    {
      id: 4,
      name: "Aphid Infestation",
      symptoms: ["curled leaves", "sticky residue", "black sooty mold"],
      description: "Small insects that suck sap from plants, causing distorted growth.",
      recommendation: "Spray with insecticidal soap or neem oil. Introduce natural predators like ladybugs.",
      severity: "low"
    },
    {
      id: 5,
      name: "Root Rot",
      symptoms: ["wilting", "yellow leaves", "black roots"],
      description: "Fungal disease that affects the roots, often due to overwatering.",
      recommendation: "Improve soil drainage. Reduce watering. Apply fungicide if caught early.",
      severity: "high"
    }
  ]
};

// Function to get a random disease from the JSON data
function getRandomDisease() {
  try {
    const diseases = cropDiseases.diseases;
    // Return a random disease
    return diseases[Math.floor(Math.random() * diseases.length)];
  } catch (error) {
    console.error('Error getting disease data:', error);
    // Return a default response if there's an error
    return {
      name: 'Unknown Plant Issue',
      description: 'Could not determine the specific issue with the plant.',
      recommendation: 'Please consult with a local agricultural expert for a proper diagnosis.',
      severity: 'medium'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get a random disease from our local JSON data
    const disease = await getRandomDisease();
    
    // Simulate a confidence score (since we're not actually analyzing the image)
    const confidence = Math.random() * 0.5 + 0.5; // Random score between 0.5 and 1.0
    
    // Format the response to match the frontend's expectations
    const responsePayload = {
      status: "success",
      detections: [
        {
          label: disease.name,
          confidence: confidence,
          severity: disease.severity || 'medium',
          recommendation: disease.recommendation || 'No specific recommendation available.',
          description: disease.description || ''
        }
      ]
    };
    
    // Add a small delay to simulate processing time (500ms instead of 1000ms for better UX)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(responsePayload, { status: 200 });
    
  } catch (error) {
    console.error("Error in /api/vision:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    
    // Return a fallback response in case of error
    const fallbackResponse = {
      status: "success",
      detections: [
        {
          label: "Unknown Plant Issue",
          confidence: 0.3,
          severity: "medium",
          recommendation: "Could not determine the specific issue. Please try with a clearer image or consult a local expert.",
          description: "The plant's issue could not be determined from the provided image."
        }
      ]
    };
    
    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}
