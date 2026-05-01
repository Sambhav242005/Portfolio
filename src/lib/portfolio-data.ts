import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/portfolio-data.json');

export interface ProfileData {
  name: string;
  tagline: string;
  summary: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  image?: string;
}

export interface ExperienceData {
  id: string;
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  dateRange: string;
  details: string[];
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  githubUrl: string;
  liveUrl: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  category: string;
  icon: string;
  items: SkillItem[];
}

export interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  link: string;
}

export interface PortfolioData {
  profile: ProfileData;
  experience: ExperienceData[];
  education: EducationData[];
  projects: ProjectData[];
  skills: SkillCategory[];
  certifications: CertificationData[];
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(fileContents) as PortfolioData;
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    throw new Error('Failed to read portfolio data');
  }
}

async function writePortfolioData(data: PortfolioData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing portfolio data:', error);
    throw new Error('Failed to write portfolio data');
  }
}

export async function updateProfile(profileData: ProfileData): Promise<PortfolioData> {
  const data = await getPortfolioData();
  data.profile = profileData;
  await writePortfolioData(data);
  return data;
}

export async function addProject(project: ProjectData): Promise<PortfolioData> {
  const data = await getPortfolioData();
  data.projects.push({ ...project, id: `proj-${Date.now()}` });
  await writePortfolioData(data);
  return data;
}

export async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<PortfolioData> {
  const data = await getPortfolioData();
  const index = data.projects.findIndex(p => p.id === id);
  if (index !== -1) {
    data.projects[index] = { ...data.projects[index], ...projectData };
    await writePortfolioData(data);
  }
  return data;
}

export async function deleteProject(id: string): Promise<PortfolioData> {
  const data = await getPortfolioData();
  data.projects = data.projects.filter(p => p.id !== id);
  await writePortfolioData(data);
  return data;
}

export async function updateExperienceData(experienceData: ExperienceData[]): Promise<PortfolioData> {
    const data = await getPortfolioData();
    data.experience = experienceData;
    await writePortfolioData(data);
    return data;
}

export async function updateSkills(skillsData: SkillCategory[]): Promise<PortfolioData> {
  const data = await getPortfolioData();
  data.skills = skillsData;
  await writePortfolioData(data);
  return data;
}

export async function updateCertificationsData(certsData: CertificationData[]): Promise<PortfolioData> {
    const data = await getPortfolioData();
    data.certifications = certsData;
    await writePortfolioData(data);
    return data;
}
