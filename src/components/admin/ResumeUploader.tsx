import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        toast({ title: "Resume updated successfully." });
        setFile(null);
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-muted/30 p-4 rounded-xl">
        <h2 className="text-xl font-semibold">Resume / CV Manager</h2>
        <p className="text-sm text-muted-foreground">Upload the latest version of your PDF resume</p>
      </div>

      <div className="border border-dashed border-primary/50 bg-primary/5 rounded-2xl p-10 text-center">
        <Input 
          type="file" 
          accept=".pdf" 
          className="hidden" 
          id="cv-upload"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            📄
          </div>
          <div>
            <p className="font-semibold">{file ? file.name : "Click to select new resume PDF"}</p>
            <p className="text-sm text-muted-foreground mt-1">Files will replace the current resume</p>
          </div>
        </label>
      </div>

      <div className="flex gap-4">
        <Button 
          disabled={!file || uploading} 
          onClick={handleUpload}
          className="w-full sm:w-auto"
        >
          {uploading ? "Uploading..." : "Upload & Replace"}
        </Button>
        <Button variant="outline" asChild>
          <a href="/api/viewcv" target="_blank">View Current Resume</a>
        </Button>
      </div>
    </div>
  );
}
