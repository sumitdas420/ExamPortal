'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Zod Schemas for form validation
const optionSchema = z.object({
  text: z.string().min(1, "Option required"),
  image: z.string().optional(),
});

const questionSchema = z.object({
  content: z.string().min(5, 'Question text required'),
  questionType: z.enum(['MCQ', 'TRUE_FALSE', 'NUMERICAL', 'DESCRIPTIVE']),
  options: z.array(optionSchema).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  tags: z.array(z.string()).optional(),
  bank: z.string().optional(),
  questionImage: z.string().optional(),
});

const sectionSchema = z.object({
  title: z.string().min(2),
  sectionTime: z.number().int().min(1).max(180),
  allowQuestionSwitch: z.boolean(),
  questions: z.array(questionSchema).min(1),
});

const testSchema = z.object({
  title: z.string().min(3),
  allowSectionSwitch: z.boolean(),
  sections: z.array(sectionSchema),
});

type TestForm = z.infer<typeof testSchema>;

// API fetch functions
async function fetchBanks() {
  const res = await fetch('/api/question-banks');
  if (!res.ok) throw new Error('Failed to fetch banks');
  return res.json();
}
async function fetchTags() {
  const res = await fetch('/api/tags');
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

// Image Upload Helper
async function uploadImage(file: File): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  return data.file?.filePath;
}

