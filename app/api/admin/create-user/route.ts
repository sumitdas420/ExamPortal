import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2'; // Using Argon2 instead of bcrypt
import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    
    // Fixed role check - should be 'SUPER_ADMIN' not 'superadmin'
    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, password, username, role = 'ADMIN' } = await req.json(); // Added username

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
    }

    // Use Argon2 for hashing
    const hashedPassword = await argon2.hash(password);

    const newAdmin = await prisma.admin.create({
      data: { 
        username: username || email.split('@')[0], // Generate username from email if not provided
        email, 
        password: hashedPassword, 
        role 
      },
    });

    console.log('✅ Created new admin:', { email, role });

    return NextResponse.json({ 
      message: 'Admin created successfully',
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
