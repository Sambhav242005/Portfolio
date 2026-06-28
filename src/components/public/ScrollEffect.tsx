"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollEffectProps {
  children: ReactNode;
}

export function ScrollEffect({ children }: ScrollEffectProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const header = el.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    const onScroll = () => {
      header.dataset.scrolled = window.scrollY > 20 ? "true" : "false";
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={ref}>{children}</div>;
}
