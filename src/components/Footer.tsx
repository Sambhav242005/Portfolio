"use client";

import { Mail } from "lucide-react";
import { ProfileData } from "@/lib/portfolio-data";
import { SocialButton } from "./utility/common";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.04-.015-2.04-3.338.72-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.745.084-.73.084-.73 1.205.085 1.838 1.235 1.838 1.235 1.07 1.835 2.809 1.305 3.495.995.105-.775.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.37 1.235-3.205-.12-.3-.54-1.524.12-3.16 0 0 1.005-.315 3.285 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.555 3.285-1.23 3.285-1.23.66 1.636.24 2.86.12 3.16.77.835 1.235 1.9 1.235 3.205 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.771v20.458C0 23.227.792 24 1.771 24h20.45C23.2 24 24 23.227 24 22.228V1.771C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer({ data }: { data: ProfileData }) {
  if (!data) return null;

  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-muted/25 py-10">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[8px] border border-border/70 bg-background/75 p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Open to AI and software roles</p>
            <h3 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">{data.name}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{data.tagline}</p>
          </div>

          <div className="flex gap-3">
            <SocialButton
              href={data.github}
              icon={<GithubIcon className="h-5 w-5" />}
              label="GitHub"
              className="h-11 w-11 rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
            />
            <SocialButton
              href={data.linkedin}
              icon={<LinkedinIcon className="h-5 w-5" />}
              label="LinkedIn"
              className="h-11 w-11 rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
            />
            <SocialButton
              href={`mailto:${data.email}`}
              icon={<Mail className="h-5 w-5" />}
              label="Mail"
              className="h-11 w-11 rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-7xl flex-col flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
          <p>Copyright {new Date().getFullYear()} {data.name}. All rights reserved.</p>
          <p>Built with Next.js, Tailwind CSS and React Three Fiber</p>
        </div>
      </div>
    </footer>
  );
}
