import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = process.cwd();
const siteDataPath = path.join(root, "data", "site.json");
const outputDir = path.join(root, "public", "resume");
const htmlPath = path.join(outputDir, "sambhav-surana-resume.html");
const pdfPath = path.join(outputDir, "sambhav-surana-resume.pdf");
const profilePhotoPath = path.join(outputDir, "profile-photo.jpg");
const ibmPlexRegularPath = path.join(
  root,
  "node_modules",
  "@fontsource",
  "ibm-plex-sans",
  "files",
  "ibm-plex-sans-latin-400-normal.woff2",
);
const ibmPlexBoldPath = path.join(
  root,
  "node_modules",
  "@fontsource",
  "ibm-plex-sans",
  "files",
  "ibm-plex-sans-latin-700-normal.woff2",
);
const phosphorBoldPath = path.join(root, "node_modules", "@phosphor-icons", "web", "src", "bold", "Phosphor-Bold.woff2");
const maxResumeProjects = 4;
const allowExistingPdf = process.argv.includes("--allow-existing-pdf");

const siteData = JSON.parse(await fs.readFile(siteDataPath, "utf8"));
const resume = siteData.resume;
const resumeProjects = buildResumeProjects(siteData.projects ?? []);
const profilePhotoExists = await exists(profilePhotoPath);

if (resumeProjects.length > 0) {
  resume.sections = {
    ...resume.sections,
    projects: {
      ...(resume.sections?.projects ?? {}),
      items: resumeProjects,
    },
  };
}

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(htmlPath, buildHtml(resume, profilePhotoExists), "utf8");
await renderPdf(htmlPath, pdfPath);

