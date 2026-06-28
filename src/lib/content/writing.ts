import "server-only";

import fs from "node:fs";
import path from "node:path";

export type WritingItem = {
  title: string;
  slug: string;
  type: string;
  status: "draft" | "published";
  date: string;
  tags: string[];
  summary: string;
  body: string;
};

type SiteData = {
  writing: WritingItem[];
};

function readWritingFile() {
  const filePath = path.join(process.cwd(), "data", "site.json");
  const siteData = JSON.parse(fs.readFileSync(filePath, "utf8")) as SiteData;

  return siteData.writing;
}

export function getWriting() {
  return readWritingFile()
    .filter((item) => item.status === "published")
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getWritingBySlug(slug: string) {
  return getWriting().find((item) => item.slug === slug);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
