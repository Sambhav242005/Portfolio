"use client";

import { SkillCategory } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import type { ComponentType } from "react";
import * as Icons from "lucide-react";

const skillIconMap: Record<string, string> = {
  python: "Braces",
  javascript: "FileJson2",
  sql: "DatabaseZap",
  bash: "TerminalSquare",
  numpy: "Sigma",
  pandas: "Table2",
  "scikit-learn": "ChartSpline",
  tensorflow: "BrainCircuit",
  pytorch: "Box",
  matplotlib: "ChartLine",
  opencv: "ScanSearch",
  yolo: "ScanEye",
  "face recognition": "ScanFace",
  "object detection": "Eye",
  cnn: "Network",
  "neural networks": "BrainCircuit",
  "model training": "Activity",
  "transfer learning": "Workflow",
  langchain: "MessagesSquare",
  "openai api": "Sparkles",
  ollama: "Bot",
  "llm integration": "MessageSquare",
  "react.js": "Atom",
  "next.js": "PanelTop",
  "html/css": "CodeXml",
  "tailwind css": "Paintbrush",
  mysql: "Database",
  mongodb: "DatabaseZap",
  chromadb: "Boxes",
  git: "GitBranch",
  docker: "Container",
  "rest apis": "Route",
  "vs code": "Code2",
};

function toIconName(value: string) {
  return value
    .split(/[-_\s/]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function getIcon(name: string, fallback = "Code2") {
  const iconName = skillIconMap[name.toLowerCase()] || toIconName(name);
  const icons = Icons as unknown as Record<string, ComponentType<{ className?: string }>>;
  return icons[iconName] || icons[fallback] || Icons.Code2;
}

export function SkillsSection({ data }: { data: SkillCategory[] }) {
  return (
    <section className="border-y border-border/70 bg-muted/25 py-24" id="skills">
      <div className="container mx-auto px-4">
      <AnimatedSection direction="up">
        <div className="mx-auto mb-12 grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
              Skill map
            </span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">Tools grouped by what they help build.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            A practical toolkit across AI models, computer vision, web applications, data, and deployment.
          </p>
        </div>
      </AnimatedSection>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2">
        {data.map((category, index) => (
          <AnimatedSection key={index} delay={index * 0.1} direction="up">
            <SkillCard category={category} />
          </AnimatedSection>
        ))}
      </div>
      </div>
    </section>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  const IconComponent = getIcon(category.icon, "Code2");

  return (
    <div className="flex h-full flex-col rounded-[8px] border border-border/70 bg-background/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
          <IconComponent className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-semibold">{category.category}</h3>
      </div>
      
      <ul className="grid flex-grow grid-cols-1 gap-3 sm:grid-cols-2">
        {category.items.map((skill, index) => (
          <SkillChip key={index} name={skill.name} />
        ))}
      </ul>
    </div>
  );
}

function SkillChip({ name }: { name: string }) {
  const IconComponent = getIcon(name);

  return (
    <li className="group flex min-h-12 items-center gap-3 rounded-[8px] border border-border/60 bg-card/70 px-3 py-2.5 text-sm font-medium text-foreground/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <IconComponent className="h-4 w-4" />
      </span>
      <span className="min-w-0 leading-tight">{name}</span>
    </li>
  );
}