console.log(`Generated ${path.relative(root, htmlPath)}`);
console.log(`Generated ${path.relative(root, pdfPath)}`);

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function renderPdf(sourceHtmlPath, outputPdfPath) {
  const chromePath = await findChromePath();

  if (!chromePath) {
    if (allowExistingPdf && await exists(outputPdfPath)) {
      console.warn(`Chrome or Edge was not found; keeping existing ${path.relative(root, outputPdfPath)}.`);
      return;
    }

    throw new Error("Chrome or Edge is required to render the resume PDF.");
  }

  await fs.rm(outputPdfPath, { force: true });

  await execFileAsync(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outputPdfPath}`,
    pathToFileURL(sourceHtmlPath).href,
  ]);

  const stat = await fs.stat(outputPdfPath);
  if (stat.size < 10_000) {
    throw new Error(`Rendered PDF is unexpectedly small: ${stat.size} bytes`);
  }
}

async function findChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await exists(candidate)) {
      return candidate;
    }
  }

  return null;
}

function buildResumeProjects(projects) {
  return projects
    .filter((project) => project.status === "published")
    .map((project, index) => ({
      ...project,
      resumePriority: Number(project.resume?.priority ?? project.resumePriority ?? project.order ?? index + 1),
    }))
    .filter((project) => Number.isFinite(project.resumePriority))
    .sort((a, b) => a.resumePriority - b.resumePriority || a.order - b.order)
    .slice(0, maxResumeProjects)
    .map(projectToResumeItem);
}

function projectToResumeItem(project) {
  const resumeProject = project.resume ?? {};
  const bullets = resumeProject.bullets;

  if (!Array.isArray(bullets) || bullets.length === 0) {
    throw new Error(`Project "${project.slug ?? project.title}" must define resume.bullets for resume generation.`);
  }

  return {
    title: resumeProject.title ?? project.title,
    summary: resumeProject.summary ?? project.summary,
    date: resumeProject.date ?? "",
    bullets,
    tags: resumeProject.tags ?? project.tags ?? [],
    url: resumeProject.url ?? project.githubUrl ?? project.liveUrl ?? "",
  };
}

function buildHtml(data, hasPhoto) {
  const basics = data.basics;
  const sections = data.sections ?? {};
  const experience = sections.experience?.items ?? [];
  const certifications = sections.certifications?.items ?? [];
  const skills = sections.skills?.items ?? [];
  const education = sections.education?.items ?? [];
  const projects = sections.projects?.items ?? [];
  const languages = sections.languages?.items ?? [];
  const photoSrc = hasPhoto ? pathToFileURL(profilePhotoPath).href : "";
  const contact = [
    basics.location?.city,
    basics.phone,
    basics.email,
    basics.url,
  ].filter(Boolean);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(basics.name)} Resume</title>
  <style>
    @font-face {
      font-family: "IBM Plex Sans";
      src: url("${pathToFileURL(ibmPlexRegularPath).href}") format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: block;
    }

    @font-face {
      font-family: "IBM Plex Sans";
      src: url("${pathToFileURL(ibmPlexBoldPath).href}") format("woff2");
      font-weight: 700;
      font-style: normal;
      font-display: block;
    }

    @font-face {
      font-family: "Phosphor-Bold";
      src: url("${pathToFileURL(phosphorBoldPath).href}") format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: block;
    }

    :root {
      color-scheme: light;
      --accent: #008bd2;
      --accent-dark: #006fa8;
      --hero: #d9eef8;
      --contact: #94d1ea;
      --ink: #050505;
      --muted: #202020;
      --paper: #ffffff;
    }

    @page {
      size: 210.23mm 297.35mm;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      background: #2f2f2f;
      color: var(--ink);
      font-family: "IBM Plex Sans", Arial, Helvetica, sans-serif;
      font-size: 10.1pt;
      line-height: 1.42;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    a {
      color: inherit;
      text-decoration: underline;
      text-underline-offset: 1px;
    }

    p,
    h1,
    h2,
    h3 {
      margin: 0;
    }

    .resume-page {
      width: 210.23mm;
      min-height: 297.35mm;
      margin: 0 auto 4mm;
      overflow: hidden;
      background: var(--paper);
      page-break-after: always;
    }

    .resume-page:last-child {
      page-break-after: auto;
    }

    .hero {
      position: relative;
      min-height: 64mm;
      padding: 6mm 5mm 0;
      background: var(--hero);
    }

    .hero h1 {
      margin-bottom: 1.8mm;
      font-size: 20.5pt;
      line-height: 1;
      font-weight: 700;
    }

    .headline {
      margin-bottom: 4mm;
      color: var(--accent);
      font-size: 10.1pt;
    }

    .summary {
      max-width: 170mm;
      font-size: 9.5pt;
      line-height: 1.48;
    }

    .photo {
      position: absolute;
      top: 18mm;
      right: 5.5mm;
      width: 16.5mm;
      height: 16.5mm;
      border-radius: 999px;
      object-fit: cover;
    }

    .contact-bar {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      min-height: 15.5mm;
      align-items: center;
      gap: 4.6mm;
      padding: 0 5mm;
      background: var(--contact);
      color: #06405d;
      font-size: 8.2pt;
    }

    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 1.8mm;
      white-space: nowrap;
    }

    .contact-action {
      text-decoration: underline;
      text-underline-offset: 1.2px;
    }

    .contact-icon {
      display: inline-block;
      width: 2.8mm;
      flex: 0 0 2.8mm;
      color: var(--accent-dark);
      font-family: "Phosphor-Bold";
      font-size: 8.2pt;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      text-align: center;
    }

    .icon-pin::before {
      content: "\\e316";
    }

    .icon-tel::before {
      content: "\\e3b8";
    }

    .icon-mail::before {
      content: "\\e214";
    }

    .icon-link::before {
      content: "\\e2e6";
    }

    .page-one-body {
      display: grid;
      grid-template-columns: 99mm 90mm;
      gap: 6mm;
      padding: 5.7mm 5mm 0 5mm;
    }

    .section {
      margin-bottom: 5.8mm;
      break-inside: avoid;
    }

    .section-title {
      margin-bottom: 2.2mm;
      padding-bottom: 1.2mm;
      border-bottom: 1.1pt solid var(--accent);
      color: var(--accent);
      font-size: 10.2pt;
      font-weight: 700;
      line-height: 1.1;
    }

    .item {
      margin-bottom: 3.6mm;
      break-inside: avoid;
    }

    .page-one-body > div:first-child {
      font-size: 10.35pt;
      line-height: 1.45;
    }

    .page-one-body > div:first-child .item {
      margin-bottom: 5.4mm;
    }

    .page-one-body > div:first-child li {
      margin-bottom: 3.85mm;
    }

    .item-title {
      font-size: 10pt;
      font-weight: 700;
      line-height: 1.25;
    }

    .item-subtitle,
    .item-date {
      font-size: 9.8pt;
      font-weight: 700;
      line-height: 1.3;
    }

    .copy {
      margin-top: 1.6mm;
      line-height: 1.5;
    }

    ul {
      margin: 2.2mm 0 0;
      padding-left: 5.4mm;
    }

    li {
      margin-bottom: 3.35mm;
      padding-left: 1.2mm;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9.6mm 6.8mm;
    }

    .skill {
      break-inside: avoid;
    }

    .skill-name {
      margin-bottom: 1.5mm;
      font-size: 9.8pt;
      font-weight: 700;
      line-height: 1.18;
    }

    .skill-bars {
      display: flex;
      gap: 1.2mm;
      margin-bottom: 1.4mm;
    }

    .skill-bars span {
      width: 5.5mm;
      height: 2.65mm;
      background: var(--accent);
    }

    .skill-text {
      font-size: 8.55pt;
      line-height: 1.48;
    }

    .education .item-title {
      display: block;
      max-width: 42mm;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .projects-page {
      padding: 6.3mm 5mm 0 5mm;
      font-size: 10.15pt;
      line-height: 1.42;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7.4mm 7mm;
    }

    .project {
      break-inside: avoid;
    }

    .project h3 {
      margin-bottom: 1.4mm;
      font-size: 10.25pt;
      line-height: 1.2;
      font-weight: 700;
    }

    .project-summary {
      margin-bottom: 1.9mm;
      line-height: 1.45;
    }

    .project-date {
      margin-bottom: 1.8mm;
      font-weight: 700;
    }

    .project ul {
      margin-top: 2.4mm;
      padding-left: 5.8mm;
    }

    .project li {
      margin-bottom: 2.35mm;
      line-height: 1.42;
    }

    .tags,
    .project-link {
      margin-top: 2mm;
      font-size: 9pt;
      line-height: 1.34;
    }

    .project-link {
      color: var(--ink);
      text-decoration: underline;
      overflow-wrap: anywhere;
    }

    .project-link::before {
      content: "\\e2e6";
      display: inline-block;
      margin-right: 1.35mm;
      color: var(--accent);
      font-family: "Phosphor-Bold";
      font-size: 9.2pt;
      font-weight: 400;
      text-decoration: none;
      vertical-align: -0.2mm;
    }

    .languages {
      margin-top: 6.6mm;
    }

    .language-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8mm;
      color: var(--accent);
      font-weight: 700;
      font-size: 9.6pt;
    }

    .language-name {
      margin-bottom: 2mm;
    }

    .language-bars {
      display: flex;
      gap: 1.4mm;
    }

    .language-bars span {
      width: 7.1mm;
      height: 3mm;
      border: 1.1pt solid var(--accent);
      background: transparent;
    }

    .language-bars span.filled {
      background: var(--accent);
    }

    @media screen {
      .resume-page {
        box-shadow: 0 18px 44px rgb(0 0 0 / 0.28);
      }
    }

    @media print {
      html,
      body {
        background: #ffffff;
      }

      .resume-page {
        margin: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="resume-page">
      <header class="hero">
        <h1>${escapeHtml(basics.name)}</h1>
        <p class="headline">${escapeHtml(basics.headline)}</p>
        <p class="summary">${escapeHtml(basics.summary)}</p>
        ${hasPhoto ? `<img class="photo" src="${photoSrc}" alt="" />` : ""}
        <div class="contact-bar">
          ${contact.map((item, index) => contactItem(item, index)).join("\n          ")}
        </div>
      </header>

      <div class="page-one-body">
        <div>
          ${section("Experience", experience.map(experienceItem).join(""))}
          ${section("Certifications", certifications.map(certificationItem).join(""))}
        </div>
        <div>
          ${section("Technical Skills", `<div class="skills-grid">${skills.map(skillItem).join("")}</div>`)}
          ${section("Education", education.map(educationItem).join(""), "education")}
        </div>
      </div>
    </section>

    <section class="resume-page projects-page">
      ${section("Projects", `<div class="projects-grid">${projects.map(projectItem).join("")}</div>`)}
      ${section("Languages", `<div class="language-row">${languages.map(languageItem).join("")}</div>`, "languages")}
    </section>
  </main>
</body>
</html>
`;
}

