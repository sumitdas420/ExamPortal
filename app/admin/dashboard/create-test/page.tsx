'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const examList = ['CAT', 'XAT', 'CMAT', 'SNAP', 'NMAT'];
const testTypes = ['Full-Length', 'Sectional', 'Topic-wise', 'Custom'];

export default function CreateTestPage() {
  const [testName, setTestName] = useState('');
  const [exam, setExam] = useState('CAT');
  const [testType, setTestType] = useState('Full-Length');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sections, setSections] = useState([
    { name: '', timeLimit: 60, numQuestions: 20, lock: false },
  ]);
  const [showSolutions, setShowSolutions] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);

  const router = useRouter();

  const handleAddSection = () => {
    setSections([...sections, { name: '', timeLimit: 30, numQuestions: 10, lock: false }]);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleSectionChange = (index: number, key: string, value: any) => {
    const updated = [...sections];
    (updated[index] as any)[key] = value;
    setSections(updated);
  };

  const handleSubmit = () => {
    const testPayload = {
      testName,
      exam,
      testType,
      startDate,
      endDate,
      sections,
      settings: {
        showSolutions,
        shuffleQuestions,
        shuffleOptions,
      },
    };

    console.log('Test Data:', testPayload);
    // In Step 3: Send to API → /api/admin/tests/create
    router.push('/admin/dashboard/exams'); // redirect after creation
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create New Test</h1>

      {/* Test Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Test Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="CAT 2025 Mock 1"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Exam</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
          >
            {examList.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Test Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            {testTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Section Builder */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Sections</h2>

        {sections.map((section, index) => (
          <div
            key={index}
            className="border p-4 rounded mb-3 bg-gray-50 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Section Name (e.g., VARC)"
                value={section.name}
                onChange={(e) =>
                  handleSectionChange(index, 'name', e.target.value)
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Time (mins)"
                value={section.timeLimit}
                onChange={(e) =>
                  handleSectionChange(index, 'timeLimit', Number(e.target.value))
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Questions"
                value={section.numQuestions}
                onChange={(e) =>
                  handleSectionChange(index, 'numQuestions', Number(e.target.value))
                }
                className="border rounded px-3 py-2"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={section.lock}
                  onChange={(e) =>
                    handleSectionChange(index, 'lock', e.target.checked)
                  }
                />
                <span>Lock Until Previous Ends</span>
              </label>
            </div>

            {sections.length > 1 && (
              <button
                className="absolute top-2 right-2 text-red-600"
                onClick={() => handleRemoveSection(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddSection}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Section
        </button>
      </div>

      {/* Optional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showSolutions}
            onChange={(e) => setShowSolutions(e.target.checked)}
          />
          <span>Show Solutions After Exam</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={shuffleQuestions}
            onChange={(e) => setShuffleQuestions(e.target.checked)}
          />
          <span>Shuffle Questions</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={shuffleOptions}
            onChange={(e) => setShuffleOptions(e.target.checked)}
          />
          <span>Shuffle Options</span>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Save Test
      </button>
    </div>
  );
}
