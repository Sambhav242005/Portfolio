import { getPortfolioData } from "@/lib/portfolio-data";
import { Mail, MapPin, Globe, Printer, LinkIcon, Phone } from "lucide-react";
import { GitHubLogoIcon as Github, LinkedInLogoIcon as Linkedin } from "@radix-ui/react-icons";

export const metadata = {
  title: "CV - Sambhav Surana",
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[17px] font-bold text-[#257FB0] mb-3 pb-1 border-b-[1.5px] border-[#BACDDF]">
    {children}
  </h2>
);

const SkillBar = ({ level }: { level: number }) => {
  const filled = Math.round(level / 20); // 0 to 5
  return (
    <div className="flex gap-1.5 mt-1.5 mb-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`h-[9px] w-[35px] ${i <= filled ? 'bg-[#257FB0]' : 'bg-transparent border border-gray-300'}`}
        />
      ))}
    </div>
  )
}

export default async function CVPage() {
  const data = await getPortfolioData();
  const { profile, experience, education, projects, skills, certifications } = data;

  const avatarUrl = profile.image || `/profile.jpeg`;

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-16 print:pt-0 print:pb-0 print:bg-white overflow-visible">
      {/* Print Action */}
      <div className="fixed bottom-8 right-8 z-50 print:hidden">
        <button
          className="flex items-center gap-2 bg-[#257FB0] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1C5F85] transition-all font-semibold"
          id="print-button"
        >
          <Printer className="w-5 h-5" />
          Print / Save PDF
        </button>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{
          __html: `
          document.getElementById('print-button').addEventListener('click', () => window.print());
        `}} />
      </div>

      {/* A4 Paper Structure */}
      <div className="max-w-[21cm] mx-auto bg-white text-black shadow-2xl print:shadow-none print:w-[21cm] cv-paper relative overflow-hidden"
        style={{ minHeight: "29.7cm" }}>

        {/* Header Block Edge-to-Edge */}
        <div className="bg-[#DDEBF7] pt-12 pb-6 px-10 print:-mt-[1.5cm] print:-mx-[1.5cm] print:pt-[1.5cm] print:px-[1.5cm] flex justify-between items-start">
          <div className="flex-1 pr-6">
            <h1 className="text-5xl font-bold tracking-tight mb-2 text-gray-900">{profile.name}</h1>
            <p className="text-[17px] font-semibold text-[#257FB0] mb-4">{profile.tagline}</p>
            <p className="text-[13px] leading-relaxed text-gray-800 text-justify font-medium">
              {profile.summary}
            </p>
          </div>
          <div className="shrink-0 pt-2">
            <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-sm bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="bg-[#A2CBEF] py-2.5 px-10 print:-mx-[1.5cm] print:px-[1.5cm] flex flex-wrap gap-x-6 gap-y-2 text-[11.5px] font-semibold text-gray-900 border-t border-[#8BB9E0]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#257FB0]" />
            <span>India</span>
          </div>
          {profile.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#257FB0]" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#257FB0]" />
              <a href={`mailto:${profile.email}`} className="underline">{profile.email}</a>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#257FB0]" />
              <a href={profile.website} className="underline">{profile.website.replace('https://', '')}</a>
            </div>
          )}
          {profile.github && (
            <div className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-[#257FB0]" />
              <a href={profile.github} className="underline">{profile.github.replace('https://', '')}</a>
            </div>
          )}
        </div>

        {/* 2-Column Grid Area */}
        <div className="p-10 print:px-0 grid grid-cols-12 gap-10">

          {/* Left Column */}
          <div className="col-span-7 space-y-8">

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <SectionTitle>Experience</SectionTitle>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="cv-avoid-break">
                      <h3 className="text-[14px] font-bold text-gray-900 leading-snug">{exp.company}</h3>
                      <div className="text-[13px] font-medium text-gray-800 mb-0.5">{exp.role}</div>
                      <div className="text-[12px] font-semibold text-gray-600 mb-2">{exp.dateRange}</div>

                      <ul className="list-disc pl-4 space-y-1 mt-1 marker:text-gray-400">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="text-[12.5px] text-gray-800 leading-normal font-medium">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section className="cv-avoid-break">
                <SectionTitle>Certifications</SectionTitle>
                <div className="space-y-5">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="cv-avoid-break">
                      <h3 className="text-[14px] font-bold text-gray-900 leading-snug">{cert.title}</h3>
                      <div className="text-[13px] font-medium text-gray-800 mb-0.5">{cert.issuer}</div>
                      <div className="text-[12px] font-semibold text-gray-600 mb-1.5">{cert.date}</div>
                      <p className="text-[12.5px] text-gray-800 leading-snug font-medium mb-1">{cert.description}</p>
                      {cert.link && (
                        <div className="flex items-center gap-1 mt-1 text-[#257FB0]">
                          <LinkIcon className="w-3 h-3" />
                          <a href={cert.link} className="text-[11px] underline font-medium break-all">{cert.link.replace('https://', '')}</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column */}
          <div className="col-span-5 space-y-8">

            {/* Technical Skills */}
            {skills && skills.length > 0 && (
              <section>
                <SectionTitle>Technical Skills</SectionTitle>
                <div className="space-y-5">
                  {skills.map((cat, i) => {
                    const avgLevel = cat.items.reduce((acc, curr) => acc + (curr.level || 75), 0) / cat.items.length;
                    return (
                      <div key={i} className="cv-avoid-break">
                        <h3 className="text-[14px] font-bold text-gray-900">{cat.category}</h3>
                        <SkillBar level={avgLevel} />
                        <div className="text-[12.5px] text-gray-800 font-medium leading-snug">
                          {cat.items.map(s => s.name).join(', ')}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

          </div>
        </div>

        {/* Education (Full Row) */}
        {education && education.length > 0 && (
          <div className="p-10 print:px-0 pt-0 print:pt-4 cv-avoid-break">
            <SectionTitle>Education</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-[14px] font-bold text-gray-900 leading-snug">{edu.institution}</h3>
                  <div className="text-[13px] text-gray-800 font-medium mt-0.5">{edu.degree}</div>
                  <ul className="list-disc pl-4 space-y-0.5 mt-1 mb-1 marker:text-gray-400">
                    {edu.details.map((d, i) => (
                      <li key={i} className="text-[12px] text-gray-800 font-medium">{d}</li>
                    ))}
                  </ul>
                  <div className="text-[12px] font-semibold text-gray-900 mt-1.5">{edu.dateRange}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects (Bottom / Page 2 Expansion) */}
        {projects && projects.length > 0 && (
          <div className="p-10 print:px-0 pt-0 print:pt-4 cv-avoid-break">
            <SectionTitle>Projects</SectionTitle>
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
              {projects.slice(0, 4).map((proj) => (
                <div key={proj.id} className="cv-avoid-break">
                  <h3 className="text-[14.5px] font-bold text-gray-900 leading-snug">{proj.title}</h3>
                  <p className="text-[12.5px] text-gray-800 leading-snug font-medium mb-1.5 mt-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2 font-mono text-[10px] text-gray-700">
                    <span className="font-bold text-gray-900">Tech:</span>
                    {proj.technologies.join(', ')}
                  </div>
                  {proj.githubUrl && (
                    <div className="flex items-center gap-1.5 text-[#257FB0]">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <a href={proj.githubUrl} className="text-[11.5px] underline flex-1 inline-block overflow-hidden text-ellipsis whitespace-nowrap font-medium">{proj.githubUrl.replace('https://github.com/', '')}</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
