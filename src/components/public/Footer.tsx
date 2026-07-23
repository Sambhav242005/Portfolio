import { IconMail, IconMapPin } from "@tabler/icons-react";
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
        <a href={`mailto:${profile.email}`}>
          <IconMail aria-hidden="true" size={16} stroke={1.8} />
          {profile.email}
        </a>
        <span>
          <IconMapPin aria-hidden="true" size={16} stroke={1.8} />
          {profile.location}
        </span>
      </div>
    </footer>
  );
}
