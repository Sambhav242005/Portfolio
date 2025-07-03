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
    <div className="min-h-screen bg-white text-[#2C3E50] dark:bg-[#0d1117] dark:text-white">
      
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
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Skills Section */}
      <section className="px-4 py-20 bg-slate-50 dark:bg-[#161b22] w-full grid items-center" id="skills">
        <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <SkillCard icon={<Code className="h-8 w-8" />} title="Programming" description="Python, JavaScript, SQL, Bash" />
          <SkillCard icon={<BrainCircuit className="h-8 w-8" />} title="Machine Learning" description="Scikit-learn, TensorFlow, NLTK" />
          <SkillCard icon={<Cpu className="h-8 w-8" />} title="AI & LLMs" description="Ollama, OpenAI API, GPT-4o" />
          <SkillCard icon={<Code className="h-8 w-8" />} title="Web Development" description="React.js, Next.js, FastAPI" />
        </div>
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-20 grid" id="project">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectCard
            title="Collaborative Whiteboard Tool"
            description="A real-time collaborative whiteboard with AI suggestions using Next.js and GPT-4o."
            technologies={["Next.js", "OpenAI API", "Bun", "WebSockets"]}
          />
          <ProjectCard
            title="Deep Search - AI-Powered Research Tool"
            description="A Python+Gradio tool combining DuckDuckGo with local LLMs for fully cited answers."
            technologies={["Python", "Gradio", "Ollama", "DuckDuckGo API"]}
          />
          <ProjectCard
            title="Stock Prediction - Time Series AI"
            description="A stock forecasting tool using Linear Regression and real-world datasets."
            technologies={["Python", "Scikit-learn", "Pandas", "Matplotlib"]}
          />
          <ProjectCard
            title="Customer Support Chatbot"
            description="An AI-powered chatbot answering FAQs using past support tickets and LLMs."
            technologies={["Python", "Gradio", "Ollama", "NLTK", "Scikit-learn"]}
          />
        </div>
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Contact Section */}
      <section className="w-full mx-auto bg-slate-50 dark:bg-[#161b22] px-4 py-20">
        <ContactMe className="max-w-xl mx-auto" />
      </section>
    </div>
  );
}

function SkillCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="bg-[#D6EAF8] hover:bg-[#95c9ed] dark:bg-gray-800 dark:hover:bg-gray-700 p-6 rounded-lg text-center"
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
      className="bg-[#D6EAF8] hover:bg-[#95c9ed] dark:bg-gray-800 dark:hover:bg-gray-700 group p-6 rounded-lg"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="text-xl mb-2 group-hover:text-blue-800 font-bold">{title}</h3>
      <p className="mb-4 font-light group-hover:text-blue-700">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-blue-600 text-white text-sm px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default PortfolioComponent;
