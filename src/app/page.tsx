import Link from "next/link";
import {
  IconArrowRight,
  IconBrain,
  IconCode,
  IconDownload,
  IconSettings,
} from "@tabler/icons-react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { SocialLinks } from "@/components/public/SocialLinks";
import { GradientMesh } from "@/components/public/GradientMesh";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getFeaturedProjects } from "@/lib/content/projects";
import { formatDate, getWriting } from "@/lib/content/writing";
import { getPublicProfile } from "@/lib/resume/profile";

const groupIcons = [IconBrain, IconCode, IconSettings];

export default async function Home() {
  const profile = getPublicProfile();
  const projects = await getFeaturedProjects();
  const writing = (await getWriting()).slice(0, 3);

  return (
    <main>
      <section className="hero-section" id="work">
        <div className="hero-copy">
          <p className="intro-line">Hi, I&apos;m {profile.name}</p>
          <h1>{profile.headline}</h1>
          <p className="hero-summary">
            {profile.summary}
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projects">
              View Projects
              <IconArrowRight aria-hidden="true" size={17} stroke={1.7} />
            </Link>
            <a className="button button-secondary" href="/resume/sambhav-surana-resume.pdf" download>
              Download Resume
              <IconDownload aria-hidden="true" size={17} stroke={1.7} />
            </a>
          </div>
          <SocialLinks profile={profile} />
        </div>
        <GradientMesh className="hero-art" />
      </section>

      <ScrollReveal>
        <section className="section-block" id="projects">
          <SectionHeading title="Featured Projects" actionLabel="View all projects" actionHref="/projects" />
          <div className="featured-project-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} className={index === 0 ? "project-card-large" : ""} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="section-block" id="skills">
          <SectionHeading title="Skills" />
          <div className="skills-grid">
            {profile.skillGroups.map((group, index) => {
              const Icon = groupIcons[index % groupIcons.length];
              return (
                <article className="skill-group" key={group.title}>
                  <h3>
                    <Icon aria-hidden="true" size={22} stroke={1.6} />
                    {group.title}
                  </h3>
                  <div className="chip-row">
                    {group.skills.map((skill) => (
                      <span className="chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="section-block resume-writing-grid" id="resume">
          <div>
            <SectionHeading title="Resume Timeline" actionLabel="Full resume" actionHref="/resume" />
            <div className="timeline-list">
              {profile.timeline.map((item) => (
                <article className="timeline-item" key={`${item.date}-${item.title}`}>
                  <span>{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                </article>
              ))}
            </div>
          </div>

          {writing.length > 0 ? (
            <div id="writing">
              <SectionHeading title="Writing & Research" actionLabel="View all" actionHref="/writing" />
              <div className="writing-list">
                {writing.map((item) => (
                  <article className="writing-item" id={item.slug} key={item.slug}>
                    <div>
                      <span>{formatDate(item.date)}</span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                    <Link href={`/writing/${item.slug}`}>Read</Link>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </ScrollReveal>
    </main>
  );
}
