import { PortfolioData } from "@/lib/portfolio-data";
import HeroScene from "./3d/HeroScene";
import { AnimatedSection } from "./AnimatedSection";
import { ProjectShowcase } from "./ProjectShowcase";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { SkillsSection } from "./SkillsSection";
import { CertificationsGrid } from "./CertificationsGrid";
import { Footer } from "./Footer";
import { SocialButton } from "./utility/common";
import { ArrowRight, Bot, BrainCircuit, Code2, DatabaseZap, FileText, Mail, ScanFace, Workflow } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const proofPoints = [
  { label: "AI agents", icon: BrainCircuit },
  { label: "Computer vision", icon: ScanFace },
  { label: "Full-stack systems", icon: Workflow },
];

const capabilityHighlights = [
  {
    title: "Agent workflows",
    detail: "LangChain, LangGraph, tool routing, and backend APIs shaped into working product flows.",
    icon: Bot,
  },
  {
    title: "Computer vision",
    detail: "YOLO, OpenCV, recognition pipelines, and vector retrieval built for real-time use cases.",
    icon: ScanFace,
  },
  {
    title: "Product engineering",
    detail: "Next.js, FastAPI, Docker, databases, and deployment details handled as one system.",
    icon: Code2,
  },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.04-.015-2.04-3.338.72-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.745.084-.73.084-.73 1.205.085 1.838 1.235 1.838 1.235 1.07 1.835 2.809 1.305 3.495.995.105-.775.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.37 1.235-3.205-.12-.3-.54-1.524.12-3.16 0 0 1.005-.315 3.285 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.555 3.285-1.23 3.285-1.23.66 1.636.24 2.86.12 3.16.77.835 1.235 1.9 1.235 3.205 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.771v20.458C0 23.227.792 24 1.771 24h20.45C23.2 24 24 23.227 24 22.228V1.771C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function PortfolioComponent({ data }: { data: PortfolioData }) {
  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col">
      
      {/* 3D Hero Section */}
      <section className="relative min-h-[100svh] overflow-hidden px-4 pt-28 pb-16 md:px-8 lg:px-12">
        <HeroScene />
        
        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-9rem)] max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="pointer-events-none max-w-3xl text-left">
            <AnimatedSection direction="right" delay={0.15}>
              <span className="mb-6 inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                AI systems builder
              </span>
              <h1 className="mb-6 text-5xl font-extrabold leading-[0.95] tracking-tight text-foreground md:text-7xl">
                {data.profile.name}
              </h1>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.3}>
              <p className="max-w-2xl text-xl font-semibold leading-snug text-foreground/90 md:text-3xl">
                AI Engineer & Python Developer building useful agents, vision systems, and production-ready web tools.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                {data.profile.tagline}
              </p>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.45}>
              <div className="mt-8 flex flex-wrap gap-3">
                {proofPoints.map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm font-medium text-foreground/85 shadow-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="pointer-events-auto mt-9 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className={cn(buttonVariants({ size: "lg" }), "gap-2 px-8 font-bold shadow-lg shadow-primary/20")}
                >
                  View Work <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "gap-2 border-foreground/25 bg-background/60 px-8 font-bold text-foreground backdrop-blur-md hover:bg-background/80 hover:text-foreground"
                  )}
                >
                  <FileText className="h-4 w-4" /> View CV
                </a>
              </div>

              <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
                <SocialButton
                  href={data.profile.github}
                  icon={<GithubIcon className="h-5 w-5" />}
                  label="GitHub"
                  className="h-11 w-11 rounded-full border border-border/70 bg-background/60 text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
                />
                <SocialButton
                  href={data.profile.linkedin}
                  icon={<LinkedinIcon className="h-5 w-5" />}
                  label="LinkedIn"
                  className="h-11 w-11 rounded-full border border-border/70 bg-background/60 text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
                />
                <SocialButton
                  href={`mailto:${data.profile.email}`}
                  icon={<Mail className="h-5 w-5" />}
                  label="Mail"
                  className="h-11 w-11 rounded-full border border-border/70 bg-background/60 text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
                />
              </div>
            </AnimatedSection>
          </div>

          <div className="hidden min-h-[28rem] lg:block" aria-hidden="true" />
        </div>
        
        {/* Scroll indicator */}
        <AnimatedSection direction="up" delay={1.5} className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none text-foreground/50">
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-xs mb-2 tracking-widest uppercase shadow-black drop-shadow-md">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent" />
          </div>
        </AnimatedSection>
      </section>

      {/* About Section */}
      <section className="relative overflow-hidden border-y border-border/70 bg-muted/20 py-24 md:py-28" id="about">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <AnimatedSection direction="right">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Build profile
                </span>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                  I turn AI ideas into systems people can actually open, test, and use.
                </h2>
                <p className="mt-6 text-base leading-7 text-muted-foreground md:text-lg">
                  {data.profile.summary}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.12}>
              <div className="grid gap-4">
                <div className="rounded-[8px] border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                    Current focus
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">AI engineering</p>
                </div>
                <div className="rounded-[8px] border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                    <Workflow className="h-4 w-4 text-primary" />
                    Featured builds
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{data.projects.length} projects</p>
                </div>
                <div className="rounded-[8px] border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                    <DatabaseZap className="h-4 w-4 text-primary" />
                    Toolkit breadth
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{data.skills.length} skill groups</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="mx-auto mt-12 grid max-w-7xl gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            {capabilityHighlights.map(({ title, detail, icon: Icon }, index) => (
              <AnimatedSection key={title} direction="up" delay={index * 0.08}>
                <div className={cn(
                  "h-full rounded-[8px] border border-border/70 bg-background/70 p-6 shadow-sm transition-colors hover:border-primary/35",
                  index === 0 && "lg:row-span-2 lg:p-8"
                )}>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <ExperienceTimeline data={data.experience} />
      <ProjectShowcase data={data.projects} />
      <SkillsSection data={data.skills} />
      <CertificationsGrid data={data.certifications} />

      <Footer data={data.profile} />
    </main>
  );
}
