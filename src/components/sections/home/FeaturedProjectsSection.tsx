"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "../../../types/project";
import { ProjectCard } from "../../projects/ProjectCard";

export function FeaturedProjectsSection({
  projects,
  total,
}: {
  projects: Project[];
  total: number;
}) {
  if (projects.length === 0) return null;
  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[96px]">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex items-end justify-between gap-6 flex-wrap mb-[34px]">
          <div>
            <div
              className="text-[12px] uppercase tracking-[0.14em] mb-[14px]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "#FF6B6B",
              }}
            >
              01 / selected work
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(30px, 4.4vw, 46px)",
                letterSpacing: "-0.035em",
                fontWeight: 600,
                color: "#EDEDEF",
              }}
            >
              Things I&apos;ve shipped
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-[13px] border-b border-[rgba(255,107,107,0.4)] pb-[3px] transition-colors duration-200"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "#FF6B6B",
            }}
          >
            all {total} projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <ProjectCard p={p} coverHeight={172} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
