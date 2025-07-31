import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Return monthly student registration numbers
  const months = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (6 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Map { month: string } to { date: 'Mon', students: number }
  const students = await prisma.student.findMany({
    select: { createdAt: true }
  });
  const growthData = months.map(month => ({
    date: month.slice(5), // "01", "02", etc.
    students: students.filter(s => s.createdAt.toISOString().slice(0, 7) === month).length,
  }));

  return NextResponse.json(growthData);
}
