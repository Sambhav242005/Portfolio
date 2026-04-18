import { useState } from "react";
import { ProjectData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

export function ProjectsManager({ data, onSaved }: { data: ProjectData[]; onSaved: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectData>>({});
  const { toast } = useToast();

  const handleAction = async (action: string, payload: any) => {
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload })
      });
      if (res.ok) {
        toast({ title: "Success!" });
        setEditingId(null);
        onSaved();
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const startEdit = (proj: ProjectData) => {
    setEditingId(proj.id);
    setFormData(proj); // deep copy not strictly needed here as we use controlled inputs matching structure
  };

  const startNew = () => {
    setEditingId("NEW");
    setFormData({
      title: "New Project",
      description: "",
      technologies: [],
      category: "web",
      githubUrl: "",
      liveUrl: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-semibold">Projects Showcase</h2>
          <p className="text-sm text-muted-foreground">Manage your featured projects</p>
        </div>
        {!editingId && (
          <Button onClick={startNew} className="gap-2">
            <Plus size={16} /> Add Project
          </Button>
        )}
      </div>

      {editingId && (
        <div className="border p-6 rounded-xl bg-card shadow-sm space-y-4 max-w-3xl animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">{editingId === "NEW" ? "Create New Project" : "Edit Project"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}><X size={16} /></Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technologies (comma separated)</label>
            <Input 
              value={(formData.technologies || []).join(", ")} 
              onChange={e => setFormData({...formData, technologies: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub URL</label>
              <Input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="ai">AI / Machine Learning</option>
                <option value="web">Web Development</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button onClick={() => {
              if (editingId === "NEW") {
                handleAction("addProject", formData);
              } else {
                handleAction("updateProject", { id: editingId, data: formData });
              }
            }}>
              <Check size={16} className="mr-2" /> Save Project
            </Button>
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(proj => (
          <div key={proj.id} className="p-5 border rounded-xl bg-card hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{proj.title}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(proj)}>
                  <Edit2 size={16} className="text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10" onClick={() => {
                  if (confirm("Are you sure you want to delete this project?")) {
                    handleAction("deleteProject", { id: proj.id });
                  }
                }}>
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{proj.description}</p>
            <div className="flex gap-2 flex-wrap">
              {proj.technologies.slice(0, 3).map((t, i) => (
                <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">{t}</span>
              ))}
              {proj.technologies.length > 3 && <span className="text-xs text-muted-foreground">+{proj.technologies.length - 3}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
