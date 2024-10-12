import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
export async function GET(req: NextRequest, res: NextResponse) {
  const buffer = await readFile(
    path.join(process.cwd(), "src/assets", "portfolio.pdf")
  );
  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="sambhav_surana_portfolio.pdf"');
  headers.append("Content-Type", "pdf");
  return new Response(buffer, {
    headers,
  });
}
