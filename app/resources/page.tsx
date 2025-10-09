"use client";

import useSWR from "swr";
import { Nav } from "@/components/nav";
import { getSavedFarmLocation, getBrowserLocation } from "@/lib/utils-client";
import type { ResourcePlace } from "@/lib/types";
import { useEffect, useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) {
        throw new Error("Failed to fetch data from the API.");
    }
    return res.json();
});

export default function ResourcesPage() {
    const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({});

    useEffect(() => {
        const saved = getSavedFarmLocation();
        if (saved) {
            setCoords(saved);
        } else {
            getBrowserLocation().then((c) => c && setCoords(c));
        }
    }, []);

    // --- MODIFIED PART ---
    // We now also get the 'error' and 'isLoading' states from useSWR
    const { data, error, isLoading } = useSWR<Array<ResourcePlace>>(
        coords.lat != null && coords.lon != null ? `/api/resources?lat=${coords.lat}&lon=${coords.lon}` : null,
        fetcher
    );

    // --- NEW, ROBUST RENDERING LOGIC ---
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-sm text-muted-foreground">Loading nearby resources…</div>;
        }
        if (error) {
            return <div className="text-sm text-red-500">Error: Could not load resources. Please try again later.</div>;
        }
        // This check is the most important: we make sure data is an array and has items
        if (data && Array.isArray(data) && data.length > 0) {
            return (
                <ul className="grid gap-4 sm:grid-cols-2">
                    {data.map((p) => (
                        <li key={p.id} className="rounded-md border p-4">
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {p.type} • {p.distanceKm.toFixed(1)} km
                            </div>
                            {p.rating ? <div className="text-sm mt-1">Rating: {p.rating}/5</div> : null}
                            {p.directionsUrl ? (
                                <a href={p.directionsUrl} target="_blank" rel="noreferrer" className="text-sm underline mt-2 inline-block">
                                    Get Directions
                                </a>
                            ) : null}
                        </li>
                    ))}
                </ul>
            );
        }
        // If there's no data or it's an empty array
        return <div className="text-sm text-muted-foreground">No nearby agri stores found.</div>;
    };

    return (
        <>
            <Nav />
            <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
                <h1 className="text-xl font-semibold">Nearby Agri Stores</h1>
                {renderContent()}
            </main>
        </>
    );
}