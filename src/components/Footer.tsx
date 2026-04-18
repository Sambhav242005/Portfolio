"use client";

import { ProfileData } from "@/lib/portfolio-data";
import { SocialButton } from "./utility/common";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer({ data }: { data: ProfileData }) {
  if (!data) return null;

  return (
    <footer className="border-t border-border mt-20 pt-12 pb-8 bg-muted/20 relative overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gradient mb-2">{data.name}</h3>
            <p className="text-muted-foreground text-sm">{data.tagline}</p>
          </div>
          
          <div className="flex space-x-4">
            <SocialButton
              href={data.github}
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
              className="text-muted-foreground hover:text-primary transition-colors"
            />
            <SocialButton
              href={data.linkedin}
              icon={<Linkedin className="w-5 h-5" />}
              label="LinkedIn"
              className="text-muted-foreground hover:text-primary transition-colors"
            />
            <SocialButton
              href={`mailto:${data.email}`}
              icon={<Mail className="w-5 h-5" />}
              label="Mail"
              className="text-muted-foreground hover:text-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between flex-wrap items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {data.name}. All rights reserved.</p>
          <p>Built with Next.js, Tailwind CSS & React Three Fiber</p>
        </div>
      </div>
    </footer>
  );
}
