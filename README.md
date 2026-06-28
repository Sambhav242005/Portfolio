# Sambhav Surana Portfolio

Blueprint-aligned public portfolio for Sambhav Surana.

## Data Sources

- Site content: `data/site.json`
  - `resume`: profile, timeline, skills, certifications, education, and resume settings
  - `projects`: public project cards, detail pages, and resume project priority
  - `writing`: writing and research entries
- Resume PDF: `public/resume/sambhav-surana-resume.pdf`

## Resume Generator

- Generator: `scripts/generate-resume.mjs`
- Input: `data/site.json`
- Outputs: `public/resume/sambhav-surana-resume.pdf` and `public/resume/sambhav-surana-resume.html`
- Style asset: `public/resume/profile-photo.jpg`

Run `npm run resume:generate` after editing `data/site.json`. The `dev` and `build` scripts also run the generator first. The generator uses the `resume` object from `data/site.json` as the resume-builder source and renders a blue-header builder-style PDF/HTML.

Resume projects are selected from published records in `data/site.json` `projects`, sorted by `resume.priority`, and capped at four items so the resume remains a two-page document.

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
