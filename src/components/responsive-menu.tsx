"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ResponsiveMenu() {
  const [isMobile, setIsMobile] = useState(false);

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
    { name: "Home", href: "#" },
    { name: "Projects", href: "/project" },
    { name: "Blog", href: "/Blog" },
    { name: "Contact Me", href: "/contact" },
    { name: "Download CV", href: "/downloadcv" },
  ];

  return (
    <nav className="bg-transparent shadow-none w-full ml-32 ">
      <div className="hidden md:block">
        <div className="flex flex-auto justify-start w-full gap-3 items-center">
          {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(buttonVariants({variant:"outline"}),
                  "text-[#2C3E50] text-xl  border p-5 my-2.5 rounded-3xl",
                  item.name === "Home" ? "bg-[#E67E22] hover:bg-[#F39C12]" : "",
                  item.name === "Download CV"
                  ? "ml-auto bg-red-500 text-white py-2 px-4 rounded-xl text-lg"
                  : ""
                )}
              >
                {item.name}
              </Link>
          ))}
        </div>
      </div>
      <div className="md:hidden bg-white rounded-2xl">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-primary-foreground hover:text-accent-foreground transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
