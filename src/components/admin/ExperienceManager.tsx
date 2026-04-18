import { useState } from "react";
import { ExperienceData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Check, X, GripVertical } from "lucide-react";

export function ExperienceManager({ data, onSaved }: { data: ExperienceData[]; onSaved: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ExperienceData>>({});
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const isNew = editingId === "NEW";
      const newId = `exp-${Date.now()}`;
      
      const newData = [...data];
      if (isNew) {
        newData.push({ ...formData, id: newId } as ExperienceData);
      } else {
        const idx = newData.findIndex(e => e.id === editingId);
        if (idx !== -1) newData[idx] = { ...newData[idx], ...formData } as ExperienceData;
      }

      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateExperience", payload: newData })
      });
      
      if (res.ok) {
        toast({ title: "Experience saved successfully!" });
        setEditingId(null);
        onSaved();
      } else throw new Error();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      const payload = data.filter(e => e.id !== id);
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateExperience", payload })
      });
      if (res.ok) {
        toast({ title: "Deleted" });
        onSaved();
      } else throw new Error();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const addBullet = () => {
    setFormData({ ...formData, bullets: [...(formData.bullets || []), ""] });
  };

  const updateBullet = (index: number, val: string) => {
    const list = [...(formData.bullets || [])];
    list[index] = val;
    setFormData({ ...formData, bullets: list });
  };

  const removeBullet = (index: number) => {
    const list = [...(formData.bullets || [])];
    list.splice(index, 1);
    setFormData({ ...formData, bullets: list });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-semibold">Experience</h2>
          <p className="text-sm text-muted-foreground">Manage your work history</p>
        </div>
        {!editingId && (
          <Button onClick={() => {
            setEditingId("NEW");
            setFormData({ role: "", company: "", dateRange: "", bullets: [""] });
          }} className="gap-2">
            <Plus size={16} /> Add Experience
          </Button>
        )}
      </div>

      {editingId && (
        <div className="border p-6 rounded-xl bg-card shadow-sm space-y-4 animate-in fade-in">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">{editingId === "NEW" ? "New Experience" : "Edit Experience"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}><X size={16} /></Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role / Title</label>
              <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range (e.g. 2024 - Present)</label>
            <Input value={formData.dateRange} onChange={e => setFormData({...formData, dateRange: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bullet Points</label>
            {(formData.bullets || []).map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input value={b} onChange={e => updateBullet(i, e.target.value)} />
                <Button variant="ghost" size="icon" onClick={() => removeBullet(i)}><Trash2 size={16} className="text-destructive"/></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addBullet} className="mt-2"><Plus size={14} className="mr-1" /> Add Point</Button>
          </div>

          <div className="pt-4 flex gap-2">
            <Button onClick={handleSave}><Check size={16} className="mr-2" /> Save Experience</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.map(exp => (
          <div key={exp.id} className="p-5 border rounded-xl flex gap-4 bg-card group items-start">
            <div className="mt-1 opacity-50 cursor-grab"><GripVertical size={20} /></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold">{exp.role}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingId(exp.id); setFormData(exp); }}><Edit2 size={16} className="text-blue-500" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)}><Trash2 size={16} className="text-destructive" /></Button>
                </div>
              </div>
              <div className="text-sm text-primary font-medium">{exp.company}</div>
              <div className="text-xs text-muted-foreground mt-1 mb-3">{exp.dateRange}</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {exp.bullets.map((b, i) => <li key={i} className="text-muted-foreground">{b}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
