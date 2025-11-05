import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import { SocialButton } from './utility/common'
import ContactMe from "./contactme"

export function ContactPageComponent() {
  

  return (
  <div className="min-h-screen w-full bg-accent">
      <div className="container mx-auto w-full px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Me</h1>
        
        <div className="flex w-full  gap-2">
          <ContactMe className="w-full md:w-[45vw]" />   
          <Card className="w-full md:w-[45vw]">
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
