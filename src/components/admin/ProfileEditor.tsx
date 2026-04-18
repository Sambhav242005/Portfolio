import { useState } from "react";
import { ProfileData } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export function ProfileEditor({ data, onSaved }: { data: ProfileData; onSaved: () => void }) {
  const [formData, setFormData] = useState<ProfileData>(data);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateProfile",
          payload: formData
        })
      });

      if (res.ok) {
        toast({ title: "Saved successfully!" });
        onSaved();
      } else {
        throw new Error("Failed to save");
      }
    } catch (e) {
      toast({ title: "Error saving profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your public information and social links</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Tagline / Title</label>
          <Input 
            value={formData.tagline} 
            onChange={e => setFormData({ ...formData, tagline: e.target.value })} 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">About Summary</label>
          <Textarea 
            value={formData.summary} 
            onChange={e => setFormData({ ...formData, summary: e.target.value })}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input 
            type="email"
            value={formData.email} 
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input 
            value={formData.phone} 
            onChange={e => setFormData({ ...formData, phone: e.target.value })} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Personal Website</label>
          <Input 
            type="url"
            value={formData.website} 
            onChange={e => setFormData({ ...formData, website: e.target.value })} 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">GitHub URL</label>
          <Input 
            type="url"
            value={formData.github} 
            onChange={e => setFormData({ ...formData, github: e.target.value })} 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">LinkedIn URL</label>
          <Input 
            type="url"
            value={formData.linkedin} 
            onChange={e => setFormData({ ...formData, linkedin: e.target.value })} 
          />
        </div>
      </div>
    </div>
  );
}
