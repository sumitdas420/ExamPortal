// app/api/upload/route.ts (updated with questionId validation)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;
    const questionId = formData.get('questionId') as string | undefined; // Optional

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Validate questionId if provided
    if (questionId) {
      const question = await prisma.question.findUnique({ where: { id: questionId } });
      if (!question) return NextResponse.json({ error: 'Invalid question ID - question not found' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        originalName: file.name,
        fileName,
        filePath: `/uploads/${fileName}`,
        fileSize: buffer.length,
        mimeType: file.type,
        uploadedBy: decoded.id,
        questionId, // Links if provided, null otherwise
      },
    });

    return NextResponse.json({ message: 'Image uploaded', file: uploadedFile }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
