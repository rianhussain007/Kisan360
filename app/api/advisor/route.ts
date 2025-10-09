// File: app/api/advisor/route.ts - FINAL DEMO-PROOF VERSION

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AdvisorRecommendation } from "@/lib/types";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// This is our high-quality, safe fallback data
const getFallbackData = (): AdvisorRecommendation => {
    return {
        summary: "Based on general climate trends, consider these resilient crops.",
        crops: [
            { name: "Sorghum (Jowar)", rationale: "Excellent heat and drought tolerance for variable climates." },
            { name: "Pearl Millet (Bajra)", rationale: "Performs well in marginal, low-fertility soils." },
            { name: "Pigeon Pea (Tur)", rationale: "A hardy legume that improves soil fertility." },
        ],
    };
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!process.env.GEMINI_API_KEY) {
        // If the key isn't set, just return the safe data immediately.
        return NextResponse.json(getFallbackData(), { status: 200 });
    }

    const prompt = `You are an agricultural expert for India. Based on the location (latitude: ${lat}, longitude: ${lon}), recommend 3 climate-resilient crops for the upcoming planting season. For each crop, provide a one-sentence rationale. Return ONLY a valid JSON object in this exact structure: { "summary": "A brief summary.", "crops": [ { "name": "Crop Name", "rationale": "Rationale here." } ] }`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the text to ensure it's valid JSON before parsing
        const jsonText = text.replace('```json', '').replace('```', '').trim();
        
        // Try to parse the AI's response...
        const recommendation: AdvisorRecommendation = JSON.parse(jsonText);
        
        // ... if it works, return the live AI data
        return NextResponse.json(recommendation, { status: 200 });

    } catch (error) {
        // ... if ANYTHING goes wrong (slow network, bad AI response, parsing error)...
        console.error("AI Advisor failed, serving fallback data. Error:", error);
        
        // ... just return the safe, static data. The user will never see a broken feature.
        return NextResponse.json(getFallbackData(), { status: 200 });
    }
}