import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken'; // ✅ Named import
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || admin.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = sign( // ✅ use 'sign' directly, not 'jwt.sign'
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  const res = NextResponse.json({ message: 'Login successful' });
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'strict',
  });

  return res;
}
