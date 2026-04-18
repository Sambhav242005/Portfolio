import { AdminTab } from "@/app/(admin)/service/dashboard/page";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Briefcase, 
  Code, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Settings, 
  Trophy, 
  User,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/theme-toggle";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "projects", label: "Projects", icon: <Code size={18} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
    { id: "skills", label: "Skills", icon: <Settings size={18} /> },
    { id: "certifications", label: "Certifications", icon: <Trophy size={18} /> },
    { id: "resume", label: "Resume / CV", icon: <FileText size={18} /> },
  ];

  return (
    <>
      <div className="md:hidden fixed top-4 right-4 z-50 flex gap-2">
        <ModeToggle />
        <Button 
          variant="outline" 
          size="icon" 
          className="glass border-border/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="text-foreground" />
        </Button>
      </div>

      <div className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen w-64 glass border-r border-border/50 bg-background/80 backdrop-blur-2xl flex flex-col transition-transform duration-500 ease-in-out shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-8 border-b border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Settings className="text-primary-foreground animate-spin-slow" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">CMS</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Admin Panel</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 py-6 space-y-1.5 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
              )}
            >
              <span className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {tab.icon}
              </span>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Theme</span>
            <ModeToggle />
          </div>
          <a
            href="/"
            target="_blank"
            className="w-full flex justify-center items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted/60 transition-all active:scale-[0.98]"
          >
            <ExternalLink size={14} /> View Live Site
          </a>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-md z-30 md:hidden" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
