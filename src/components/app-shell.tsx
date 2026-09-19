import { Link } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-fg">
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <path fill="currentColor" d="M7 3h2v10H7zM3 7h10v2H3z" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">MedAssist</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-muted hover:bg-raised hover:text-fg"
            >
              Read Rx
            </Link>
            <Link
              to="/scan"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-muted hover:bg-raised hover:text-fg"
            >
              <ScanLine className="size-4" />
              Scan
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-2 text-muted hover:bg-raised hover:text-fg"
            >
              About
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 pb-16">{children}</div>
      <footer className="border-t border-border py-6 text-center text-xs text-subtle">
        Not medical advice. Confirm every medicine with your doctor or pharmacist.
        <span className="mx-2">·</span>
        Team Orbit · St Joseph Engineering College
      </footer>
    </div>
  );
}
