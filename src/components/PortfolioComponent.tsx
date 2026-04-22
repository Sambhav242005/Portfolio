import { PortfolioData } from "@/lib/portfolio-data";
import HeroScene from "./3d/HeroScene";
import { AnimatedSection } from "./AnimatedSection";
import { ProjectShowcase } from "./ProjectShowcase";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { SkillsSection } from "./SkillsSection";
import { CertificationsGrid } from "./CertificationsGrid";
import { Footer } from "./Footer";
import { SocialButton } from "./utility/common";
import { Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-28 pb-12 md:px-0">
        <HeroScene />
        
        <div className="z-10 text-center px-4 pointer-events-none">
          <AnimatedSection direction="up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-xl text-foreground">
              {data.profile.name}
            </h1>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-3xl mb-8 font-light text-foreground/90 drop-shadow-lg">
              {data.profile.tagline}
            </p>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.6}>
            <div className="mt-8 flex flex-wrap justify-center gap-6 pointer-events-auto">
              <SocialButton
                href={data.profile.github}
                icon={<GithubIcon className="w-8 h-8" />}
                label="GitHub"
                className="text-foreground hover:text-primary transition-colors glow-hover"
              />
              <SocialButton
                href={data.profile.linkedin}
                icon={<LinkedinIcon className="w-8 h-8" />}
                label="LinkedIn"
                className="text-foreground hover:text-primary transition-colors glow-hover"
              />
              <SocialButton
                href={`mailto:${data.profile.email}`}
                icon={<Mail className="w-8 h-8" />}
                label="Mail"
                className="text-foreground hover:text-primary transition-colors glow-hover"
              />
            </div>
            
            <div className="mt-12 flex flex-col justify-center gap-4 pointer-events-auto sm:flex-row">
              <a
                href="#projects"
                className={cn(buttonVariants({ size: "lg" }), "px-8 shadow-lg shadow-primary/30 font-bold")}
              >
                View Work
              </a>
              <a
                href="/cv"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8 bg-foreground/5 backdrop-blur-md text-foreground border-foreground/30 hover:bg-foreground/10 hover:text-foreground font-bold")}
              >
                View CV
              </a>
            </div>
          </AnimatedSection>
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
      <section className="container mx-auto px-4 py-24" id="about">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Who I Am</h2>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-medium">
              {data.profile.summary}
            </p>
          </AnimatedSection>
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
