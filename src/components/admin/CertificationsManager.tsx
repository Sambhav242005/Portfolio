import { useState } from "react";
import { CertificationData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

export function CertificationsManager({ data, onSaved }: { data: CertificationData[]; onSaved: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CertificationData>>({});
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const isNew = editingId === "NEW";
      const newId = `cert-${Date.now()}`;
      
      const newData = [...data];
      if (isNew) {
        newData.push({ ...formData, id: newId } as CertificationData);
      } else {
        const idx = newData.findIndex(e => e.id === editingId);
        if (idx !== -1) newData[idx] = { ...newData[idx], ...formData } as CertificationData;
      }

      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateCertifications", payload: newData })
      });
      
      if (res.ok) {
        toast({ title: "Saved successfully!" });
        setEditingId(null);
        onSaved();
      } else throw new Error();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    try {
      const payload = data.filter(e => e.id !== id);
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateCertifications", payload })
      });
      if (res.ok) {
        toast({ title: "Deleted" });
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
          <h2 className="text-xl font-semibold">Certifications & Awards</h2>
          <p className="text-sm text-muted-foreground">Manage your credentials</p>
        </div>
        {!editingId && (
          <Button onClick={() => {
            setEditingId("NEW");
            setFormData({ title: "", issuer: "", date: "", link: "", description: "" });
          }} className="gap-2">
            <Plus size={16} /> Add Cert
          </Button>
        )}
      </div>

      {editingId && (
        <div className="border p-6 rounded-xl bg-card shadow-sm space-y-4 animate-in fade-in">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">{editingId === "NEW" ? "New Certification" : "Edit Certification"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}><X size={16} /></Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Issuer</label>
              <Input value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Verification Link (optional)</label>
            <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="pt-4 flex gap-2">
            <Button onClick={handleSave}><Check size={16} className="mr-2" /> Save Form</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {data.map(cert => (
          <div key={cert.id} className="p-5 border rounded-xl flex justify-between bg-card group items-start hover:border-primary/50 transition-colors">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg">{cert.title}</h3>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{cert.date}</span>
              </div>
              <div className="text-sm text-primary font-medium mt-1 mb-2">{cert.issuer}</div>
              <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">{cert.description}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" onClick={() => { setEditingId(cert.id); setFormData(cert); }}><Edit2 size={16} className="text-blue-500" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(cert.id)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
