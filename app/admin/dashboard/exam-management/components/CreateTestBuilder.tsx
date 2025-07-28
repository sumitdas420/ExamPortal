'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Use Select fallback for now; swap with advanced Combobox if you have one!
import { toast } from 'sonner';

// Zod schemas (update enums if schema ever changes)
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

const testSchema = z.object({
  title: z.string().min(3),
  duration: z.number().int().min(1).max(360),
  sections: z.array(
    z.object({
      title: z.string().min(2),
      questions: z.array(questionSchema).min(1),
    })
  ),
});
type TestForm = z.infer<typeof testSchema>;

// Query hooks — adjust to your actual API
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
async function fetchQuestions() {
  const res = await fetch('/api/questions');
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

// Image upload utility
async function uploadImage(file: File): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.file?.filePath;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────
export default function CreateTestBuilder() {
  const { control, handleSubmit, register, reset, watch, setValue, getValues } = useForm<TestForm>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: '',
      duration: 60,
      sections: [
        {
          title: 'Section 1',
          questions: [],
        },
      ],
    },
  });
  const sectionsField = useFieldArray({ control, name: 'sections' });

  const { data: banks, error: banksError } = useQuery(['banks'], fetchBanks);
  const { data: tags, error: tagsError } = useQuery(['tags'], fetchTags);
  // Optionally display existing questions table:
  // const { data: existingQuestions, error: questionsError } = useQuery(['questions'], fetchQuestions);

  useEffect(() => {
    if (banksError) toast.error('Failed to load banks');
    if (tagsError) toast.error('Failed to load tags');
    // if (questionsError) toast.error('Failed to load questions');
  }, [banksError, tagsError]);

  const [submitting, setSubmitting] = useState(false);

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
              examTitle: data.title,
              duration: data.duration,
            }),
          });
          const json = await res.json();
          results.push(json);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">📘 Create New Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            <Input placeholder="Test Title" {...register('title')} className="w-1/2" />
            <Input
              type="number"
              min={1}
              max={360}
              placeholder="Duration (min)"
              {...register('duration', { valueAsNumber: true })}
              className="w-1/4"
            />
          </div>
          {sectionsField.fields.map((sec, secIdx) => (
            <SectionBuilder
              key={sec.id}
              sectionIndex={secIdx}
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
              sectionsField.append({ title: `Section ${sectionsField.fields.length + 1}`, questions: [] })
            }
          >
            + Add Section
          </Button>
          <div className="pt-8 flex justify-end">
            <Button type="submit" disabled={submitting} className="font-semibold">
              {submitting ? 'Creating...' : 'Create Test'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── SECTION BUILDER ───────────────────────────────────────────────
function SectionBuilder({
  sectionIndex, control, register, setValue, watch, banks, tags
}: {
  sectionIndex: number;
  control: any;
  register: any;
  setValue: any;
  watch: any;
  banks: any[];
  tags: any[];
}) {
  const questionsField = useFieldArray({ control, name: `sections.${sectionIndex}.questions` });

  async function handleQuestionImageUpload(qIdx: number, file: File) {
    const url = await uploadImage(file);
    if (url) setValue(`sections.${sectionIndex}.questions.${qIdx}.questionImage`, url);
  }

  return (
    <div className="space-y-6 mb-6 p-4 border rounded">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder={`Section Title`}
          {...register(`sections.${sectionIndex}.title`)}
          className="font-bold"
        />
      </div>
      {questionsField.fields.map((q, qIdx) => {
        const qType = watch(`sections.${sectionIndex}.questions.${qIdx}.questionType`) || 'MCQ';
        return (
          <Card key={q.id} className="p-4 border my-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold">Q{qIdx + 1}:</span>
              <Input
                placeholder="Question Text"
                {...register(`sections.${sectionIndex}.questions.${qIdx}.content`)}
                className="w-full"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => questionsField.remove(qIdx)}
                aria-label="Remove Question"
              >
                🗑️
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <select
                {...register(`sections.${sectionIndex}.questions.${qIdx}.questionType`)}
                className="p-2 border rounded"
              >
                <option value="MCQ">MCQ</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="NUMERICAL">Numerical</option>
                <option value="DESCRIPTIVE">Descriptive</option>
              </select>
              {/* Image upload */}
              <label className="flex gap-2 items-center text-xs">
                <span>Image:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleQuestionImageUpload(qIdx, file);
                  }}
                  className="block"
                />
              </label>
              {watch(`sections.${sectionIndex}.questions.${qIdx}.questionImage`) && (
                <img
                  src={watch(`sections.${sectionIndex}.questions.${qIdx}.questionImage`)}
                  alt="preview"
                  className="h-12 w-auto ml-2 inline-block rounded border"
                />
              )}
            </div>
            {/* OPTIONS BUILDER */}
            {(qType === 'MCQ' || qType === 'TRUE_FALSE') && (
              <OptionsBuilder
                sectionIndex={sectionIndex}
                questionIndex={qIdx}
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
                {...register(`sections.${sectionIndex}.questions.${qIdx}.correctAnswer`)}
                className="w-2/5"
              />
              <Input
                placeholder="Subject"
                {...register(`sections.${sectionIndex}.questions.${qIdx}.subject`)}
                className="w-1/5"
              />
              <select
                {...register(`sections.${sectionIndex}.questions.${qIdx}.difficulty`)}
                className="p-2 border rounded w-1/5"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <Textarea
              placeholder="Explanation (optional)"
              {...register(`sections.${sectionIndex}.questions.${qIdx}.explanation`)}
              className="mt-2"
            />
            {/* TAGS MULTI-SELECT */}
            <label className="block mt-2 text-xs font-medium">Tags
              <select
                multiple
                value={watch(`sections.${sectionIndex}.questions.${qIdx}.tags`) || []}
                onChange={e =>
                  setValue(
                    `sections.${sectionIndex}.questions.${qIdx}.tags`,
                    Array.from(e.target.selectedOptions).map(option => option.value)
                  )
                }
                className="w-full p-2 border rounded"
              >
                {tags && Array.isArray(tags) && tags.map((tag: any) => (
                  <option key={tag.id} value={tag.name}>{tag.name}</option>
                ))}
              </select>
            </label>

            {/* BANK SINGLE-SELECT */}
            <label className="block mt-2 text-xs font-medium">Bank
              <select
                value={watch(`sections.${sectionIndex}.questions.${qIdx}.bank`) || ""}
                onChange={e =>
                  setValue(`sections.${sectionIndex}.questions.${qIdx}.bank`, e.target.value)
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Bank</option>
                {banks && Array.isArray(banks) && banks.map((bank: any) => (
                  <option key={bank.id} value={bank.name}>{bank.name}</option>
                ))}
              </select>
            </label>
          </Card>
        );
      })}
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

// ─── OPTIONS BUILDER ─────────────────────────────────────────────────
function OptionsBuilder({
  sectionIndex, questionIndex, control, register, setValue, watch, qType
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

  // Auto-fill for TRUE_FALSE
  useEffect(() => {
    if (qType === 'TRUE_FALSE' && optionsField.fields.length < 2) {
      setValue(
        `sections.${sectionIndex}.questions.${questionIndex}.options`,
        [
          { text: 'True', image: '' },
          { text: 'False', image: '' },
        ],
        { shouldValidate: false }
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
