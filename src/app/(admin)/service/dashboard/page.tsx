"use client";

import { useEffect, useState } from "react";
import { PortfolioData } from "@/lib/portfolio-data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OverviewPanel } from "@/components/admin/OverviewPanel";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";
import { ResumeUploader } from "@/components/admin/ResumeUploader";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";

export type AdminTab = 
  | "overview" 
  | "profile" 
  | "projects" 
  | "experience" 
  | "skills" 
  | "certifications" 
  | "resume" 
  | "analytics";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse font-medium">Loading portfolio ecosystem...</div>;
    if (!data) return <div className="p-12 text-center text-red-500 font-bold glass rounded-2xl border border-red-500/20">System Error: Failed to initialize data</div>;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {(() => {
            switch (activeTab) {
              case "overview": return <OverviewPanel data={data} onNavigate={setActiveTab} />;
              case "profile": return <ProfileEditor data={data.profile} onSaved={fetchData} />;
              case "projects": return <ProjectsManager data={data.projects} onSaved={fetchData} />;
              case "experience": return <ExperienceManager data={data.experience} onSaved={fetchData} />;
              case "skills": return <SkillsManager data={data.skills} onSaved={fetchData} />;
              case "certifications": return <CertificationsManager data={data.certifications} onSaved={fetchData} />;
              case "resume": return <ResumeUploader />;
              case "analytics": return <AnalyticsPanel />;
              default: return <OverviewPanel data={data} onNavigate={setActiveTab} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex min-h-screen bg-muted/30 transition-colors duration-500">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-4 lg:p-8 ml-0 md:ml-0 overflow-auto min-h-screen transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-black/40 border border-border/50 min-h-[calc(100vh-4rem)] p-6 md:p-10 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

import { AnimatePresence, motion } from "framer-motion";