"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import {
  BrainCircuit,
  Code,
  Cpu,
  Github,
  Linkedin,
  Mail
} from "lucide-react";
import { SocialButton } from "./utility/common";
import { cn } from "@/lib/utils";
import ContactMe from "./contactme";

function PortfolioComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center items-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sambhav Surana
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          AI Enthusiast | Data Science Student | Problem Solver
        </motion.p>

        {/* Social Links */}
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              staggerChildren: 0.5,
              type: "spring",
              mass: 2,
              staggerDirection: -1,
            },
          }}
        >
          <SocialButton
            href="https://github.com/Sambhav242005"
            icon={<Github />}
            label="GitHub"
            className="h-7 w-7"
          />
          <SocialButton
            href="https://www.linkedin.com/in/sambhav-surana-19a557279/"
            icon={<Linkedin />}
            label="LinkedIn"
            className="h-7 w-7"
          />
          <SocialButton
            href="mailto:sambhav242005@gmail.com"
            icon={<Mail />}
            label="Mail"
            className="h-7 w-7"
          />
        </motion.div>
        {/* CV Buttons */}
        <motion.div
          className="mt-6 flex justify-center space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="/api/viewcv"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "px-6")}
            aria-label="View CV"
          >
            View CV
          </a>

          <a
            href="/api/downloadcv"
            className={cn(buttonVariants({ variant: "outline" }), "px-6")}
            aria-label="Download CV"
          >
            Download CV
          </a>
        </motion.div>
      </section>

  <hr className="border-border" />

      {/* Resume / About Section (populated to match CV) */}
      <section className="container mx-auto px-4 py-16" id="about">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Third-year B.Tech student specializing in AI. Hands-on experience building practical machine learning
              and web applications — particularly in computer vision, NLP, and generative AI. Comfortable with Python,
              modern JavaScript frameworks, LLM integrations, and end-to-end project development. Passionate about
              research-driven solutions and building tools that assist decision making and automation.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Experience</h3>
            <div className="space-y-4">
              <ExperienceItem
                role="AI / ML Developer"
                company="Personal Projects"
                dateRange="2023 - Present"
                bullets={[
                  "Built research tools integrating web search and local LLMs for cited answers.",
                  "Developed real-time collaborative apps with AI-assisted features using Next.js and WebSockets.",
                ]}
              />

              <ExperienceItem
                role="Club Member"
                company="Abhyudaya Coding Club — Shri Vaishnav Vidyapeeth Vishwavidyalaya"
                dateRange="2024 - Present"
                bullets={[
                  "Developed AI-based projects including a Time Table Generation system using constraint satisfaction algorithms.",
                  "Organized workshops on Python, NumPy, Pandas, and Scikit-learn for club members.",
                  "Collaborated on model optimization and performance improvement across club projects.",
                ]}
              />

              <ExperienceItem
                role="Data Science / Open Source Contributions"
                company="Independent / Open Source"
                dateRange="2022 - 2023"
                bullets={[
                  "Implemented data pipelines, model training, and evaluation using scikit-learn and pandas.",
                  "Created dashboards and reproducible notebooks for stakeholders and demos.",
                ]}
              />
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">Education</h3>
            <EducationItem
              institution="Shri Vaishnav Vidyapeeth Vishwavidyalaya"
              degree="B.Tech — Computer Science (AI-IBM) — III Year"
              dateRange="2023 - Present"
              details={["Relevant: Machine Learning, NLP, Time Series, Statistics"]}
            />

            <h3 className="text-xl font-semibold mt-6 mb-3">Selected Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProjectCard
                title="Collaborative Whiteboard Tool"
                description="A real-time collaborative whiteboard with AI suggestions using Next.js and GPT-4o."
                technologies={["Next.js", "OpenAI API", "Bun", "WebSockets"]}
              />
              <ProjectCard
                title="Deep Search — AI-Powered Research Tool"
                description="Python + Gradio tool that merges DuckDuckGo results with local Ollama LLMs and returns fully cited answers."
                technologies={["Python", "Gradio", "Ollama", "DuckDuckGo API"]}
              />
              <ProjectCard
                title="Time Table Generation"
                description="Automated timetable generator for educational institutions using constraint satisfaction and optimization to handle teacher availability, room constraints and subject requirements."
                technologies={["Python", "Constraint Satisfaction", "Optimization", "Flask/Gradio UI"]}
              />
              <ProjectCard
                title="AI Face Detection & Recognition"
                description="Real-time face detection and recognition system using YOLO-face, face_recognition, OpenCV and ChromaDB for scalable embedding storage."
                technologies={["YOLOv11-face", "face_recognition", "OpenCV", "ChromaDB"]}
              />
            </div>
          </div>

          <aside className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p className="mb-2">sambhav242005@gmail.com</p>
            <p className="mb-4">GitHub: github.com/Sambhav242005</p>

            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Python, JavaScript, SQL</li>
              <li>Machine Learning: scikit-learn, TensorFlow, PyTorch</li>
              <li>Computer Vision: OpenCV, YOLO, face_recognition, ChromaDB</li>
              <li>LLMs & Tools: OpenAI API, Ollama, LangChain</li>
              <li>Web: Next.js, React, Gradio</li>
            </ul>

            <div className="flex space-x-2">
              <a
                href="/api/viewcv"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants(), "w-full text-center")}
              >
                View CV
              </a>
            </div>
            <div className="mt-3">
              <a href="/api/downloadcv" className={cn(buttonVariants({ variant: "outline" }), "w-full text-center")}>
                Download CV
              </a>
            </div>
          </aside>
        </div>
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Contact Section (kept) */}
  <section className="w-full mx-auto bg-muted px-4 py-20">
        <ContactMe className="max-w-xl mx-auto" />
      </section>
    </div>
  );
}

function SkillCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="bg-accent hover:opacity-95 dark:bg-card p-6 rounded-lg text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

function ProjectCard({ title, description, technologies }: { title: string; description: string; technologies: string[] }) {
  return (
    <motion.div
      className="bg-accent hover:opacity-95 dark:bg-card group p-6 rounded-lg"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="text-xl mb-2 group-hover:text-primary font-bold">{title}</h3>
      <p className="mb-4 font-light group-hover:text-primary">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ExperienceItem({
  role,
  company,
  dateRange,
  bullets,
}: {
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
}) {
  return (
    <div className="p-4 border rounded-md bg-white/60 dark:bg-white/5">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{role}</h4>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
        <div className="text-sm text-muted-foreground">{dateRange}</div>
      </div>
      <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function EducationItem({
  institution,
  degree,
  dateRange,
  details,
}: {
  institution: string;
  degree: string;
  dateRange: string;
  details: string[];
}) {
  return (
    <div className="p-4 border rounded-md bg-white/60 dark:bg-white/5">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{degree}</h4>
          <p className="text-sm text-muted-foreground">{institution}</p>
        </div>
        <div className="text-sm text-muted-foreground">{dateRange}</div>
      </div>
      <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
        {details.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

export default PortfolioComponent;
