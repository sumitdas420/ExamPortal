import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as argon2 from 'argon2';

export async function POST() {
  try {
    // First, delete related records to avoid foreign key constraints
    await prisma.question.deleteMany({}); // Deletes questions linked to admins
    await prisma.exam.deleteMany({}); // Deletes exams linked to admins
    console.log('✅ Deleted related questions and exams');

    // Now safe to delete all admins
    await prisma.admin.deleteMany({});
    console.log('✅ Deleted existing admins');

    // Create a fresh admin with Argon2
    const plainPassword = 'admin123';
    const hashedPassword = await argon2.hash(plainPassword);
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });

    // Test the password immediately
    const testResult = await argon2.verify(hashedPassword, plainPassword);
    
    return NextResponse.json({ 
      message: 'Admin reset successful',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      passwordTest: testResult, // Should be true
      credentials: {
        email: 'admin@example.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('🚨 Reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
