"use client";

import { CertificationData } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import { Award, ExternalLink } from "lucide-react";

export function CertificationsGrid({ data }: { data: CertificationData[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16" id="certifications">
      <AnimatedSection direction="up">
        <h2 className="text-3xl font-bold mb-12 text-center text-gradient">Certifications & Awards</h2>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {data.map((cert, index) => (
          <AnimatedSection key={cert.id} delay={index * 0.1} direction="up">
            <div className="glass p-6 rounded-2xl h-full glow-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-24 h-24 text-primary" />
              </div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-accent-foreground bg-accent/20 rounded-full">
                  {cert.date}
                </span>
                
                <h3 className="text-xl font-bold mb-2 pr-8">{cert.title}</h3>
                <p className="text-primary font-medium mb-4 text-sm">{cert.issuer}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {cert.description}
                </p>
                
                {cert.link && (
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
                  >
                    View Credential <ExternalLink className="ml-1 w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
