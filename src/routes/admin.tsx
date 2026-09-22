import { createFileRoute, redirect } from "@tanstack/react-router";

// Optional: Protect the route so only logged-in users can see it
export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">COMMAND CENTER</h1>
        
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

        <div className="rounded-xl border border-border/50 bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold">Upload Manager</h2>
          <p className="text-muted-foreground">Drag and drop new beat files or merch images here.</p>
          {/* Add your upload logic here later */}
        </div>
      </div>
    </main>
  );
}