import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 10
  });
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const { title, body, userId } = await req.json();
  const notif = await prisma.notification.create({ data: { title, body, userId } });
  return NextResponse.json(notif);
}
