"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/components/ui/avatar";
import type { Profile } from "../../types/profile";

const navItems = [
  { id: "about", label: "About", href: "/about" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "resume", label: "Résumé", href: "/resume" },
];

export function Navbar({ profile }: { profile?: Profile | null }) {
  const pathname = usePathname();
  const ctaLabel = profile?.ctaLabel || "Hire me";
  const fallbackInitial = profile?.name?.trim()?.[0]?.toUpperCase() || "B";

  return (
    <div className="fixed top-[22px] left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="pointer-events-auto flex items-center gap-1 p-[7px] rounded-full border border-white/[0.09] max-w-full"
        style={{
          background: "rgba(17,17,20,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "0 18px 50px -18px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/">
          <Avatar className="">
            <AvatarImage src={profile?.avatarImage || "img/avatar.png"} className="object-cover object-center"/>
            <AvatarFallback>{fallbackInitial}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="px-3 py-[7px] rounded-full text-[13px] transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: isActive ? "#EDEDEF" : "#8A8A93",
                  background: isActive
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = "#EDEDEF";
                    (e.target as HTMLElement).style.background =
                      "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = "#8A8A93";
                    (e.target as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/contact"
          className="ml-[6px] px-4 py-[9px] rounded-full text-[12.5px] font-semibold transition-colors duration-200 whitespace-nowrap"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            background: "#FF6B6B",
            color: "#12080A",
            letterSpacing: "-0.1px",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "#FF867F";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "#FF6B6B";
          }}
        >
          {ctaLabel}
        </Link>
      </motion.nav>
    </div>
  );
}
