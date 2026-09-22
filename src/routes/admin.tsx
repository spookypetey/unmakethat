import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products.queries";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, UploadCloud, X, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: initialProducts } = useSuspenseQuery(productsQuery);
  const [catalog, setCatalog] = useState<any[]>(initialProducts || []);
  
  // Form & Upload States
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Beat (WAV/MP3)");
  const [price, setPrice] = useState("");
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Drag & Drop Logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
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
    if (e.target.files && e.target.files[0]) setUploadedFile(e.target.files[0]);
  };

  // Populate form for editing
  const handleEdit = (product: any) => {
    setEditId(product.node.id);
    setTitle(product.node.title);
    
    const itemPrice = product.node.priceRange?.minVariantPrice?.amount 
      || product.node.variants?.edges?.[0]?.node?.price?.amount 
      || "0.00";
    setPrice(itemPrice);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Logic
  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${itemTitle}" from the catalog?`)) {
      setCatalog(catalog.filter((p) => p.node.id !== id));
      if (editId === id) cancelEdit();
    }
  };

  // Handle Add/Update submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editId) {
      setCatalog(catalog.map(p => {
        if (p.node.id === editId) {
          return { ...p, node: { ...p.node, title: title } };
        }
        return p;
      }));
    } else {
      const newItem = {
        node: {
          id: `local-${Date.now()}`,
          title: title,
          handle: title.toLowerCase().replace(/\s+/g, '-'),
          priceRange: { minVariantPrice: { amount: price } }
        }
      };
      setCatalog([newItem, ...catalog]);
    }

    setEditId(null);
    setTitle("");
    setPrice("");
    setUploadedFile(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setPrice("");
    setUploadedFile(null);
  };

  const inputCls = "w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/50";

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient glow matching the homepage */}
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="mx-auto max-w-6xl space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border/40 pb-6">
          <div>
            <span className="eyebrow mb-2 block text-primary">UnmakeThat Systems</span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">COMMAND CENTER</h1>
          </div>
          <div className="hidden text-right font-mono text-xs text-muted-foreground md:block space-y-1">
            <p>ADMIN: <span className="text-foreground">PETE</span></p>
            <p>SESSION: <span className="text-primary">SECURE</span></p>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card-dark rounded-2xl border border-border/40 p-8 shadow-2xl transition-all hover:border-border/80">
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Total Sales</h3>
            <p className="font-display text-4xl font-bold text-foreground">$1,240.50</p>
          </div>
          <div className="card-dark rounded-2xl border border-border/40 p-8 shadow-2xl transition-all hover:border-border/80">
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Site Visits</h3>
            <p className="font-display text-4xl font-bold text-foreground">1,402</p>
          </div>
          <div className="card-dark rounded-2xl border-l-2 border-primary bg-surface/50 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">Active Catalog</h3>
            <p className="font-display text-4xl font-bold text-foreground">{catalog.length}</p>
          </div>
        </div>

        {/* Upload & Edit Manager */}
        <div className={`card-dark relative overflow-hidden rounded-2xl border ${editId ? 'border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]' : 'border-border/40'} p-8 shadow-2xl transition-all duration-500`}>
          {editId && <div className="absolute left-0 top-0 h-full w-1 bg-primary" />}
          
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">
                {editId ? "Modify Asset" : "Stage New Asset"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {editId ? "Update details for the selected catalog item." : "Upload new beats, kits, or merch to the storefront."}
              </p>
            </div>
            {editId && (
              <Button variant="outline" size="sm" onClick={cancelEdit} className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20">
                <X className="h-4 w-4" /> Cancel Edit
              </Button>
            )}
          </div>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="eyebrow mb-2 block">Item Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., PHANTOM PULSE (Beat)" 
                    className={inputCls} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="eyebrow mb-2 block">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={inputCls}
                    >
                      <option>Beat (WAV/MP3)</option>
                      <option>Release (Album/EP)</option>
                      <option>Merch (Physical)</option>
                    </select>
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="29.99" 
                      className={inputCls} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div>
                <label className="eyebrow mb-2 block">Asset File</label>
                <div 
                  className={`group relative flex h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border/40 bg-background/30 hover:border-border hover:bg-background/50'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                    onChange={handleChange}
                  />
                  <div className="pointer-events-none flex flex-col items-center text-center transition-transform group-hover:-translate-y-1">
                    {uploadedFile ? (
                      <>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <p className="font-mono text-sm font-bold text-primary">{uploadedFile.name}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </>
                    ) : (
                      <>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-foreground">Click or drag file here</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">WAV, MP3, ZIP, PNG, or JPG</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-border/40 pt-6">
              <Button type="submit" variant="chrome" size="xl">
                {editId ? "Save Modifications" : "Deploy to Storefront"}
              </Button>
            </div>
          </form>
        </div>

        {/* Active Catalog List */}
        <div className="card-dark overflow-hidden rounded-2xl border border-border/40 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/40 bg-surface/50 px-8 py-6">
            <h2 className="font-display text-xl font-bold">DATABASE // ACTIVE INVENTORY</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/80 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-8 py-5">Product Name</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {catalog.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center font-mono text-muted-foreground">No assets found in database.</td>
                  </tr>
                ) : (
                  catalog.map((product) => (
                    <tr key={product.node.id} className="group transition-colors hover:bg-surface">
                      <td className="px-8 py-5 font-medium text-foreground group-hover:text-primary transition-colors">
                        {product.node.title}
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary border border-primary/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product.node.id, product.node.title)}
                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-medium text-red-500/70 transition-all hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}