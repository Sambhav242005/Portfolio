import { PortfolioData } from "@/lib/portfolio-data";
import HeroScene from "./3d/HeroScene";
import { AnimatedSection } from "./AnimatedSection";
import { ProjectShowcase } from "./ProjectShowcase";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { SkillsSection } from "./SkillsSection";
import { CertificationsGrid } from "./CertificationsGrid";
import { Footer } from "./Footer";
import ContactMe from "./contactme";
import { SocialButton } from "./utility/common";
import { Github, Linkedin, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PortfolioComponent({ data }: { data: PortfolioData }) {
  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      {/* 3D Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        <div className="z-10 text-center px-4 mt-20 pointer-events-none">
          <AnimatedSection direction="up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg text-foreground">
              {data.profile.name}
            </h1>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-3xl mb-8 font-light text-foreground/90 drop-shadow-md">
              {data.profile.tagline}
            </p>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.6}>
            <div className="flex justify-center space-x-6 pointer-events-auto mt-8">
              <SocialButton
                href={data.profile.github}
                icon={<Github className="w-8 h-8" />}
                label="GitHub"
                className="text-foreground hover:text-primary transition-colors glow-hover"
              />
              <SocialButton
                href={data.profile.linkedin}
                icon={<Linkedin className="w-8 h-8" />}
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
            
            <div className="mt-12 flex justify-center space-x-4 pointer-events-auto">
              <a
                href="#projects"
                className={cn(buttonVariants({ size: "lg" }), "px-8 shadow-lg shadow-primary/30")}
              >
                View Work
              </a>
              <a
                href="/cv"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8 bg-foreground/5 backdrop-blur-md text-foreground border-foreground/20 hover:bg-foreground/10 hover:text-foreground")}
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
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-light">
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
    </div>
  );
}
