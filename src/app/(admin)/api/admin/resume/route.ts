import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Note: writing to filesystem in API routes works in Node.js (local/VPS) but may not persist in Serverless (Vercel)
export async function POST(req: NextRequest) {
  const auth = req.cookies.get("loggedIn");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save strictly to the specific path defined in the codebase
    const filePath = path.join(process.cwd(), "src/assets/Sambhav Surana Resume.pdf");
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // Overwrite existing file
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
