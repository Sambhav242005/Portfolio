import { PortfolioData } from "@/lib/portfolio-data";
import { AdminTab } from "@/app/(admin)/service/dashboard/page";
import { FileText, Link, Mail, Star, Users, AlertCircle, ArrowUpRight, GraduationCap, Briefcase, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function OverviewPanel({ data, onNavigate }: { data: PortfolioData; onNavigate: (tab: AdminTab) => void }) {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(d => setAnalytics(d))
      .catch(console.error);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Premium Read-Only Banner */}
      <motion.div 
        variants={item}
        className="relative overflow-hidden p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-6 group transition-colors"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-colors" />
        
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <AlertCircle size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200/90 mb-1">Live Integration Active</h3>
          <p className="text-sm text-amber-900/70 dark:text-slate-400 max-w-2xl leading-relaxed">
            Your portfolio is currently synchronized with GitHub repositories. Manual edits from this CMS are disabled to maintain data integrity. Please push updates directly to your Git branches.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">Systems Overview</h1>
        <p className="text-muted-foreground">Operational status: <span className="text-emerald-500 font-medium">Synced & Secure</span></p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          variants={item}
          title="Total Traffic" 
          value={analytics?.totalViews || "0"} 
          subValue="+12% from last month"
          icon={<Users size={20} />} 
          color="blue"
        />
        <StatCard 
          variants={item}
          title="Active Projects" 
          value={data.projects.length} 
          subValue="Showcasing excellence"
          icon={<LayoutGrid size={20} />} 
          color="violet"
        />
        <StatCard 
          variants={item}
          title="Certifications" 
          value={data.certifications.length} 
          subValue="Verified expertise"
          icon={<GraduationCap size={20} />} 
          color="emerald"
        />
        <StatCard 
          variants={item}
          title="Today's Views" 
          value={analytics?.viewsToday || 0} 
          subValue="Real-time engagement"
          icon={<ArrowUpRight size={20} />} 
          color="pink"
        />
      </div>

      <motion.div variants={item} className="pt-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Management Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLinkCard onClick={() => onNavigate("profile")} icon={<Users size={20}/>} title="Profile" desc="Slogan & Bio" />
          <QuickLinkCard onClick={() => onNavigate("projects")} icon={<LayoutGrid size={20}/>} title="Projects" desc="Showcase list" />
          <QuickLinkCard onClick={() => onNavigate("resume")} icon={<FileText size={20}/>} title="Resume" desc="PDF Artifacts" />
          <QuickLinkCard onClick={() => onNavigate("analytics")} icon={<ArrowUpRight size={20}/>} title="Analytics" desc="Detailed logs" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, subValue, icon, color, variants }: any) {
  const colors: any = {
    blue: "from-blue-500/10 to-blue-600/5 text-blue-600 dark:text-blue-400 border-blue-500/20",
    violet: "from-violet-500/10 to-violet-600/5 text-violet-600 dark:text-violet-400 border-violet-500/20",
    emerald: "from-emerald-500/10 to-emerald-600/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    pink: "from-pink-500/10 to-pink-600/5 text-pink-600 dark:text-pink-400 border-pink-500/20",
  };

  return (
    <motion.div 
      variants={variants}
      className={cn(
        "p-6 rounded-3xl bg-card bg-gradient-to-br border shadow-sm relative overflow-hidden group transition-all hover:shadow-md",
        colors[color] || colors.blue
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
        <h3 className="text-3xl font-black text-foreground mb-1 tracking-tight">{value}</h3>
        <p className="text-[10px] text-muted-foreground font-medium">{subValue}</p>
      </div>
    </motion.div>
  );
}

function QuickLinkCard({ onClick, icon, title, desc }: any) {
  return (
    <button 
      onClick={onClick} 
      className="p-6 rounded-3xl bg-card border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left group"
    >
      <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4 group-hover:text-primary transition-colors group-hover:bg-primary/10">
        {icon}
      </div>
      <div className="font-bold text-foreground mb-1">{title}</div>
      <div className="text-xs text-muted-foreground truncate">{desc}</div>
    </button>
  );
}
