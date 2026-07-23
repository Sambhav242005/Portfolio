import type { Metadata } from "next";
import { IconBrandGithub, IconBrandLinkedin, IconMail, IconMapPin } from "@tabler/icons-react";
import { getPublicProfile } from "@/lib/resume/profile";

export const metadata: Metadata = {
  title: "Contact | Sambhav Surana",
  description: "Contact Sambhav Surana for AI/ML, frontend, and systems work.",
};

export default function ContactPage() {
  const profile = getPublicProfile();
  const github = profile.profiles.find((item) => item.network === "GitHub")?.url ?? "#";
  const linkedin = profile.profiles.find((item) => item.network === "LinkedIn")?.url ?? "#";

  return (
    <main className="subpage-main">
      <header className="subpage-header">
        <h1>Get in touch</h1>
        <p>For project work, internship conversations, and research-minded collaborations.</p>
      </header>

      <section className="contact-page-panel">
        <a className="contact-row" href={`mailto:${profile.email}`}>
          <IconMail aria-hidden="true" size={18} stroke={1.8} />
          <span>{profile.email}</span>
        </a>
        <a className="contact-row" href={github} target="_blank" rel="noreferrer">
          <IconBrandGithub aria-hidden="true" size={18} stroke={1.8} />
          <span>GitHub</span>
        </a>
        <a className="contact-row" href={linkedin} target="_blank" rel="noreferrer">
          <IconBrandLinkedin aria-hidden="true" size={18} stroke={1.8} />
          <span>LinkedIn</span>
        </a>
        <div className="contact-row">
          <IconMapPin aria-hidden="true" size={18} stroke={1.8} />
          <span>{profile.location}</span>
        </div>
      </section>
    </main>
  );
}
