"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { IconArrowRight, IconDownload } from "@tabler/icons-react";
import { SocialLinks } from "./SocialLinks";
import type { PublicProfile } from "@/lib/resume/profile";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface HeroCopyProps {
  profile: PublicProfile;
}

export function HeroCopy({ profile }: HeroCopyProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="hero-copy">
        <p className="intro-line">Hi, I&apos;m {profile.name}</p>
        <h1>{profile.headline}</h1>
        <p className="hero-summary">{profile.summary}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/projects">
            View Projects
            <IconArrowRight aria-hidden="true" size={16} stroke={1.8} />
          </Link>
          <a className="button button-secondary" href="/resume/sambhav-surana-resume.pdf" download>
            Download Resume
            <IconDownload aria-hidden="true" size={16} stroke={1.8} />
          </a>
        </div>
        <SocialLinks profile={profile} />
      </div>
    );
  }

  return (
    <motion.div
      className="hero-copy"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.p className="intro-line" variants={fadeUp}>
        Hi, I&apos;m {profile.name}
      </motion.p>
      <motion.h1 variants={fadeUp}>{profile.headline}</motion.h1>
      <motion.p className="hero-summary" variants={fadeUp}>
        {profile.summary}
      </motion.p>
      <motion.div className="hero-actions" variants={fadeUp}>
        <Link className="button button-primary" href="/projects">
          View Projects
          <IconArrowRight aria-hidden="true" size={16} stroke={1.8} />
        </Link>
        <a className="button button-secondary" href="/resume/sambhav-surana-resume.pdf" download>
          Download Resume
          <IconDownload aria-hidden="true" size={16} stroke={1.8} />
        </a>
      </motion.div>
      <motion.div variants={fadeUp}>
        <SocialLinks profile={profile} />
      </motion.div>
    </motion.div>
  );
}
