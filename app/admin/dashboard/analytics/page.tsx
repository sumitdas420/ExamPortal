'use client';

import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function AnalyticsPage() {
  // Placeholder data (replace with API data later)
  const [growthData, setGrowthData] = useState([
    { month: 'Jan', percentile: 45 },
    { month: 'Feb', percentile: 52 },
    { month: 'Mar', percentile: 58 },
    { month: 'Apr', percentile: 63 },
    { month: 'May', percentile: 69 },
    { month: 'Jun', percentile: 72 },
    { month: 'Jul', percentile: 77 },
  ]);

  const [topPercentilers, setTopPercentilers] = useState([
    { name: 'Aryan Gupta', exam: 'CAT', percentile: 99.91 },
    { name: 'Sneha Rathi', exam: 'XAT', percentile: 99.75 },
    { name: 'Kunal Mehta', exam: 'SNAP', percentile: 99.5 },
    { name: 'Priya Sinha', exam: 'CMAT', percentile: 99.4 },
    { name: 'Rohit Das', exam: 'NMAT', percentile: 99.2 },
  ]);

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
        </div>

        {/* Percentile Growth Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Student Percentile Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentile" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Percentilers List */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Percentilers</h3>
          <ul className="space-y-3">
            {topPercentilers.map((student, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="font-medium text-gray-800">
                  {student.name} — <span className="text-sm text-gray-500">{student.exam}</span>
                </div>
                <span className="text-blue-600 font-semibold">{student.percentile}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