function contactItem(item, index) {
  const icons = ["pin", "tel", "mail", "link"];
  const icon = icons[index] ?? "link";
  const className = index === 0 ? "contact-item" : "contact-item contact-action";
  return `<span class="${className}"><span class="contact-icon icon-${icon}" aria-hidden="true"></span>${escapeHtml(item)}</span>`;
}

function section(title, content, extraClass = "") {
  if (!content.trim()) {
    return "";
  }

  return `<section class="section ${extraClass}">
    <h2 class="section-title">${escapeHtml(title)}</h2>
    ${content}
  </section>`;
}

function experienceItem(item) {
  return `<article class="item">
    <h3 class="item-title">${escapeHtml(item.organization)}</h3>
    <p class="item-subtitle">${escapeHtml(item.position)}</p>
    <p>${escapeHtml(item.location)}</p>
    <p class="item-date">${escapeHtml(item.date)}</p>
    ${bulletList(item.bullets)}
  </article>`;
}

function certificationItem(item) {
  return `<article class="item">
    <h3 class="item-title">${escapeHtml(item.title)}</h3>
    <p class="item-subtitle">${escapeHtml(item.name)}</p>
    <p class="item-date">${escapeHtml(item.date)}</p>
    ${item.summary ? `<p class="copy">${escapeHtml(item.summary)}</p>` : ""}
    ${item.url ? `<p class="project-link">${escapeHtml(item.url)}</p>` : ""}
    ${bulletList(item.bullets)}
  </article>`;
}

