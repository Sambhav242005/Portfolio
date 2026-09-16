import Link from "next/link";
import { IconBrain, IconCode, IconSettings } from "@tabler/icons-react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { HeroCopy } from "@/components/public/HeroCopy";
import { EmbeddingSpaceHero } from "@/components/public/EmbeddingSpaceHero";
import { AnimatedHero } from "@/components/public/AnimatedHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getFeaturedProjects } from "@/lib/content/projects";
import { formatDate, getWriting } from "@/lib/content/writing";
import { getPublicProfile } from "@/lib/resume/profile";

const groupIcons = [IconBrain, IconCode, IconSettings];

function clusterForGroup(title: string) {
  const t = title.toLowerCase();
  if (t.includes("vision")) return 0;
  if (t.includes("nlp") || t.includes("generative") || t.includes("agent")) return 1;
  if (t.includes("deep") || t.includes("ml ") || t.includes("machine")) return 2;
  return 3;
}

function clusterForProject(tags: string[]) {
  const joined = tags.join(" ").toLowerCase();
  if (/(vision|yolo|face|object detection|image|webgpu|onnx)/.test(joined)) return 0;
  if (/(chromadb|graphrag|ollama|langchain|agent|llm)/.test(joined)) return 1;
  if (/(pytorch|transformers|training|research|fineweb)/.test(joined)) return 2;
  return 3;
}

export default async function Home() {
  const profile = getPublicProfile();
  const projects = await getFeaturedProjects();
  const writing = (await getWriting()).slice(0, 3);

  const embeddingNodes = profile.skillGroups.flatMap((group) =>
    group.skills.map((skill) => ({
      label: skill,
      cluster: clusterForGroup(group.title),
    })),
  );

  const embeddingProjects = projects.map((project) => ({
    label: project.title,
    cluster: clusterForProject(project.tags),
    href: `/projects/${project.slug}`,
  }));

  return (
    <main>
      <AnimatedHero className="hero-section hero-section--embedding">
        <EmbeddingSpaceHero nodes={embeddingNodes} projects={embeddingProjects} />
        <HeroCopy profile={profile} />
      </AnimatedHero>

      <ScrollReveal>
        <section className="section-block" id="work">
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
