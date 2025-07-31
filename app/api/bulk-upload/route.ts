import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "csv-parse/sync";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const text = buffer.toString("utf-8");
  let usersCsv: any[] = [];
  try {
    usersCsv = parse(text, { columns: true, skip_empty_lines: true });
  } catch {
    return NextResponse.json({ error: "CSV parse failed" }, { status: 400 });
  }
  const results = [];
  for (const row of usersCsv) {
    try {
      await prisma.student.create({
        data: { username: row.username, email: row.email, password: row.password }
      });
      results.push({ email: row.email, status: "created" });
    } catch {
      results.push({ email: row.email, status: "duplicate/error" });
    }
  }
  return NextResponse.json({ results });
}
