import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src/assets", "Sambhav Surana Resume.pdf");

  try {
    const fileBuffer = await readFile(filePath);

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        // inline so the browser can open it in a new tab/window
        "Content-Disposition": 'inline; filename="Sambhav Surana Resume.pdf"',
      },
    });
  } catch (error) {
    console.error("File read error (viewcv):", error);
    return new Response("File not found", { status: 404 });
  }
}
