// app/api/questions/bulk/route.ts (updated)

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

    const { questions } = await req.json(); // Expect array of question objects

    const createdQuestions = await prisma.$transaction(
      questions.map((q: any) => prisma.question.create({
        data: {
          ...q,
          createdById: decoded.id,
          options: q.options ?? [], // Default to empty array if missing
        }
      }))
    );

    // Handle tags/banks/assignments in a loop if needed (similar to single creation)

    return NextResponse.json({ message: 'Bulk questions created', count: createdQuestions.length }, { status: 201 });
  } catch (error) {
    console.error('Bulk creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
