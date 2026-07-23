import { IconBrandGithub, IconBrandLinkedin, IconMail } from "@tabler/icons-react";
import type { PublicProfile } from "@/lib/resume/profile";

type SocialLinksProps = {
  profile: PublicProfile;
};

function getProfileUrl(profile: PublicProfile, network: string) {
  const url = profile.profiles.find((item) => item.network.toLowerCase() === network.toLowerCase())?.url;
  return url && url !== "#" ? url : undefined;
}

export function SocialLinks({ profile }: SocialLinksProps) {
  const github = getProfileUrl(profile, "GitHub");
  const linkedin = getProfileUrl(profile, "LinkedIn");

  return (
    <div className="social-links" aria-label="Social links">
      {github ? (
        <a href={github} aria-label="GitHub" target="_blank" rel="noreferrer">
          <IconBrandGithub aria-hidden="true" size={18} stroke={1.8} />
        </a>
      ) : null}
      {linkedin ? (
        <a href={linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
          <IconBrandLinkedin aria-hidden="true" size={18} stroke={1.8} />
        </a>
      ) : null}
      <a href={`mailto:${profile.email}`} aria-label="Email">
        <IconMail aria-hidden="true" size={18} stroke={1.8} />
      </a>
    </div>
  );
}