function skillItem(skill) {
  const level = Math.max(0, Math.min(6, Number(skill.level ?? 5)));
  const bars = Array.from({ length: level }, () => "<span></span>").join("");

  return `<article class="skill">
    <h3 class="skill-name">${escapeHtml(skill.name)}</h3>
    <div class="skill-bars" aria-hidden="true">${bars}</div>
    <p class="skill-text">${escapeHtml((skill.keywords ?? []).join(", "))}</p>
  </article>`;
}

function educationItem(item) {
  return `<article class="item">
    <h3 class="item-title">${escapeHtml(item.institution)}</h3>
    <p>${escapeHtml(item.area)}</p>
    <p>${escapeHtml(item.score)}</p>
    <p>${escapeHtml(item.studyType)}</p>
    <p class="item-date">${escapeHtml(item.date)}</p>
  </article>`;
}

function projectItem(project) {
  return `<article class="project">
    <h3>${escapeHtml(project.title)}</h3>
    <p class="project-summary">${escapeHtml(project.summary)}</p>
    ${project.date ? `<p class="project-date">${escapeHtml(project.date)}</p>` : ""}
    ${bulletList(project.bullets)}
    <p class="tags">${escapeHtml((project.tags ?? []).join(", "))}</p>
    <p class="project-link">${escapeHtml(project.url)}</p>
  </article>`;
}

function languageItem(language) {
  const name = typeof language === "string" ? language : language.name;
  const level = Math.max(0, Math.min(5, Number(typeof language === "string" ? 5 : language.level ?? 5)));
  const bars = Array.from({ length: 5 }, (_, index) => {
    const className = index < level ? ' class="filled"' : "";
    return `<span${className}></span>`;
  }).join("");

  return `<article class="language">
    <p class="language-name">${escapeHtml(name)}</p>
    <div class="language-bars" aria-hidden="true">${bars}</div>
  </article>`;
}

function bulletList(items = []) {
  if (!items.length) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${formatBullet(item)}</li>`).join("")}</ul>`;
}

function formatBullet(value) {
  const text = String(value ?? "");
  const colon = text.indexOf(":");

  if (colon > 0 && colon <= 42) {
    return `<strong>${escapeHtml(text.slice(0, colon + 1))}</strong>${escapeHtml(text.slice(colon + 1))}`;
  }

  return escapeHtml(text);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
