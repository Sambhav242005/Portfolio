"use client";

import { ExperienceData } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import { Briefcase, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export function ExperienceTimeline({ data }: { data: ExperienceData[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative py-24" id="experience">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up">
          <div className="mx-auto mb-14 grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className="mb-4 inline-flex rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
                Experience
              </span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                Practical work, club leadership, and AI project delivery.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              Each entry is kept focused on contribution, collaboration, and the engineering habits behind the projects.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-primary/60 via-border to-accent/50"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.25, ease: "easeInOut" }}
          />

          <div className="space-y-10">
            {data.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.id} className="relative flex flex-col md:flex-row md:items-center">
                  <div className={`hidden md:block w-1/2 ${isEven ? 'pr-12 text-right' : 'order-last pl-12 text-left'}`}>
                    <AnimatedSection direction={isEven ? "right" : "left"} delay={0.1}>
                      <TimelineCard item={item} />
                    </AnimatedSection>
                  </div>

                  <div className="hidden md:flex absolute left-1/2 z-10 h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-primary/35 bg-background shadow-lg shadow-primary/10">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>

                  <div className="relative ml-4 w-full border-l border-border pl-8 md:hidden">
                    <div className="absolute left-[-10px] top-4 h-5 w-5 rounded-full border border-primary/40 bg-background">
                      <div className="m-1.5 h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <AnimatedSection direction="up">
                      <TimelineCard item={item} />
                    </AnimatedSection>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ item }: { item: ExperienceData }) {
  return (
    <div className="rounded-[8px] border border-border/70 bg-card/85 p-6 text-left shadow-sm transition-colors hover:border-primary/35">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <CalendarDays className="h-3.5 w-3.5" />
        {item.dateRange}
      </span>
      <h3 className="mb-1 text-xl font-bold text-foreground">{item.role}</h3>
      <p className="mb-5 text-sm font-semibold leading-6 text-muted-foreground">{item.company}</p>
      
      <ul className="space-y-3 text-sm text-foreground/90">
        {item.bullets.map((bullet, i) => (
          <li key={i} className="relative pl-5 leading-relaxed">
            <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
