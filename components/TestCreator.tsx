'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type Section = {
  name: string;
  duration: number;
  isLocked: boolean;
  questions: Question[];
};

interface TestCreatorProps {
  defaultExam?: string;
  defaultTestType?: 'Full-Length' | 'Sectional' | 'Topic-wise' | 'Custom';
  defaultStartTime?: string;
  defaultEndTime?: string;
}

export default function TestCreator({
  defaultExam = '',
  defaultTestType = 'Full-Length',
  defaultStartTime,
  defaultEndTime,
}: TestCreatorProps) {
  const [exam, setExam] = useState(defaultExam);
  const [testType, setTestType] = useState(defaultTestType);
  const [sections, setSections] = useState<Section[]>([]);
  const [startTime, setStartTime] = useState(defaultStartTime || '');
  const [endTime, setEndTime] = useState(defaultEndTime || '');

  const addSection = () => {
    setSections([
      ...sections,
      {
        name: '',
        duration: 0,
        isLocked: false,
        questions: [],
      },
    ]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const updateSection = (index: number, updated: Partial<Section>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updated };
    setSections(newSections);
  };

  const addQuestion = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      question: '',
      options: ['', '', '', ''],
      answer: '',
    });
    setSections(newSections);
  };

  const updateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    updated: Partial<Question>
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex] = {
      ...newSections[sectionIndex].questions[questionIndex],
      ...updated,
    };
    setSections(newSections);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a {testType} Test for {exam}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Exam Name</Label>
            <Input value={exam} onChange={(e) => setExam(e.target.value)} />
          </div>
          <div>
            <Label>Test Type</Label>
            <Input value={testType} onChange={(e) => setTestType(e.target.value as any)} />
          </div>
          <div>
            <Label>Start Time</Label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, sIndex) => (
            <div key={sIndex} className="border p-4 rounded-xl bg-gray-50 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Section {sIndex + 1}</Label>
                <Button variant="destructive" size="sm" onClick={() => removeSection(sIndex)}>
                  Remove Section
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Section Name</Label>
                  <Input
                    value={section.name}
                    onChange={(e) =>
                      updateSection(sIndex, { name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Time Limit (minutes)</Label>
                  <Input
                    type="number"
                    value={section.duration}
                    onChange={(e) =>
                      updateSection(sIndex, { duration: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Lock Section</Label>
                  <Switch
                    checked={section.isLocked}
                    onCheckedChange={(checked) =>
                      updateSection(sIndex, { isLocked: checked })
                    }
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4 mt-2">
                {section.questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="border p-4 rounded-lg bg-white space-y-2"
                  >
                    <Label>Question {qIndex + 1}</Label>
                    <Textarea
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(sIndex, qIndex, { question: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {q.options.map((opt, optIndex) => (
                        <Input
                          key={optIndex}
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updatedOptions = [...q.options];
                            updatedOptions[optIndex] = e.target.value;
                            updateQuestion(sIndex, qIndex, {
                              options: updatedOptions,
                            });
                          }}
                        />
                      ))}
                    </div>
                    <Input
                      placeholder="Correct Answer"
                      value={q.answer}
                      onChange={(e) =>
                        updateQuestion(sIndex, qIndex, { answer: e.target.value })
                      }
                    />
                  </div>
                ))}

                <Button
                  onClick={() => addQuestion(sIndex)}
                  variant="outline"
                  size="sm"
                >
                  ➕ Add Question
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Section Button */}
        <div className="pt-4">
          <Button onClick={addSection}>➕ Add Section</Button>
        </div>
      </CardContent>
    </Card>
  );
}
