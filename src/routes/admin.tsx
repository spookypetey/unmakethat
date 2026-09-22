import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">COMMAND CENTER</h1>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-surface p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Total Sales</h3>
            <p className="text-4xl font-bold">$0.00</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-surface p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Site Visits</h3>
            <p className="text-4xl font-bold">0</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-surface p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Active Uploads</h3>
            <p className="text-4xl font-bold">0</p>
          </div>
        </div>

        {/* Upload Manager */}
        <div className="rounded-xl border border-border/50 bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold">Upload Manager</h2>
          
          <form 
            className="space-y-6" 
            onSubmit={(e) => { 
              e.preventDefault(); 
              alert("Item published to storefront."); 
              setUploadedFile(null); 
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Item Title</label>
                  <input type="text" placeholder="e.g., DARKWAVE ANTHEM (Beat)" className="w-full rounded-md border border-border/50 bg-background/50 px-4 py-2 text-foreground outline-none transition-colors focus:border-ring" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Category</label>
                  <select className="w-full rounded-md border border-border/50 bg-background/50 px-4 py-2 text-foreground outline-none transition-colors focus:border-ring">
                    <option>Beat (WAV/MP3)</option>
                    <option>Release (Album/EP)</option>
                    <option>Merch (Physical)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Price ($)</label>
                  <input type="number" step="0.01" placeholder="29.99" className="w-full rounded-md border border-border/50 bg-background/50 px-4 py-2 text-foreground outline-none transition-colors focus:border-ring" required />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div 
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/50 hover:bg-background/80'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleChange}
                />
                <div className="pointer-events-none text-center">
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                        ✓
                      </div>
                      <p className="font-medium text-primary">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted-foreground">
                        ↑
                      </div>
                      <p className="text-sm font-medium">Click or drag file to this area to upload</p>
                      <p className="text-xs text-muted-foreground">Support for WAV, MP3, ZIP, PNG, or JPG</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-border/50 pt-4">
              <button type="submit" className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Publish Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}