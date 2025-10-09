import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { lat, lon, crop, date } = await request.json();

    // Get location details using reverse geocoding
    const locationResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const locationData = await locationResponse.json();
    const locationName = locationData.results[0]?.formatted_address || 'your location';

    // Get weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    // Generate action items using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate a daily action checklist for a farmer growing ${crop} in ${locationName}.
    Current weather: ${weatherData.weather[0]?.description}, ${weatherData.main?.temp}°C
    
    Provide 5-7 specific, actionable items based on:
    1. The current season and weather conditions
    2. Common agricultural practices for ${crop}
    3. The growth stage of ${crop} at this time of year
    
    Format the response as a JSON array of strings, like this:
    ["Task 1", "Task 2", "Task 3"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const items = JSON.parse(cleanedText);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error generating checklist:', error);
    // Return default checklist in case of error
    return NextResponse.json({
      items: [
        "Check soil moisture levels",
        "Inspect for pests and diseases",
        "Water the crops as needed",
        "Apply fertilizers if required",
        "Monitor weather forecast"
      ]
    });
  }
}
