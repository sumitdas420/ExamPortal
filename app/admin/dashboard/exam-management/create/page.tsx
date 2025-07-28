// app/admin/dashboard/exam-management/create/page.tsx

'use client';

import React from 'react';
import CreateTestBuilder from '../components/CreateTestBuilder';

export default function CreateTestPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">🧪 Create a Test</h1>
      <CreateTestBuilder />
    </div>
  );
}
