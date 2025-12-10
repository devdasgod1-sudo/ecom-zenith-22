import { AdminLayout } from "@/components/layout/AdminLayout";
import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname.slice(1).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

  return (
    <AdminLayout title={pageName || "Page"}>
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12">
        <Construction className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground text-center max-w-md">
          The {pageName || "page"} module is under development. Check back soon for updates!
        </p>
      </div>
    </AdminLayout>
  );
}
