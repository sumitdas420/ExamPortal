'use client';

import { useState } from 'react';
import { FiPlus, FiTrash, FiLock, FiUnlock } from 'react-icons/fi';

const EXAM_NAMES = ['CAT', 'XAT', 'NMAT', 'CMAT', 'SNAP'];
const TEST_TYPES = ['Full Length', 'Sectional', 'Topic-wise', 'Custom'];

export default function CreateTestBuilder() {
  const [examName, setExamName] = useState('CAT');
  const [testType, setTestType] = useState('Full Length');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sections, setSections] = useState([
    { name: '', numQuestions: '', timeMinutes: '', isLocked: false },
  ]);

  const handleAddSection = () => {
    setSections([...sections, { name: '', numQuestions: '', timeMinutes: '', isLocked: false }]);
  };

  const handleRemoveSection = (index: number) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const handleSectionChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...sections];
    (updated[index] as any)[field] = value;
    setSections(updated);
  };

  const handleSubmit = () => {
    const payload = {
      examName,
      testType,
      startDate,
      endDate,
      sections,
    };

    console.log('📤 Submitting Test:', payload);
    // TODO: Send `payload` to API
  };

  return (
    <div className="bg-white rounded-md shadow p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exam Selector */}
        <div>
          <label className="block mb-1 font-medium">Exam Name</label>
          <select
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {EXAM_NAMES.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>

        {/* Test Type */}
        <div>
          <label className="block mb-1 font-medium">Test Type</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {TEST_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 font-medium">Start Date & Time</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 font-medium">End Date & Time</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold mb-2">Sections</h3>
      {sections.map((section, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end bg-gray-50 p-4 rounded"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">Section Name</label>
            <input
              type="text"
              value={section.name}
              onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Questions</label>
            <input
              type="number"
              value={section.numQuestions}
              onChange={(e) => handleSectionChange(index, 'numQuestions', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Time (minutes)</label>
            <input
              type="number"
              value={section.timeMinutes}
              onChange={(e) => handleSectionChange(index, 'timeMinutes', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                handleSectionChange(index, 'isLocked', !section.isLocked)
              }
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {section.isLocked ? <FiLock /> : <FiUnlock />}
              {section.isLocked ? 'Locked' : 'Unlocked'}
            </button>

            {sections.length > 1 && (
              <button
                onClick={() => handleRemoveSection(index)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash />
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="mb-4">
        <button
          onClick={handleAddSection}
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800"
        >
          <FiPlus />
          Add Section
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Create Test
      </button>
    </div>
  );
}
