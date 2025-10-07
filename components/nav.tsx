"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Leaf } from "lucide-react"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/farm", label: "Farm Mapping" },
  { href: "/scanner", label: "Crop Scanner" },
  { href: "/daily", label: "Daily Advisor" },
  { href: "/resources", label: "Resources" },
  { href: "/market", label: "Market" },
  { href: "/about", label: "About" },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary transition-colors"
        >
          <Leaf className="h-6 w-6 text-primary" />
          <span>Kishan360</span>
        </Link>
        <ul className="flex items-center gap-1 text-sm flex-wrap">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-2 hover:bg-muted/60 transition-colors",
                  pathname === l.href ? "bg-muted text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
