"use client";

import { CertificationData } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import { Award, ExternalLink } from "lucide-react";

export function CertificationsGrid({ data }: { data: CertificationData[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-24" id="certifications">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up">
          <div className="mx-auto mb-12 grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="mb-4 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Credentials
              </span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">Certifications, awards, and proof of practice.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              External signals that sit beside the project work: courses, hackathons, and structured learning.
            </p>
          </div>
        </AnimatedSection>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
          {data.map((cert, index) => (
            <AnimatedSection key={cert.id} delay={index * 0.1} direction="up">
              <div className="group relative h-full overflow-hidden rounded-[8px] border border-border/70 bg-card/85 p-6 shadow-sm transition-colors hover:border-primary/35">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>

                <div className="relative z-10">
                  <span className="mb-3 inline-flex rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {cert.date}
                  </span>

                  <h3 className="mb-2 text-xl font-bold leading-tight text-foreground">{cert.title}</h3>
                  <p className="mb-4 text-sm font-semibold text-primary">{cert.issuer}</p>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {cert.description}
                  </p>

                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent-foreground"
                    >
                      View Credential <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
