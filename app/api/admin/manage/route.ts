// app/api/admin/manage/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const admins = await prisma.admin.findMany({
    select: { id: true, email: true, createdAt: true },
  });
  return NextResponse.json(admins);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  // OPTIONAL: prevent deleting last admin
  const count = await prisma.admin.count();
  if (count <= 1) {
    return NextResponse.json({ error: 'At least one admin required' }, { status: 403 });
  }

  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
