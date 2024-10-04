'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Twitter, Mail, Send } from "lucide-react"
import { SocialButton } from './utility/common'

export function ContactPageComponent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, message })
    // Reset form fields
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-[#D6EAF8] ">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Me</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>Fill out the form and I&aposll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connect With Me</CardTitle>
              <CardDescription>Find me on social media or send me an email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="mailto:sambhav242005@gmail.com" className="flex items-center text-primary hover:underline">
                <Mail className="mr-2 h-5 w-5" />
                sambhav242005@gmail.com
              </a>
              <div className="flex space-x-4">
                <SocialButton href="https://github.com/Sambhav242005" icon={<Github />} label="GitHub" />
                <SocialButton href="https://www.linkedin.com/in/sambhav-surana-19a557279/" icon={<Linkedin />} label="LinkedIn" />
                <SocialButton href="https://twitter.com/Sambhav242005" icon={<Twitter />} label="Twitter" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
