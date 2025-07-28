// app/api/question-banks/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, subject, category, subcategory, description, color } = body;

    const bank = await prisma.questionBank.create({
      data: {
        name,
        subject,
        category,
        subcategory,
        description,
        color,
      },
    });

    return NextResponse.json({ message: 'Question bank created', bank }, { status: 201 });
  } catch (error) {
    console.error('Bank creation error:', error);
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

    const where: any = {};
    if (subject) where.subject = subject;

    const banks = await prisma.questionBank.findMany({
      where,
      include: { questions: true },
    });

    return NextResponse.json(banks);
  } catch (error) {
    console.error('Bank listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
