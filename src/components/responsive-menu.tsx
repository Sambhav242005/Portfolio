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
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#project" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Me", href: "/contact" },
    { name: "Download CV", href: "/downloadcv" },
  ];

  return (
    <nav className="bg-transparent shadow-none md:w-full  w-fit    ml-0 md:ml-32 ">
      <div className="hidden md:block ">
        <div className="flex flex-auto justify-start w-full gap-3  items-center ">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-[#2C3E50] text-xl bg-transparent font-normal border-none hover:border-2 shadow-none  p-5 my-2.5 rounded-3xl",
                item.name === "Home" ? "text-orange-500 underline hover:text-orange-700" : "",
                item.name === "Download CV"
                  ? "ml-auto text-red-500 hover:text-red-700 underline border-[0.5px] border-black  py-2 px-4 rounded-xl text-lg"
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
                      "text-[#2C3E50] text-xl  border p-5 my-2.5 rounded-3xl",
                      item.name === "Home"
                        ? "bg-[#E67E22] hover:bg-[#F39C12]"
                        : "",
                      item.name === "Download CV"
                        ? "ml-auto bg-red-500 text-white py-2 px-4 rounded-xl text-lg"
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
