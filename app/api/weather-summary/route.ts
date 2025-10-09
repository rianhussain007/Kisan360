import { NextRequest, NextResponse } from "next/server";

// Helper function to process the complex forecast data from the API
const processForecast = (forecastData: any) => {
    const dailyForecasts: { date: string; tempC: number; condition: string }[] = [];
    const forecastByDay: { [key: string]: any[] } = {};

    // Group the 3-hour forecasts by day
    forecastData.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0]; // Get just the date part
        if (!forecastByDay[date]) {
            forecastByDay[date] = [];
        }
        forecastByDay[date].push(item);
    });

    // Process each day's data
    for (const date in forecastByDay) {
        const dayData = forecastByDay[date];
        const avgTemp = dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;
        const condition = dayData[0]?.weather[0]?.main || 'Clear';

        dailyForecasts.push({
            date: date,
            tempC: Math.round(avgTemp),
            condition: condition,
        });
    }
    // Return only the next 5 days
    return dailyForecasts.slice(0, 5);
};

// Helper function to generate alerts based on the forecast
const generateAlerts = (forecast: { condition: string }[]) => {
    const alerts = [];
    const hasRain = forecast.some(day => day.condition === 'Rain');
    if (!hasRain) {
        alerts.push({
            type: "drought",
            message: "Low rainfall expected over the next 5 days. Monitor irrigation needs."
        });
    }
    return alerts;
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ detail: "Latitude and longitude are required." }, { status: 400 });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ detail: "Weather API key not configured." }, { status: 500 });
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const [currentWeatherRes, forecastRes] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentWeatherRes.ok || !forecastRes.ok) {
            throw new Error('Failed to fetch weather or forecast data');
        }

        const currentWeatherData = await currentWeatherRes.json();
        const forecastData = await forecastRes.json();
        
        const processedForecast = processForecast(forecastData);
        const alerts = generateAlerts(processedForecast);

        const finalResponse = {
            locationName: currentWeatherData.name,
            current: {
                tempC: Math.round(currentWeatherData.main.temp),
                condition: currentWeatherData.weather[0]?.main || 'Clear',
                humidity: currentWeatherData.main.humidity,
            },
            alerts: alerts,
            forecast: processedForecast,
        };

        return NextResponse.json(finalResponse, { status: 200 });

    } catch (error) {
        console.error("Error in Weather Summary API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json({ detail: `Error fetching weather data: ${errorMessage}` }, { status: 500 });
    }
}
