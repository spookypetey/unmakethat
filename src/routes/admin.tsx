import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products.queries";
import { categorize } from "@/lib/shopify";

export const Route = createFileRoute("/admin")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: AdminDashboard,
});

function AdminDashboard() {
  // Fetch existing storefront data
  const { data: initialProducts } = useSuspenseQuery(productsQuery);
  
  // Local state to manage live catalog updates without needing a page refresh
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

  // Populate form for editing existing items
  const handleEdit = (product: any) => {
    setEditId(product.node.id);
    setTitle(product.node.title);
    
    // Safely extract price based on typical Shopify GraphQL structure
    const itemPrice = product.node.priceRange?.minVariantPrice?.amount 
      || product.node.variants?.edges?.[0]?.node?.price?.amount 
      || "0.00";
    setPrice(itemPrice);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Add/Update submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editId) {
      // Update existing item in local state
      setCatalog(catalog.map(p => {
        if (p.node.id === editId) {
          // Deep clone the node to update title (and price if you map it locally)
          return { ...p, node: { ...p.node, title: title } };
        }
        return p;
      }));
      alert(`Updated: ${title}`);
    } else {
      // Add entirely new item to local state
      const newItem = {
        node: {
          id: `local-${Date.now()}`,
          title: title,
          handle: title.toLowerCase().replace(/\s+/g, '-'),
          // Mocking nested Shopify price structure
          priceRange: { minVariantPrice: { amount: price } }
        }
      };
      setCatalog([newItem, ...catalog]);
      alert(`Published: ${title}`);
    }

    // Reset Form
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

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-primary">COMMAND CENTER</h1>
          <div className="flex gap-4 text-sm font-mono text-muted-foreground">
            <span>ADMIN: PETE</span>
            <span>//</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-surface p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Total Sales</h3>
            <p className="text-4xl font-bold">$1,240.50</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-surface p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Site Visits</h3>
            <p className="text-4xl font-bold">1,402</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-surface p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Active Catalog</h3>
            <p className="text-4xl font-bold">{catalog.length}</p>
          </div>
        </div>

        {/* Upload & Edit Manager */}
        <div className="rounded-xl border border-border/50 bg-surface p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editId ? "Edit Existing Item" : "Upload New Item"}
            </h2>
            {editId && (
              <button onClick={cancelEdit} className="text-sm font-medium text-red-400 hover:text-red-300">
                Cancel Edit
              </button>
            )}
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Item Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., DARKWAVE ANTHEM (Beat)" 
                    className="w-full rounded-md border border-border/50 bg-background/50 px-4 py-2 text-foreground outline-none transition-colors focus:border-ring" 
                    required 
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-border/50 bg-background/50 px-4 py-2 text-foreground outline-none transition-colors focus:border-ring"
                  >
                    <option>Beat (WAV/MP3)</option>
                    <option>Release (Album/EP)</option>
                    <option>Merch (Physical)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29.99" 
                    className="w-full rounded-md border border-border/50 bg-background/50 px-4 py-2 text-foreground outline-none transition-colors focus:border-ring" 
                    required 
                  />
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
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">✓</div>
                      <p className="font-medium text-primary">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted-foreground">↑</div>
                      <p className="text-sm font-medium">Click or drag file here</p>
                      <p className="text-xs text-muted-foreground">Support for WAV, MP3, ZIP, PNG, or JPG</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-border/50 pt-4">
              <button type="submit" className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                {editId ? "Save Changes" : "Publish Item"}
              </button>
            </div>
          </form>
        </div>

        {/* Active Catalog List */}
        <div className="rounded-xl border border-border/50 bg-surface shadow-xl">
          <div className="border-b border-border/50 px-6 py-4">
            <h2 className="text-xl font-semibold">Active Catalog</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-background/50 text-xs uppercase text-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Product Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {catalog.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center">No products found.</td>
                  </tr>
                ) : (
                  catalog.map((product) => (
                    <tr key={product.node.id} className="transition-colors hover:bg-background/30">
                      <td className="px-6 py-4 font-medium text-foreground">{product.node.title}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="font-medium text-primary hover:underline"
                        >
                          Edit
                        </button>
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