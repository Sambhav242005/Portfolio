# Sambhav Surana Portfolio

Blueprint-aligned public portfolio for Sambhav Surana.

## Data Sources

- Site content: `data/site.json`
  - `resume`: profile, timeline, skills, certifications, education, and resume settings
  - `projects`: public project cards, project source repositories, and resume project priority
  - `writingSources`: explicit GitHub repositories that contribute writing articles
  - `writingOverrides`: local metadata overrides keyed by writing slug
- Project metadata and case studies: each project's GitHub repository `docs/writing/case-study.md`
- Writing entries: enabled `writingSources` GitHub repository markdown files under `docs/writing/**/*.md`, excluding `case-study.md`
- Resume PDF: `public/resume/sambhav-surana-resume.pdf`

Remote GitHub content defaults to the `main` ref. Set `content.ref` on a project or `ref` on a writing source only when the repository uses another branch, tag, or commit SHA. Writing sources can provide explicit markdown `paths`; when they do, the loader fetches those raw files directly and skips GitHub's recursive tree API. Sources without `paths` use GitHub API tree discovery, so set `GITHUB_TOKEN` or `GH_TOKEN` in local/hosting environments if you need higher GitHub rate limits.

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
title: Project title shown on the portfolio
slug: project-slug
summary: Short project card summary.
status: published
order: 1
featured: true
updatedAt: 2026-06-30
tags:
  - Tag
---
```

Only `contentKind: case-study` is required while `data/site.json` still provides the same project metadata. When present, `title`, `slug`, `summary`, `status`, `order`, `featured`, `updatedAt`, and `tags` override the matching `data/site.json` fields. GitHub URL, live URL, cover image configuration, and resume metadata stay in `data/site.json`.

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

Files with `status: draft` are not shown publicly. Project repositories are not automatic writing sources; add a repo to `writingSources` and set `enabled: true` when you want its article markdown to appear. Prefer adding a `paths` array for known article files so the site does not need a GitHub tree scan on every source. Disabled placeholder entries are ignored. If a project repo is also a writing source, that project's configured case-study markdown path is skipped automatically.

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
