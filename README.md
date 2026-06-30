# Sambhav Surana Portfolio

Blueprint-aligned public portfolio for Sambhav Surana.

## Data Sources

- Site content: `data/site.json`
  - `resume`: profile, timeline, skills, certifications, education, and resume settings
  - `projects`: public project cards, project source repositories, and resume project priority
  - `writingSources`: optional non-project GitHub repositories that contribute writing only
  - `writingOverrides`: local metadata overrides keyed by writing slug
- Project case studies: each published project's GitHub repository `docs/writing/case-study.md`
- Writing entries: public GitHub repository markdown files under `docs/writing/**/*.md`, excluding `case-study.md`
- Resume PDF: `public/resume/sambhav-surana-resume.pdf`

## Resume Generator

- Generator: `scripts/generate-resume.mjs`
- Input: `data/site.json`
- Outputs: `public/resume/sambhav-surana-resume.pdf` and `public/resume/sambhav-surana-resume.html`
- Style asset: `public/resume/profile-photo.jpg`

Run `npm run resume:generate` after editing `data/site.json`. The `dev` script also runs the generator first. The `build` script regenerates the HTML and reuses the committed PDF if Chrome or Edge is unavailable, which keeps hosted builds working on environments without a browser binary. The generator uses the `resume` object from `data/site.json` as the resume-builder source and renders a blue-header builder-style PDF/HTML.

Resume projects are selected from published records in `data/site.json` `projects`, sorted by `resume.priority`, and capped at four items so the resume remains a two-page document.

Each resume project must define explicit `resume.bullets`; project case-study markdown is not used as a resume fallback.

## Remote Markdown Contract

Project case studies live at `docs/writing/case-study.md` by default and must start with:

```md
---
contentKind: case-study
---
```

Writing articles can live in nested folders under `docs/writing/` and must use frontmatter:

```md
---
contentKind: article
slug: article-slug
title: Article title
type: technical-note
status: published
date: 2026-06-25
summary: Short index summary.
tags:
  - Tag
---
```

Files with `status: draft` are not shown publicly. Additional writing-only repositories can be added to `writingSources`; disabled placeholder entries are ignored.

Project visuals are resolved from each project's GitHub repository first: `docs/portfolio-cover.svg` on `main`, then `master`. If that SVG is not available, the site falls back to the project's local `coverImage`, then `public/project-assets/default-project-cover.svg`.

The public site must not expose admin, login, JSON sync, database controls, or private Obsidian notes.

## Routes

- `/`
- `/projects`
- `/projects/[slug]`
- `/writing`
- `/writing/[slug]`
- `/resume`
- `/contact`

## Commands

```bash
npm run dev
npm run resume:generate
npm run build
npm run lint
```
