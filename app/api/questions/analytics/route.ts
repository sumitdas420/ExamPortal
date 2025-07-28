// app/api/questions/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) return NextResponse.json({ error: 'Question ID required' }, { status: 400 });

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { timesUsed: true, correctRate: true, avgTimeSpent: true },
    });

    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
