"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode } from "react";

export function ClientLenisWrapper({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        wheelMultiplier: 0.9,
        touchMultiplier: 1,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
