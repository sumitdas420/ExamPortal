// components/AdminTools.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function AdminTools() {
  const [emailToPromote, setEmailToPromote] = useState('');
  const [promotionStatus, setPromotionStatus] = useState('');
  const [enrollments] = useState([
    { exam: 'CAT', students: 512 },
    { exam: 'XAT', students: 214 },
    { exam: 'CMAT', students: 123 },
    { exam: 'SNAP', students: 88 },
    { exam: 'NMAT', students: 103 }
  ]);

  const handlePromote = async () => {
    try {
      // 🔧 API will be wired later
      // await fetch('/api/admin/promote', { method: 'POST', body: JSON.stringify({ email: emailToPromote }) });
      setPromotionStatus(`✅ ${emailToPromote} promoted to admin`);
      setEmailToPromote('');
    } catch {
      setPromotionStatus(`❌ Failed to promote ${emailToPromote}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Promote Admin Section */}
      <Card>
        <CardHeader>
          <CardTitle>Promote User to Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="email"
            placeholder="Enter email to promote"
            className="w-full border px-3 py-2 rounded mb-3"
            value={emailToPromote}
            onChange={(e) => setEmailToPromote(e.target.value)}
          />
          <button
            onClick={handlePromote}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Promote
          </button>
          {promotionStatus && <p className="mt-2 text-sm text-green-600">{promotionStatus}</p>}
        </CardContent>
      </Card>

      {/* Enrollment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Student Enrollments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {enrollments.map(({ exam, students }) => (
            <div key={exam} className="flex justify-between text-sm">
              <span>{exam}</span>
              <span className="font-medium">{students} students</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
