import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // 1. Get the latest 100 audit logs
  const logs = await prisma.audit.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // 2. In parallel, load user details for each log based on userType:
  const logsWithUser = await Promise.all(logs.map(async (log) => {
    let username = null;
    let email = null;
    if (log.userId && log.userType === "admin") {
      const user = await prisma.admin.findUnique({ where: { id: log.userId } });
      username = user?.username ?? null;
      email = user?.email ?? null;
    } else if (log.userId && log.userType === "student") {
      const user = await prisma.student.findUnique({ where: { id: log.userId } });
      username = user?.username ?? null;
      email = user?.email ?? null;
    }
    return { ...log, username, email };
  }));

  return NextResponse.json(logsWithUser);
}
