"use client";

import { Mail, MapPin } from "lucide-react";
import { GitHubLogoIcon as Github, LinkedInLogoIcon as Linkedin, TwitterLogoIcon as Twitter } from "@radix-ui/react-icons";
import { SocialButton } from './utility/common'
import ContactMe from "./contactme"
import { AnimatedSection } from "./AnimatedSection"
import { ProfileData } from "@/lib/portfolio-data"

export function ContactPageComponent({ profile }: { profile?: ProfileData }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-36 pb-8 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto w-full px-4 relative z-10 flex flex-col justify-center h-full">
        <AnimatedSection direction="up" className="flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-center mb-3">Let&apos;s Connect</h1>
          <p className="text-muted-foreground text-center text-base max-w-2xl mx-auto mb-8 font-light">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row w-full gap-6 max-w-5xl mx-auto items-stretch">
          
          {/* Contact Info Section */}
          <AnimatedSection direction="left" delay={0.2} className="w-full lg:w-5/12">
            <div className="glass p-8 rounded-3xl h-full glow-hover flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Get in touch</h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed font-light">
                  Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
                </p>

                <div className="space-y-6">
                  <a href={`mailto:${profile?.email || 'sambhav242005@gmail.com'}`} className="flex items-center group">
                    <div className="p-3 bg-primary/10 rounded-xl mr-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-0.5">Email</h4>
                      <p className="text-base font-medium group-hover:text-primary transition-colors">{profile?.email || 'sambhav242005@gmail.com'}</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center group">
                    <div className="p-3 bg-primary/10 rounded-xl mr-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-0.5">Location</h4>
                      <p className="text-base font-medium">India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <h4 className="text-xs font-medium text-muted-foreground mb-4">Connect on Socials</h4>
                <div className="flex space-x-3">
                  <SocialButton href={profile?.github || "https://github.com/Sambhav242005"} icon={<Github className="h-5 w-5" />} label="GitHub" className="p-2.5 bg-secondary rounded-lg hover:bg-primary hover:text-white transition-all duration-300" />
                  <SocialButton href={profile?.linkedin || "https://www.linkedin.com/in/sambhav-surana-19a557279/"} icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" className="p-2.5 bg-secondary rounded-lg hover:bg-primary hover:text-white transition-all duration-300" />
                  <SocialButton href="https://twitter.com/Sambhav242005" icon={<Twitter className="h-5 w-5" />} label="Twitter" className="p-2.5 bg-secondary rounded-lg hover:bg-primary hover:text-white transition-all duration-300" />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form Section */}
          <AnimatedSection direction="right" delay={0.4} className="w-full lg:w-7/12">
            <div className="glass p-8 rounded-3xl h-full glow-hover relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-[100%] blur-2xl pointer-events-none" />
              
              <h3 className="text-2xl font-bold mb-6">Send me a Message</h3>
              <ContactMe className="w-full relative z-10" />
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  )
}
