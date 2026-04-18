import { useState } from "react";
import { SkillCategory } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

export function SkillsManager({ data, onSaved }: { data: SkillCategory[]; onSaved: () => void }) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<SkillCategory>>({});
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const newData = [...data];
      if (editingIdx === -1) {
        newData.push(formData as SkillCategory);
      } else if (editingIdx !== null) {
        newData[editingIdx] = formData as SkillCategory;
      }

      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateSkills", payload: newData })
      });
      
      if (res.ok) {
        toast({ title: "Skills saved successfully!" });
        setEditingIdx(null);
        onSaved();
      } else throw new Error();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const handleDelete = async (idx: number) => {
    if (!confirm("Delete this entire skill category?")) return;
    try {
      const payload = data.filter((_, i) => i !== idx);
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateSkills", payload })
      });
      if (res.ok) {
        toast({ title: "Deleted category" });
        onSaved();
      } else throw new Error();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-semibold">Skills</h2>
          <p className="text-sm text-muted-foreground">Manage your skill categories and items</p>
        </div>
        {editingIdx === null && (
          <Button onClick={() => {
            setEditingIdx(-1);
            setFormData({ category: "New Category", icon: "code", items: [] });
          }} className="gap-2">
            <Plus size={16} /> Add Category
          </Button>
        )}
      </div>

      {editingIdx !== null && (
        <div className="border p-6 rounded-xl bg-card shadow-sm space-y-4 animate-in fade-in">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">{editingIdx === -1 ? "New Category" : "Edit Category"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingIdx(null)}><X size={16} /></Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lucide Icon Name</label>
              <Input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Skill Items</label>
            <div className="bg-muted/30 p-4 rounded-xl space-y-3">
              {(formData.items || []).map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Skill name"
                    value={item.name} 
                    onChange={e => {
                      const newItems = [...(formData.items || [])];
                      newItems[i].name = e.target.value;
                      setFormData({...formData, items: newItems});
                    }} 
                  />
                  <Input 
                    type="number" 
                    min="0" max="100" 
                    className="w-24"
                    value={item.level} 
                    onChange={e => {
                      const newItems = [...(formData.items || [])];
                      newItems[i].level = Number(e.target.value);
                      setFormData({...formData, items: newItems});
                    }} 
                  />
                  <Button variant="ghost" size="icon" onClick={() => {
                    const newItems = [...(formData.items || [])];
                    newItems.splice(i, 1);
                    setFormData({...formData, items: newItems});
                  }}>
                    <Trash2 size={16} className="text-destructive"/>
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setFormData({
                ...formData, 
                items: [...(formData.items || []), {name: "", level: 50}]
              })}>
                <Plus size={14} className="mr-1" /> Add Skill
              </Button>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button onClick={handleSave}><Check size={16} className="mr-2" /> Save Category</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((cat, idx) => (
          <div key={idx} className="p-5 border rounded-xl bg-card hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold flex items-center gap-2">
                {cat.category}
              </h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingIdx(idx); setFormData(cat); }}>
                  <Edit2 size={16} className="text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10" onClick={() => handleDelete(idx)}>
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {cat.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${item.level}%` }} />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{item.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
