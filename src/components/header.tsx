"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { ModeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (!element) return

    const headerOffset = 132
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = Math.max(elementPosition - headerOffset, 0)

    window.history.replaceState(null, "", `/#${id}`)
    window.scrollTo({ top: offsetPosition, behavior: "smooth" })
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);

    // If it's a hash link and we are already on the home page, scroll smoothly
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      scrollToSection(id)
    } else if (href.startsWith('/#') && pathname !== '/') {
      // If we're on a different page, let standard Next.js routing push back to home and scroll
      // Or manually route there
    }
  }

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
          "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 border-none print:hidden",
          isScrolled ? "bg-background/75 supports-[backdrop-filter]:backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className={cn(
          "container mx-auto px-4 transition-all duration-300",
          isScrolled ? "mt-3" : "mt-6"
        )}>
          <div className={cn(
            "flex items-center justify-between mx-auto max-w-6xl rounded-full px-5 md:px-8 transition-all duration-300",
            isScrolled
              ? "h-16 border border-border/70 bg-background/85 shadow-lg"
              : "h-20 border border-white/10 dark:border-white/5 bg-background/50 shadow-lg backdrop-blur-xl"
          )}>
            
            {/* Logo - Floating effect */}
            <div className="flex shrink-0">
              <Link href="/" className="flex items-center group relative w-12 h-12 transition-transform group-hover:scale-105" aria-label="Home">
                <Image
                  src="/logo.jpg"
                  alt="Portfolio Logo"
                  fill
                  sizes="48px"
                  className="rounded-full object-cover shadow-sm transition-all group-hover:shadow-md"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center space-x-2 xl:space-x-4" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-5 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-full transition-all duration-300 relative group"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full hover:bg-foreground/5 h-10 w-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden absolute left-4 right-4 rounded-3xl border shadow-2xl bg-background/95 backdrop-blur-xl transition-all duration-300",
          isScrolled ? "top-20 border-border/70" : "top-24 border-white/10",
          isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible pointer-events-none"
        )}>
          <nav className="p-3 space-y-1" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-6 py-2.5 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-2xl transition-all duration-200 text-center"
                onClick={(e) => handleNavClick(e, item.href)}
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
