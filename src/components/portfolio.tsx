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

export function PortfolioComponent() {

  return (
    <div className="min-h-screen bg-white  text-[#2C3E50] ">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center items-center ">

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
          Web Developer | AI Enthusiast | Problem Solver
        </motion.p>
        <motion.div
          className="flex justify-center text-black space-x-4"
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
          <motion.button
            whileHover={{ scale: 1.2, y: -4 }}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "bg-[#D6EAF8] hover:bg-[#95c9ed]")}
          >
            <SocialButton
              href="https://github.com/Sambhav242005"
              icon={<Github className="bg-transparent" />}
              label="GitHub"
              className="h-7 w-7 "
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, y: -4 }}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "bg-[#D6EAF8] hover:bg-[#95c9ed]")}
          >
            <SocialButton
              href="https://www.linkedin.com/in/sambhav-surana-19a557279/"
              icon={<Linkedin className="bg-transparent" />}
              label="LinkedIn"
              className="h-7 w-7"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, y: -4 }}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "bg-[#D6EAF8] hover:bg-[#95c9ed]")}
          >

            <SocialButton href="mailto:sambhav242005@gmail.com" icon={<Mail />} label="Mail" className="h-7 w-7 bg-transparent" />
          </motion.button>
        </motion.div>
      </section>

      <hr />
      {/* Skills Section */}
      <section className="  px-4 py-20 bg-slate-50 w-full    grid  items-center" id="skills">
        <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <SkillCard
            icon={<Code className="h-8 w-8" />}
            title="Web Development"
            description="React, Next.js, Node.js"
          />
          <SkillCard
            icon={<BrainCircuit className="h-8 w-8" />}
            title="Machine Learning"
            description="TensorFlow, PyTorch, scikit-learn"
          />
          <SkillCard
            icon={<Cpu className="h-8 w-8" />}
            title="AI Integration"
            description="OpenAI API, Hugging Face"
          />
          <SkillCard
            icon={<Code className="h-8 w-8" />}
            title="Backend"
            description="Python, FastAPI, PostgreSQL"
          />
        </div>
      </section>
      <hr />
      {/* Projects Section */}
      <section className="container mx-auto px-4 py-20 grid  " id="project">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectCard
            title="AI-Powered Code Assistant"
            description="A VS Code extension that uses GPT-3 to provide intelligent code suggestions and explanations."
            technologies={["React", "Node.js", "OpenAI API"]}
          />
          <ProjectCard
            title="Image Recognition Web App"
            description="A web application that uses machine learning to classify uploaded images and provide detailed descriptions."
            technologies={["Next.js", "TensorFlow.js", "Flask"]}
          />
          <ProjectCard
            title="Sentiment Analysis Dashboard"
            description="A real-time dashboard that analyzes social media sentiment using natural language processing techniques."
            technologies={["React", "Python", "NLTK", "D3.js"]}
          />
          <ProjectCard
            title="AI Chat Bot"
            description="An intelligent chatbot that uses machine learning to provide customer support and answer queries."
            technologies={["React", "FastAPI", "Rasa"]}
          />
        </div>
      </section>
      <hr />
      {/* Contact Section */}
      <section className="w-full mx-auto bg-slate-50 px-4 py-20   ">
        <ContactMe className="max-w-xl mx-auto"/>
      </section>
    </div>
  );
}

function SkillCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-[#D6EAF8] hover:bg-[#95c9ed] p-6 rounded-lg text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-center mb-4 text-black">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-[#2C3E50]">{description}</p>
    </motion.div>
  );
}

function ProjectCard({
  title,
  description,
  technologies,
}: {
  title: string;
  description: string;
  technologies: string[];
}) {
  return (
    <motion.div
      className="bg-[#D6EAF8] hover:bg-[#95c9ed] group  p-6 rounded-lg"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="text-xl mb-2 group-hover:text-blue-800 font-bold">{title}</h3>
      <p className="text-gray-8̥00 mb-4 font-light group-hover:text-blue-700">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="bg-blue-600 text-white text-sm px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
