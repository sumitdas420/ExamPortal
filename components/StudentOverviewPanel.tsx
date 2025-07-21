// components/StudentOverviewPanel.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const mockStudentData = [
  { exam: 'CAT', enrolled: 1200 },
  { exam: 'XAT', enrolled: 800 },
  { exam: 'CMAT', enrolled: 650 },
  { exam: 'SNAP', enrolled: 700 },
  { exam: 'NMAT', enrolled: 560 },
];

export default function StudentOverviewPanel() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {mockStudentData.map(({ exam, enrolled }) => (
        <Card key={exam}>
          <CardHeader>
            <CardTitle>{exam} Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{enrolled}</p>
            <p className="text-sm text-gray-600 mt-1">students enrolled</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
