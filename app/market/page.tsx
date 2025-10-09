// File: app/market/page.tsx - Market Buyers

"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav } from "@/components/nav";

type BuyerRecord = {
    id: string;
    name: string;
    location: string;
    pricePerQuintal: number;
    trend: 'up' | 'down' | 'stable';
    contactUrl?: string;
};

const MarketPage = () => {
    const pathname = usePathname();
    const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Helper function to check if a nav item is active
    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    // Load buyer data on component mount
    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const response = await fetch('/market-data.json');
                if (!response.ok) {
                    throw new Error('Failed to load buyer data');
                }
                const data = await response.json();
                setBuyers(data);
            } catch (err) {
                console.error('Error loading buyer data:', err);
                setError('Failed to load buyer data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBuyers();
    }, []);

    // Filter buyers based on search term
    const filteredBuyers = useMemo(() => {
        if (!searchTerm.trim()) return buyers;
        const term = searchTerm.toLowerCase();
        return buyers.filter(buyer => 
            buyer.name.toLowerCase().includes(term) || 
            buyer.location.toLowerCase().includes(term)
        );
    }, [buyers, searchTerm]);

    // Get trend icon and color
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                );
            case 'down':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                );
        }
    };

    return (
        <>
            <Nav />
            <main className="mx-auto max-w-7xl px-4 py-6 space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                    <p className="text-gray-600">Connect with buyers and track market trends</p>
                </div>

                {/* Market Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-6" aria-label="Market navigation">
                        <Link 
                            href="/market" 
                            className={`relative py-3 px-1 font-medium text-sm flex items-center border-b-2 transition-colors ${
                                isActive('/market') 
                                    ? 'text-green-600 border-green-600' 
                                    : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'
                            }`}
                        >
                            <span className="flex items-center">
                                <svg className="mr-2 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Buyers
                            </span>
                        </Link>
                        <Link 
                            href="/market/prices" 
                            className={`relative py-3 px-1 font-medium text-sm flex items-center border-b-2 transition-colors ${
                                isActive('/market/prices') 
                                    ? 'text-amber-600 border-amber-600' 
                                    : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'
                            }`}
                        >
                            <span className="flex items-center">
                                <svg className="mr-2 h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Price Trends
                            </span>
                        </Link>
                        <Link 
                            href="/market/analysis" 
                            className={`relative py-3 px-1 font-medium text-sm flex items-center border-b-2 transition-colors ${
                                isActive('/market/analysis') 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'
                            }`}
                        >
                            <span className="flex items-center">
                                <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Market Analysis
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Search buyers by name or location..."
                    />
                </div>

                {/* Buyers List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    ) : filteredBuyers.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 0118 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No buyers found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBuyers.map((buyer) => (
                                <div key={buyer.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{buyer.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{buyer.location}</p>
                                        </div>
                                        <div className="flex items-center">
                                            {getTrendIcon(buyer.trend)}
                                            <span className="ml-1 text-sm font-medium text-gray-700">
                                                {buyer.trend}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <div className="flex items-baseline">
                                            <span className="text-3xl font-light text-gray-800">
                                                ₹{buyer.pricePerQuintal.toLocaleString()}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-500">per quintal</span>
                                        </div>
                                    </div>

                                    {buyer.contactUrl && (
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <a 
                                                href={buyer.contactUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                                            >
                                                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Contact Buyer
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default MarketPage;