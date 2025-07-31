import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Get all subjects/exam types (distribution)
  const results = await prisma.exam.groupBy({
    by: ['subject'],
    _count: { _all: true },
  });
  return NextResponse.json(
    results.map(r => ({ name: r.subject, value: Number(r._count._all) }))
  );
}
