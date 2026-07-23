import type { Metadata } from "next";
import { IconBrandGithub, IconBrandLinkedin, IconDownload, IconExternalLink } from "@tabler/icons-react";
import { getProjects } from "@/lib/content/projects";
import { getPublicProfile } from "@/lib/resume/profile";

export const metadata: Metadata = {
  title: "Resume | Sambhav Surana",
  description: "Resume timeline, skills, and PDF download for Sambhav Surana.",
};

export default async function ResumePage() {
  const profile = getPublicProfile();
  const proofProjects = (await getProjects()).filter((project) => project.githubUrl || project.liveUrl).slice(0, 8);
  const github = profile.profiles.find((item) => item.network === "GitHub")?.url;
  const linkedin = profile.profiles.find((item) => item.network === "LinkedIn")?.url;

  return (
    <main className="subpage-main">
      <header className="subpage-header subpage-header-row">
        <div>
          <h1>Resume</h1>
          <p>{profile.summary}</p>
        </div>
        <a className="button button-primary" href="/resume/sambhav-surana-resume.pdf" download>
          Download PDF
          <IconDownload aria-hidden="true" size={16} stroke={1.8} />
        </a>
      </header>

      <section className="resume-snapshot" aria-label="Resume proof links">
        <div>
          <span className="resume-snapshot-label">Target roles</span>
          <p>AI/ML intern, AI engineer, Python developer, and full-stack AI product builder.</p>
        </div>
        <div className="resume-profile-links">
          {github ? (
            <a href={github} target="_blank" rel="noreferrer">
              GitHub
              <IconBrandGithub aria-hidden="true" size={15} stroke={1.8} />
            </a>
          ) : null}
          {linkedin ? (
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn
              <IconBrandLinkedin aria-hidden="true" size={15} stroke={1.8} />
            </a>
          ) : null}
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </section>

      <section className="resume-page-grid">
        <div className="timeline-list timeline-list-full">
          {profile.timeline.map((item) => (
            <article className="timeline-item" key={`${item.date}-${item.title}`}>
              <span>{item.date}</span>
              <h2>{item.title}</h2>
              <p>{item.meta}</p>
            </article>
          ))}
        </div>

        <aside className="resume-skills">
          <section>
            <h2>Project Proof</h2>
            <div className="resume-proof-list">
              {proofProjects.map((project) => (
                <a key={project.slug} href={project.githubUrl ?? project.liveUrl} target="_blank" rel="noreferrer">
                  <span>{project.title}</span>
                  <IconExternalLink aria-hidden="true" size={14} stroke={1.8} />
                </a>
              ))}
            </div>
          </section>
          {profile.skillGroups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              <div className="chip-row">
                {group.skills.map((skill) => (
                  <span className="chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </aside>
      </section>
    </main>
  );
}
