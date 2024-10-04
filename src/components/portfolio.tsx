"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BrainCircuit,
  Code,
  Cpu,
  Github,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";
import { Label } from "./ui/label";
import { SocialButton } from "./utility/common";

export function PortfolioComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission, e.g., sending an email
    console.log("Form submitted:", { name, email, message });
    // Reset form fields
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-[#D6EAF8] text-[#2C3E50]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
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
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <SocialButton
              href="https://github.com/Sambhav242005"
              icon={<Github className="bg-transparent" />}
              label="GitHub"
              className="h-7 w-7"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, y: -4 }}
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <SocialButton
              href="https://www.linkedin.com/in/sambhav-surana-19a557279/"
              icon={<Linkedin  className="bg-transparent" />}
              label="LinkedIn"
              className="h-7 w-7"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, y: -4 }}
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            
            <SocialButton href="mailto:sambhav242005@gmail.com" icon={<Mail  />} label="Mail"  className="h-7 w-7 bg-transparent"/>
          </motion.button>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-20" id="skills">
        <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-[#D6EAF8]">
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

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-20" id="project">
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

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20 ">
        <h2 className="text-3xl font-bold mb-8 text-center">Contact Me</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded-lg pt-12">
          {/* Name Field */}
          <div className="relative mb-12">
            <Input
              type="text"
              className="border border-black peer w-full p-3 rounded-md focus:outline-none focus:border-[#E67E22]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Label className="absolute left-3 top-3 text-gray-500 transition-all peer-focus:top-[-35px] peer-focus:left-0 peer-focus:text-lg peer-focus:text-[#E67E22]">
              Name
            </Label>
          </div>

          {/* Email Field */}
          <div className="relative mb-12">
            <Input
              type="email"
              className="border border-black peer w-full p-3 rounded-md focus:outline-none  focus:border-[#E67E22]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label className="absolute left-3 top-3 text-gray-500 transition-all pointer-events-none peer-focus:left-0 peer-focus:top-[-35px] peer-focus:text-lg peer-focus:text-[#E67E22]">
              Email
            </Label>
          </div>

          {/* Message Field */}
          <div className="relative mb-6 ">
            <Textarea
              className="border border-black peer w-full p-3 rounded-md focus:outline-none focus:border-[#E67E22]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Label className="absolute left-3 top-3 text-gray-500 transition-all peer-focus:top-[-35px] peer-focus:left-0 peer-focus:text-lg peer-focus:text-[#E67E22]">
              Message
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#E67E22] text-white py-3 px-6 rounded-md"
          >
            Send Message
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
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
      className="bg-[#F9F9F9] p-6 rounded-lg text-center"
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
      className="bg-[#F9F9F9] p-6 rounded-lg"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[#E67E22] mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="bg-[#27AE60] text-white text-sm px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
