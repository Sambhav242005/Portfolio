"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  // Prevent next-themes from writing a color-scheme style attribute on <html>
  // which can cause hydration mismatches between server and client.
  const safeProps = { enableColorScheme: false, ...props }

  return <NextThemesProvider {...(safeProps as any)}>{children}</NextThemesProvider>
}