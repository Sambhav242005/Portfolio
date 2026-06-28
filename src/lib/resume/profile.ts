import "server-only";

import fs from "node:fs";
import path from "node:path";

type RawReactiveResume = {
  basics: {
    name: string;
    headline: string;
    summary: string;
    email: string;
    location: {
      city: string;
    };
    profiles: Array<{
      network: string;
      url: string;
    }>;
  };
  sections: {
    skills: {
      items: Array<{
        name: string;
        keywords: string[];
      }>;
    };
    timeline: {
      items: Array<{
        date: string;
        title: string;
        meta: string;
      }>;
    };
  };
};

type SiteData = {
  resume: RawReactiveResume;
};

export type PublicProfile = {
  name: string;
  headline: string;
  summary: string;
  email: string;
  location: string;
  profiles: Array<{
    network: string;
    url: string;
  }>;
  skillGroups: Array<{
    title: string;
    skills: string[];
  }>;
  timeline: Array<{
    date: string;
    title: string;
    meta: string;
  }>;
};

export function getPublicProfile(): PublicProfile {
  const filePath = path.join(process.cwd(), "data", "site.json");
  const siteData = JSON.parse(fs.readFileSync(filePath, "utf8")) as SiteData;
  const raw = siteData.resume;

  return {
    name: raw.basics.name,
    headline: raw.basics.headline,
    summary: raw.basics.summary,
    email: raw.basics.email,
    location: raw.basics.location.city,
    profiles: raw.basics.profiles,
    skillGroups: raw.sections.skills.items.map((item) => ({
      title: item.name,
      skills: item.keywords,
    })),
    timeline: raw.sections.timeline.items,
  };
}
