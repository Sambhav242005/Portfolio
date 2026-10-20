"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";

const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1025px)");
    const handleResize = () => { if (desktop.matches) close(); };
    desktop.addEventListener("change", handleResize);
    return () => desktop.removeEventListener("change", handleResize);
  }, [close]);

  return (
    <div className="mobile-nav">
      <button
        ref={buttonRef}
        className="mobile-nav-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <IconX aria-hidden="true" size={20} stroke={1.8} />
        ) : (
          <IconMenu2 aria-hidden="true" size={20} stroke={1.8} />
        )}
      </button>

      <div
        ref={panelRef}
        id="mobile-navigation"
        hidden={!open}
        className={`mobile-nav-panel ${open ? "mobile-nav-panel--open" : ""}`}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) close();
        }}
      >
        <nav aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={close}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
