import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded: any = verify(token, process.env.JWT_SECRET!);
  if (decoded.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email, password, role = 'admin' } = await req.json();

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
  }

  const hashedPassword = await hash(password, 10);

  await prisma.admin.create({
    data: { email, password: hashedPassword, role },
  });

  return NextResponse.json({ message: 'Admin created' }, { status: 201 });
}
