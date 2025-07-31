import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const admins = await prisma.admin.findMany({
    select: { id: true, username: true, email: true, role: true, createdAt: true }
  });
  const students = await prisma.student.findMany({
    select: { id: true, username: true, email: true, createdAt: true }
  });
  const users = [
    ...admins.map(a => ({ ...a, name: a.username, type: "admin" })),
    ...students.map(s => ({ ...s, role: "STUDENT", name: s.username, type: "student" }))
  ];
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { id, role } = await req.json();
  if (!id || !role) return NextResponse.json({ error: "Missing id or role" }, { status: 400 });
  if (role === "ADMIN") {
    const student = await prisma.student.findUnique({ where: { id } });
    if (student) {
      await prisma.admin.create({
        data: {
          username: student.username,
          email: student.email,
          password: student.password, // Or reset here if needed
          role: "ADMIN"
        }
      });
      await prisma.student.delete({ where: { id } });
      return NextResponse.json({ status: "promoted", id });
    }
  }
  await prisma.admin.update({ where: { id }, data: { role } });
  return NextResponse.json({ status: "role updated", id, role });
}