// Main CreateTestBuilder Component
export default function CreateTestBuilder() {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<TestForm>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: '',
      allowSectionSwitch: true,
      sections: [
        { title: 'Section 1', sectionTime: 60, allowQuestionSwitch: true, questions: [] },
      ],
    },
  });

  const sectionsField = useFieldArray({ control, name: 'sections' });

  // Data fetching using TanStack Query v5 with object syntax
  const { data: banks, error: banksError } = useQuery({ queryKey: ['banks'], queryFn: fetchBanks });
  const { data: tags, error: tagsError } = useQuery({ queryKey: ['tags'], queryFn: fetchTags });

  useEffect(() => {
    if (banksError) toast.error('Failed to load banks');
    if (tagsError) toast.error('Failed to load tags');
  }, [banksError, tagsError]);

  const [submitting, setSubmitting] = useState(false);

  // Compute total exam duration from sectional times
  const sectionTimes = watch('sections')?.map(sec => Number(sec.sectionTime) || 0) || [];
  const totalTime = useMemo(() => sectionTimes.reduce((a, b) => a + b, 0), [sectionTimes]);

  // Handle form submission to create test
  async function onSubmit(data: TestForm) {
    setSubmitting(true);
    try {
      const results = [];
      for (const section of data.sections) {
        for (const question of section.questions) {
          const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...question,
              section: section.title,
              sectionTime: section.sectionTime,
              allowQuestionSwitch: section.allowQuestionSwitch,
              allowSectionSwitch: data.allowSectionSwitch,
              examTitle: data.title,
              totalTime,
              status: 'PUBLISHED', // Mark as published when submitting
            }),
          });
          results.push(await res.json());
        }
      }
      toast.success(`Created ${results.length} question(s)!`);
      reset();
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to create test');
    } finally {
      setSubmitting(false);
    }
  }

  // Save draft action
  async function handleSaveDraft() {
    const values = getValues();
    setSubmitting(true);
    try {
      await fetch('/api/tests', { // Adjust endpoint if needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, status: 'DRAFT', totalTime }),
      });
      toast.success('Draft saved!');
    } catch (e) {
      toast.error('Failed to save draft');
    }
    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">📘 Create New Test</CardTitle>
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <span>
            <span className="font-semibold">Total Exam Duration: </span>
            <span>{totalTime} min</span>
          </span>
          <label className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Allow Section Switch</span>
            <Controller
              control={control}
              name="allowSectionSwitch"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-600 bg-gray-200"
                />
              )}
            />
          </label>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            <Input placeholder="Test Title" {...register('title')} className="w-1/2" />
          </div>

          {sectionsField.fields.map((section, idx) => (
            <SectionBuilder
              key={section.id}
              sectionIndex={idx}
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              banks={banks || []}
              tags={tags || []}
            />
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              sectionsField.append({
                title: `Section ${sectionsField.fields.length + 1}`,
                sectionTime: 60,
                allowQuestionSwitch: true,
                questions: [],
              })
            }
          >
            + Add Section
          </Button>

          <div className="pt-8 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={submitting}>
              Save Draft
            </Button>
            <Button type="submit" disabled={submitting} className="font-semibold">
              {submitting ? 'Creating...' : 'Create Test'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// SectionBuilder component handles each section and its questions
function SectionBuilder({
  sectionIndex,
  control,
  register,
  setValue,
  watch,
  banks,
  tags,
}: {
  sectionIndex: number;
  control: any;
  register: any;
  setValue: any;
  watch: any;
  banks: any[];
  tags: any[];
}) {
  const questionsField = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  // Handle question image upload uploads for question at qIdx inside this section
  async function handleQuestionImageUpload(qIdx: number, file: File) {
    const url = await uploadImage(file);
    if (url) setValue(`sections.${sectionIndex}.questions.${qIdx}.questionImage`, url);
  }

  return (
    <div className="space-y-6 mb-6 p-4 border rounded">
      {/* Section header with time and question switch toggle */}
      <div className="flex flex-wrap gap-4 mb-3 items-center">
        <Input
          placeholder="Section Title"
          {...register(`sections.${sectionIndex}.title`)}
          className="font-bold !w-56"
        />
        <Input
          type="number"
          min={1}
          max={180}
          placeholder="Section Time (min)"
          {...register(`sections.${sectionIndex}.sectionTime`, { valueAsNumber: true })}
          className="!w-32"
        />
        <label className="flex items-center space-x-2">
          <span className="font-semibold text-sm">Allow Question Switch</span>
          <Controller
            control={control}
            name={`sections.${sectionIndex}.allowQuestionSwitch`}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-blue-600 bg-gray-200"
              />
            )}
          />
        </label>
      </div>

      {/* Questions list */}
      {questionsField.fields.map((question, qIdx) => (
        <QuestionBuilder
          key={question.id}
          sectionIndex={sectionIndex}
          questionIndex={qIdx}
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          banks={banks}
          tags={tags}
          removeQuestion={() => questionsField.remove(qIdx)}
          handleQuestionImageUpload={handleQuestionImageUpload}
        />
      ))}

      <Button
        type="button"
        onClick={() =>
          questionsField.append({
            content: '',
            questionType: 'MCQ',
            options: [],
            correctAnswer: '',
            explanation: '',
            subject: '',
            difficulty: 'EASY',
            tags: [],
            bank: '',
            questionImage: '',
          })
        }
      >
        + Add Question
      </Button>
    </div>
  );
}

// QuestionBuilder handles each question form inside a section
function QuestionBuilder({
  sectionIndex,
  questionIndex,
  control,
  register,
  setValue,
  watch,
  banks,
  tags,
  removeQuestion,
  handleQuestionImageUpload,
}: {
  sectionIndex: number;
  questionIndex: number;
  control: any;
  register: any;
  setValue: any;
  watch: any;
  banks: any[];
  tags: any[];
  removeQuestion: () => void;
  handleQuestionImageUpload: (qIdx: number, file: File) => Promise<void>;
}) {
  const optionsField = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.options`,
  });

  const base = `sections.${sectionIndex}.questions.${questionIndex}`;
  const qType = watch(`${base}.questionType`) || 'MCQ';

  // Auto fill TRUE_FALSE options
  useEffect(() => {
    if (qType === 'TRUE_FALSE' && optionsField.fields.length < 2) {
      setValue(
        `${base}.options`,
        [
          { text: 'True', image: '' },
          { text: 'False', image: '' },
        ],
        { shouldValidate: false, shouldDirty: false }
      );
    }
  }, [qType, optionsField.fields.length, setValue, base]);

  return (
    <Card className="p-4 border my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold">Q{questionIndex + 1}:</span>
        <Input
          placeholder="Question Text"
          {...register(`${base}.content`)}
          className="w-full"
        />
        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={removeQuestion}
          aria-label="Remove Question"
        >
          🗑️
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <select
          {...register(`${base}.questionType`)}
          className="p-2 border rounded"
        >
          <option value="MCQ">MCQ</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="NUMERICAL">Numerical</option>
          <option value="DESCRIPTIVE">Descriptive</option>
        </select>

        <label className="flex gap-2 items-center text-xs">
          <span>Image:</span>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleQuestionImageUpload(questionIndex, file);
            }}
            className="block"
          />
        </label>

        {watch(`${base}.questionImage`) && (
          <img
            src={watch(`${base}.questionImage`)}
            alt="preview"
            className="h-12 w-auto ml-2 inline-block rounded border"
          />
        )}
      </div>

      {(qType === 'MCQ' || qType === 'TRUE_FALSE') && (
        <OptionsBuilder
          sectionIndex={sectionIndex}
          questionIndex={questionIndex}
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          qType={qType}
        />
      )}

      <div className="flex gap-4 mt-3">
        <Input
          placeholder="Correct Answer"
          {...register(`${base}.correctAnswer`)}
          className="w-2/5"
        />
        <Input
          placeholder="Subject"
          {...register(`${base}.subject`)}
          className="w-1/5"
        />
        <select
          {...register(`${base}.difficulty`)}
          className="p-2 border rounded w-1/5"
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      <Textarea
        placeholder="Explanation (optional)"
        {...register(`${base}.explanation`)}
        className="mt-2"
      />

      {/* Tags Multi-select */}
      <label className="block mt-2 text-xs font-medium">
        Tags
        <select
          multiple
          value={watch(`${base}.tags`) || []}
          onChange={e =>
            setValue(
              `${base}.tags`,
              Array.from(e.target.selectedOptions).map(option => option.value)
            )
          }
          className="w-full p-2 border rounded"
        >
          {(tags || []).map((tag: any) => (
            <option key={tag.id} value={tag.name}>{tag.name}</option>
          ))}
        </select>
      </label>

      {/* Bank Single select */}
      <label className="block mt-2 text-xs font-medium">
        Bank
        <select
          value={watch(`${base}.bank`) || ""}
          onChange={e =>
            setValue(`${base}.bank`, e.target.value)
          }
          className="w-full p-2 border rounded"
        >
          <option value="">Select Bank</option>
          {(banks || []).map((bank: any) => (
            <option key={bank.id} value={bank.name}>{bank.name}</option>
          ))}
        </select>
      </label>
    </Card>
  );
}

// Options Builder handles answer choices for MCQ/TrueFalse
function OptionsBuilder({
  sectionIndex,
  questionIndex,
  control,
  register,
  setValue,
  watch,
  qType,
}: {
  sectionIndex: number;
  questionIndex: number;
  control: any;
  register: any;
  setValue: any;
  watch: any;
  qType: string;
}) {
  const optionsField = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.options`,
  });

  async function handleOptionImageUpload(idx: number, file: File) {
    const url = await uploadImage(file);
    if (url) setValue(`sections.${sectionIndex}.questions.${questionIndex}.options.${idx}.image`, url);
  }

  useEffect(() => {
    if (qType === 'TRUE_FALSE' && optionsField.fields.length < 2) {
      setValue(
        `sections.${sectionIndex}.questions.${questionIndex}.options`,
        [
          { text: 'True', image: '' },
          { text: 'False', image: '' },
        ],
        { shouldValidate: false, shouldDirty: false }
      );
    }
  }, [qType, optionsField.fields.length, sectionIndex, questionIndex, setValue]);

  return (
    <div className="bg-muted rounded p-2 my-2">
      <strong className="text-xs">Options:</strong>
      {optionsField.fields.map((opt, idx) => (
        <div key={opt.id} className="flex gap-2 items-center mt-1">
          <Input
            placeholder={`Option ${idx + 1}`}
            {...register(`sections.${sectionIndex}.questions.${questionIndex}.options.${idx}.text`)}
            className="w-2/3"
            disabled={qType === 'TRUE_FALSE'}
          />
          <label className="flex gap-2 items-center text-xs">
            <span>Img:</span>
            <input
              type="file"
              accept="image/*"
              disabled={qType === 'TRUE_FALSE'}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleOptionImageUpload(idx, file);
              }}
            />
          </label>
          {watch(`sections.${sectionIndex}.questions.${questionIndex}.options.${idx}.image`) && (
            <img
              src={watch(`sections.${sectionIndex}.questions.${questionIndex}.options.${idx}.image`)}
              alt="preview"
              className="h-8 w-auto border"
            />
          )}
          {qType === 'MCQ' && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => optionsField.remove(idx)}
              aria-label="Remove Option"
            >
              ❌
            </Button>
          )}
        </div>
      ))}
      {qType === 'MCQ' && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => optionsField.append({ text: '', image: '' })}
        >
          + Option
        </Button>
      )}
    </div>
  );
}
