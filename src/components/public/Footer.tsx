import { IconArrowRight, IconMail, IconMapPin } from "@tabler/icons-react";
import { getPublicProfile } from "@/lib/resume/profile";

export function SiteFooter() {
  const profile = getPublicProfile();

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-mark" aria-hidden="true">
        SS
      </div>
      <div>
        <h2>Let's build something meaningful together.</h2>
      </div>
      <div className="footer-contact">
        <a href={`mailto:${profile.email}`}>
          <IconMail aria-hidden="true" size={17} stroke={1.7} />
          {profile.email}
        </a>
        <span>
          <IconMapPin aria-hidden="true" size={17} stroke={1.7} />
          {profile.location}
        </span>
      </div>
      <a className="button button-primary" href={`mailto:${profile.email}`}>
        Get in touch
        <IconArrowRight aria-hidden="true" size={17} stroke={1.7} />
      </a>
    </footer>
  );
}
