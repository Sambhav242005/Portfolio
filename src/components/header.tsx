"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Search, User, ChevronDown } from 'lucide-react'
import { ModeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b bg-background/100 backdrop-blur supports-[backdrop-filter]:bg-background/100 transition-all duration-200",
          isScrolled && "shadow-lg"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - Floating effect with center at header edge */}
            <div className="relative z-50 md:top-10 md:-left-4">
              <Link href="/" className="flex items-center group" aria-label="Home">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.jpg"
                    alt="Portfolio Logo"
                    fill
                    className="rounded-full object-cover shadow-xl border-4 border-background transition-all group-hover:shadow-2xl"
                    priority
                  />
                  {/* Enhanced ring effect for floating appearance */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 -z-10 scale-110 group-hover:scale-125 transition-transform"></div>
                  {/* Subtle glow effect */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm opacity-70 group-hover:opacity-100 transition-all -z-20"></div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Properly spaced for floating logo */}
            <nav className="hidden md:flex items-center space-x-1  lg:-ml-36" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-xl font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <ModeToggle />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-accent/50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden border-t bg-background/95 backdrop-blur transition-all duration-300",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <nav className="container mx-auto px-4 py-4 space-y-1" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}