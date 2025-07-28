// File 2: app/api/questions/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const question = await prisma.question.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ message: 'Question updated', question });
  } catch (error) {
    console.error('Question update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Question deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
