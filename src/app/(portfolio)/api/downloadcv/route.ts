import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src/assets", "Sambhav Surana Resume.pdf");

  try {
    const fileBuffer = await readFile(filePath);

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="sambhav_surana_portfolio.pdf"',
      },
    });
  } catch (error) {
    console.error("File read error:", error);
    return new Response("File not found", { status: 404 });
  }
}
