// File 1: app/api/questions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken'; // For auth

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { content, questionImage, questionType, options, optionImages, correctAnswer, explanation, explanationImage, subject, category, subcategory, difficulty, estimatedTime, tags, assignToBank, assignToExam } = body;

    const question = await prisma.question.create({
      data: {
        content,
        questionImage,
        questionType,
        options,
        optionImages,
        correctAnswer,
        explanation,
        explanationImage,
        subject,
        category,
        subcategory,
        difficulty,
        estimatedTime,
        createdById: decoded.id,
      },
    });

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        await prisma.questionTag.create({
          data: {
            questionId: question.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Assign to bank if requested
    if (assignToBank) {
      const bank = await prisma.questionBank.findFirst({
        where: { subject, category },
      });
      if (bank) {
        await prisma.questionBankQuestion.create({
          data: {
            questionId: question.id,
            questionBankId: bank.id,
          },
        });
      }
    }

    // Assign to exam if requested
    if (assignToExam) {
      // Assume assignToExam is an exam ID
      await prisma.examQuestion.create({
        data: {
          examId: assignToExam,
          questionId: question.id,
          order: 1, // Adjust as needed
          marks: 1.0,
          negativeMarks: 0.0,
        },
      });
    }

    return NextResponse.json({ message: 'Question created', question }, { status: 201 });
  } catch (error) {
    console.error('Question creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');

    const where: any = {};
    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;

    const questions = await prisma.question.findMany({
      where,
      include: {
        tags: true,
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Question listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
