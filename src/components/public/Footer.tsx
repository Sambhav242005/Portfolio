import { IconMail, IconMapPin, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { getPublicProfile } from "@/lib/resume/profile";

export function SiteFooter() {
  const profile = getPublicProfile();

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-mark" aria-hidden="true">
        SS
      </div>
      <div>
        <h2>Let&apos;s build something meaningful together.</h2>
      </div>
      <div className="footer-contact">
        <a href={`mailto:${profile.email}`} aria-label="Send email">
          <IconMail aria-hidden="true" size={16} stroke={1.8} />
          {profile.email}
        </a>
        {profile.profiles?.map((profile_link) => (
          <a
            key={profile_link.network}
            href={profile_link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={profile_link.network}
          >
            {profile_link.network === "GitHub" ? (
              <IconBrandGithub aria-hidden="true" size={16} stroke={1.8} />
            ) : (
              <IconBrandLinkedin aria-hidden="true" size={16} stroke={1.8} />
            )}
            {profile_link.network}
          </a>
        ))}
        <span>
          <IconMapPin aria-hidden="true" size={16} stroke={1.8} />
          {profile.location}
        </span>
      </div>
    </footer>
  );
}
