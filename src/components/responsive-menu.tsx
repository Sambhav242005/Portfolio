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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    { name: "About", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <nav className="bg-transparent shadow-none w-full ml-32 ">
      <div className="hidden md:block">
        <div className="flex flex-auto justify-start w-full ">
          <a href="#">
            <Button
              variant="ghost"
              className="text-white text-xl border p-7 my-2.5 rounded-3xl"
            >
              Home
            </Button>
          </a>
          <a href="#">
            <Button
              variant="ghost"
              className="text-white text-xl p-7 my-2.5 rounded-3xl"
            >
              Skills
            </Button>
          </a>
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
