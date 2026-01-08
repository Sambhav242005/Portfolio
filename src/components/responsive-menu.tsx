"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ResponsiveMenu() {
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Experience", href: "/#experience" },
    { name: 'Projects', href: '/#projects' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Me', href: '/contact' },
    { name: "Download CV", href: "/api/downloadcv" },
  ];

  return (
    <nav className="bg-transparent shadow-none w-full">
      <div className="hidden md:block">
        <div className="flex justify-center w-full gap-6 items-center">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-foreground text-xl bg-transparent font-normal border-none hover:border-2 shadow-none p-4 my-2 rounded-full",
                item.name === "Home" ? "text-primary underline" : "",
                item.name === "Download CV"
                  ? "text-destructive underline border-[0.5px] border-border py-2 px-4 rounded-xl text-lg"
                  : ""
              )}
            >
              {item.name}
            </Link>
          ))}
        </div></div>
      <div className="md:hidden bg-transparent rounded-2xl flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-4">
              {menuItems.map((item) => (
                <SheetTrigger asChild key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "text-foreground text-xl border p-4 my-2 rounded-xl",
                      item.name === "Home"
                        ? "bg-primary text-primary-foreground hover:brightness-105"
                        : "",
                      item.name === "Download CV"
                        ? "bg-destructive text-destructive-foreground py-2 px-4 rounded-xl text-lg"
                        : ""
                    )}
                  >
                    {item.name}
                  </Link>
                </SheetTrigger>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
