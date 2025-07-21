'use client';

import { useState, lazy, Suspense } from 'react';
import clsx from 'clsx';

const FullLengthPanel = lazy(() => import('./test-types/FullLengthPanel'));
const SectionalPanel = lazy(() => import('./test-types/SectionalPanel'));
const TopicwisePanel = lazy(() => import('./test-types/TopicwisePanel'));
const CustomTestPanel = lazy(() => import('./test-types/CustomTestPanel'));

const TEST_TYPES = [
  { label: 'Full-Length', value: 'full' },
  { label: 'Sectional', value: 'sectional' },
  { label: 'Topic-wise', value: 'topicwise' },
  { label: 'Custom Test', value: 'custom' },
];

export default function ExamSubTabs({ activeExam }: { activeExam: string }) {
  const [activeTab, setActiveTab] = useState('full');

  const renderPanel = () => {
    switch (activeTab) {
      case 'full':
        return <FullLengthPanel exam={activeExam} />;
      case 'sectional':
        return <SectionalPanel exam={activeExam} />;
      case 'topicwise':
        return <TopicwisePanel exam={activeExam} />;
      case 'custom':
        return <CustomTestPanel exam={activeExam} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div className="flex space-x-3 border-b mb-4 pb-1">
        {TEST_TYPES.map((type) => (
          <button
            key={type.value}
            className={clsx(
              'text-sm font-medium px-3 py-1 rounded-t',
              activeTab === type.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            onClick={() => setActiveTab(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Lazy Loaded Panel */}
      <div className="mt-4">
        <Suspense fallback={<div>Loading {activeTab} test panel...</div>}>
          {renderPanel()}
        </Suspense>
      </div>
    </div>
  );
}
