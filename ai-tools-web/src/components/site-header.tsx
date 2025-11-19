"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "/catalog", label: "Catalog" },
  { href: "/companies", label: "Companies" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 backdrop-blur bg-background/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold tracking-tight text-foreground">
            AI Systems Atlas
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
            {navLinks.map((link) => {
              const isHome = link.href === "/";
              const isActive = isHome
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative transition hover:text-foreground",
                  isActive && "text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools" target="_blank">
              View GitHub Repo
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
