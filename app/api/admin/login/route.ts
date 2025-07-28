import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import * as argon2 from 'argon2';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log('🔍 Login attempt:', { email });

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      console.log('❌ Admin not found for email:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('✅ Admin found:', { id: admin.id, email: admin.email, role: admin.role });

    // Verify password using Argon2
    const isValidPassword = await argon2.verify(admin.password, password);
    console.log('🔐 Password valid:', isValidPassword);
    console.log('Stored hash preview:', admin.password.substring(0, 20) + '...');

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('✅ Login successful');

    const token = sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const res = NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
    
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
    });

    return res;
  } catch (error) {
    console.error('🚨 Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
