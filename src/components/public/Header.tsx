import Link from "next/link";
import { IconMenu2 } from "@tabler/icons-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-link" href="/" aria-label="Sambhav Surana home">
        <span className="brand-mark" aria-hidden="true">
          SS
        </span>
        <span>Sambhav Surana</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        <details className="mobile-nav">
          <summary aria-label="Open navigation">
            <IconMenu2 aria-hidden="true" size={22} stroke={1.7} />
            <span className="sr-only">Menu</span>
          </summary>
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
