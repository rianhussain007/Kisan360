"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface PriceDataPoint {
  date: string;
  price: number;
}

type MarketChartProps = {
  data: PriceDataPoint[];
  crop: string;
};

const MarketChart: React.FC<MarketChartProps> = ({ data, crop }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No price data available for {crop}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{crop} Price Trend</h3>
        <span className="text-sm text-gray-500">Last 7 days</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `₹${value}`}
            width={50}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            formatter={(value: number) => [`₹${value}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;