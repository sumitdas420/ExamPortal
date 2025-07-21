'use client';

import { useState, Suspense, lazy } from 'react';
import clsx from 'clsx';
import ExamSubTabs from './ExamSubTabs';

const EXAMS = ['CAT', 'XAT', 'CMAT', 'SNAP', 'NMAT'];

export default function ExamTabs() {
  const [activeExam, setActiveExam] = useState('CAT');

  return (
    <div>
      {/* Exam Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-6">
        {EXAMS.map((exam) => (
          <button
            key={exam}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-t',
              activeExam === exam
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            onClick={() => setActiveExam(exam)}
          >
            {exam}
          </button>
        ))}
      </div>

      {/* Sub Tabs + Test Panels */}
      <Suspense fallback={<div>Loading Test Config...</div>}>
        <ExamSubTabs activeExam={activeExam} />
      </Suspense>
    </div>
  );
}
