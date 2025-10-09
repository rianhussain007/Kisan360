import { NextRequest, NextResponse } from "next/server";
import { Client, Place } from "@googlemaps/google-maps-services-js";
import { haversineDistance } from "@/lib/utils-server";

// Initialize the Google Maps Client
const mapsClient = new Client({});

// Define the shape of our final response object to match your frontend type
type ResourcePlace = {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  rating?: number;
  directionsUrl: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  if (!lat || !lon) {
    return NextResponse.json({ detail: "Latitude and longitude are required." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ detail: "Google Maps API key not configured." }, { status: 500 });
  }

  const keywords = ["seed store", "fertilizer store", "pesticide shop"];
  let allPlaces: (Place & { type?: string })[] = [];

  try {
    // Fetch places for each keyword
    for (const keyword of keywords) {
      const response = await mapsClient.placesNearby({
        params: {
          location: { lat, lng: lon },
          radius: 15000, // 15km radius
          keyword: keyword,
          key: apiKey,
        },
      });
      
      const placesWithKeyword = response.data.results.map(p => ({...p, type: keyword}));
      allPlaces.push(...placesWithKeyword);
    }
    
    // Remove duplicate places by their ID
    const uniquePlaces = Array.from(new Map(allPlaces.map(p => [p.place_id, p])).values());

    // Format the data to match your frontend 'ResourcePlace' type
    const formattedPlaces: ResourcePlace[] = uniquePlaces.map(place => {
      const placeLat = place.geometry?.location.lat ?? 0;
      const placeLon = place.geometry?.location.lng ?? 0;
      
      return {
        id: place.place_id ?? "",
        name: place.name ?? "Unknown Store",
        type: place.type ?? "store",
        distanceKm: haversineDistance({ lat, lon }, { lat: placeLat, lon: placeLon }),
        rating: place.rating,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLon}`,
      };
    });

    // Sort the final list by distance
    formattedPlaces.sort((a, b) => a.distanceKm - b.distanceKm);
    
    return NextResponse.json(formattedPlaces, { status: 200 });

  } catch (error) {
    console.error("Error fetching from Google Maps API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ detail: `Error fetching nearby places: ${errorMessage}` }, { status: 500 });
  }
}
