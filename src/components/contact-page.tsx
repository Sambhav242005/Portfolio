import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import { SocialButton } from './utility/common'
import ContactMe from "./contactme"

export function ContactPageComponent() {


  return (

    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto w-full px-4 py-16 pt-24">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Me</h1>

        <div className="flex flex-col md:flex-row w-full gap-8 max-w-6xl mx-auto">
          {/* Contact Form Section */}
          <Card className="w-full md:w-1/2 h-full">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>I'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactMe className="w-full p-0" />
            </CardContent>
          </Card>

          {/* Contact Info Section */}
          <Card className="w-full md:w-1/2 h-full">
            <CardHeader>
              <CardTitle>Connect With Me</CardTitle>
              <CardDescription>Find me on social media or send me an email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <a href="mailto:sambhav242005@gmail.com" className="flex items-center text-lg text-primary hover:underline group">
                <div className="p-2 bg-primary/10 rounded-full mr-3 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                sambhav242005@gmail.com
              </a>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Social Profiles</h4>
                <div className="flex space-x-4">
                  <SocialButton href="https://github.com/Sambhav242005" icon={<Github className="h-5 w-5" />} label="GitHub" />
                  <SocialButton href="https://www.linkedin.com/in/sambhav-surana-19a557279/" icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
                  <SocialButton href="https://twitter.com/Sambhav242005" icon={<Twitter className="h-5 w-5" />} label="Twitter" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
