// File: components/WeatherSummary.tsx

"use client";

import useSWR from "swr";
import { getSavedFarmLocation, getBrowserLocation } from "@/lib/utils-client";
import { useEffect, useState } from "react";

// You might need to define this type in your lib/types.ts file
type AdvisorWeatherData = {
    locationName: string;
    current: {
        tempC: number;
        condition: string;
        humidity: number;
    };
    alerts: {
        type: string;
        message: string;
    }[];
    forecast: {
        date: string;
        tempC: number;
        condition: string;
    }[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function WeatherSummary() {
    const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({});

    useEffect(() => {
        // First, try to get a saved location, then fall back to browser location
        const saved = getSavedFarmLocation();
        if (saved) {
            setCoords(saved);
        } else {
            getBrowserLocation().then((c) => c && setCoords(c));
        }
    }, []);

    const { data: weather, error, isLoading } = useSWR<AdvisorWeatherData>(
        coords.lat != null && coords.lon != null ? `/api/weather-summary?lat=${coords.lat}&lon=${coords.lon}` : null,
        fetcher
    );

    if (isLoading) {
        return <div className="p-4 bg-white rounded-lg shadow">Loading weather...</div>;
    }
    if (error || !weather) {
        return <div className="p-4 bg-white rounded-lg shadow text-red-500">Could not load weather data.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="font-bold text-xl text-gray-800">Live Weather Summary</h2>
            <p className="text-sm text-gray-500">{weather.locationName}</p>

            <div className="mt-4 text-center">
                <p className="text-6xl font-bold text-gray-900">{weather.current.tempC}°C</p>
                <p className="text-lg text-gray-600">{weather.current.condition}</p>
            </div>

            {weather.alerts && weather.alerts.length > 0 && (
                <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                    <p className="font-bold">Alert</p>
                    <p>{weather.alerts[0].message}</p>
                </div>
            )}

            <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">5-Day Forecast</h3>
                <div className="flex justify-between space-x-2">
                    {weather.forecast.map((day) => (
                        <div key={day.date} className="flex-1 text-center bg-gray-100 p-2 rounded-lg">
                            <p className="font-bold text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className="text-lg font-semibold">{day.tempC}°</p>
                            <p className="text-xs text-gray-500">{day.condition}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}