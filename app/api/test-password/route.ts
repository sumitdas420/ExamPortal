import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const admin = await prisma.admin.findUnique({ where: { email } });
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' });
    }
    
    const isValid = await bcrypt.compare(password, admin.password);
    
    return NextResponse.json({
      email: admin.email,
      passwordProvided: password,
      storedHashLength: admin.password.length,
      storedHashStart: admin.password.substring(0, 10) + '...',
      isValid: isValid
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
