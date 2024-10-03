'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit, Code, Cpu, Github, Linkedin, Mail, Send } from 'lucide-react'

export function PortfolioComponent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the form submission, e.g., sending an email
    console.log('Form submitted:', { name, email, message })
    // Reset form fields
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#433D48] to-[#959EAE] text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Jane Doe
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
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button variant="outline" size="icon">
            <Github className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon">
            <Linkedin className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail className="h-6 w-6" />
          </Button>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <SkillCard icon={<Code className="h-8 w-8" />} title="Web Development" description="React, Next.js, Node.js" />
          <SkillCard icon={<BrainCircuit className="h-8 w-8" />} title="Machine Learning" description="TensorFlow, PyTorch, scikit-learn" />
          <SkillCard icon={<Cpu className="h-8 w-8" />} title="AI Integration" description="OpenAI API, Hugging Face" />
          <SkillCard icon={<Code className="h-8 w-8" />} title="Backend" description="Python, FastAPI, PostgreSQL" />
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectCard 
            title="AI-Powered Code Assistant" 
            description="A VS Code extension that uses GPT-3 to provide intelligent code suggestions and explanations."
            technologies={['React', 'Node.js', 'OpenAI API']}
          />
          <ProjectCard 
            title="Image Recognition Web App" 
            description="A web application that uses machine learning to classify uploaded images and provide detailed descriptions."
            technologies={['Next.js', 'TensorFlow.js', 'Flask']}
          />
          <ProjectCard 
            title="Sentiment Analysis Dashboard" 
            description="A real-time dashboard that analyzes social media sentiment using natural language processing techniques."
            technologies={['React', 'Python', 'NLTK', 'D3.js']}
          />
          <ProjectCard 
            title="AI Chat Bot" 
            description="An intelligent chatbot that uses machine learning to provide customer support and answer queries."
            technologies={['React', 'FastAPI', 'Rasa']}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Contact Me</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Message
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </section>
    </div>
  )
}

function SkillCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      className="bg-gray-800 p-6 rounded-lg text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function ProjectCard({ title, description, technologies }: { title: string, description: string, technologies: string[] }) {
  return (
    <motion.div 
      className="bg-gray-800 p-6 rounded-lg"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-gray-700 text-sm px-2 py-1 rounded">{tech}</span>
        ))}
      </div>
    </motion.div>
  )
}