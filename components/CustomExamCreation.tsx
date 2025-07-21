// components/CustomExamCreation.tsx
'use client';

import React, { useState } from 'react';

export default function CustomExamCreation() {
  const [examName, setExamName] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState('Full-Length');

  const handleCreate = () => {
    if (!examName || !duration) {
      alert('Please fill all fields');
      return;
    }

    // TODO: Send to backend API
    alert(`Custom exam created: ${examName} | ${type} | ${duration} min`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Customized Exam</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Exam Name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option>Full-Length</option>
          <option>Sectional</option>
          <option>Topic-wise</option>
        </select>
        <input
          type="number"
          placeholder="Duration (mins)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleCreate}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Exam
      </button>
    </div>
  );
}
