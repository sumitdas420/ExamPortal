import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const totalExams = await prisma.exam.count();
  const totalStudents = await prisma.student.count();
  const totalEnrollments = await prisma.examAttempt.count();
  const weekAgo = new Date(Date.now() - 7 * 86400 * 1000);
  const recentEnrollments = await prisma.examAttempt.count({
    where: { createdAt: { gte: weekAgo } }
  });
  const activeAdmins = await prisma.admin.count({
    where: { role: { not: "MODERATOR" } }
  });
  return NextResponse.json({
    totalExams, totalStudents, recentEnrollments, activeAdmins
  });
}
