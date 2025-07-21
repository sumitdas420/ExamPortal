'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ✅ Fixed import path
const TestCreator = dynamic(() => import('@/components/TestCreator'));

const exams = ['CAT', 'XAT', 'CMAT', 'SNAP', 'NMAT'];

export default function ExamTabs() {
  const [selectedExam, setSelectedExam] = useState(exams[0]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>📘 Select Exam</CardTitle>
        <TabsList className="flex flex-wrap gap-2 mt-2">
          {exams.map((exam) => (
            <TabsTrigger
              key={exam}
              value={exam}
              onClick={() => setSelectedExam(exam)}
            >
              {exam}
            </TabsTrigger>
          ))}
        </TabsList>
      </CardHeader>

      <CardContent>
        <TestCreator exam={selectedExam} />
      </CardContent>
    </Card>
  );
}
