import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { Edit, Eye, Image as ImageIcon, MoreHorizontal, Plus, Trash2, Upload } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  position: string;
  isActive: boolean;
  createdAt: string;
}

const mockBanners: Banner[] = [
  {
    id: "1",
    title: "Summer Sale 2024",
    subtitle: "Up to 50% off on selected items",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
    link: "/sale",
    position: "hero",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "New Arrivals",
    subtitle: "Check out the latest products",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    link: "/new",
    position: "hero",
    isActive: true,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Free Shipping",
    subtitle: "On orders over $100",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop",
    link: "/shipping",
    position: "promo",
    isActive: false,
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Holiday Collection",
    subtitle: "Limited edition items",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=400&fit=crop",
    link: "/holiday",
    position: "hero",
    isActive: false,
    createdAt: "2024-01-12",
  },
];

const positionLabels: Record<string, string> = {
  hero: "Hero Banner",
  promo: "Promotional",
  sidebar: "Sidebar",
  footer: "Footer",
};

export default function Banners() {
  const [banners, setBanners] = useState(mockBanners);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [viewingBanner, setViewingBanner] = useState<Banner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    link: "",
    position: "hero",
    isActive: true,
  });

  const filteredBanners = useMemo(() => {
    return banners.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [banners, search]);

  const totalPages = Math.ceil(filteredBanners.length / pageSize);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openCreateDialog = () => {
    setEditingBanner(null);
    setFormData({ title: "", subtitle: "", imageUrl: "", link: "", position: "hero", isActive: true });
    setDialogOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      link: banner.link,
      position: banner.position,
      isActive: banner.isActive,
    });
    setDialogOpen(true);
  };

  const openViewDialog = (banner: Banner) => {
    setViewingBanner(banner);
    setViewDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.imageUrl) {
      toast({ title: "Error", description: "Please fill in title and image URL.", variant: "destructive" });
      return;
    }

    if (editingBanner) {
      setBanners(banners.map((b) =>
        b.id === editingBanner.id ? { ...b, ...formData } : b
      ));
      toast({ title: "Banner updated", description: "Banner has been updated successfully." });
    } else {
      const newBanner: Banner = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBanners([newBanner, ...banners]);
      toast({ title: "Banner created", description: "Banner has been created successfully." });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
    toast({ title: "Banner deleted", description: "Banner has been deleted.", variant: "destructive" });
  };

  const toggleActive = (id: string) => {
    setBanners(banners.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ));
  };

  const activeBanners = banners.filter((b) => b.isActive);
  const inactiveBanners = banners.filter((b) => !b.isActive);

  return (
    <AdminLayout title="Banner Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{banners.length}</p>
                <p className="text-sm text-muted-foreground">Total Banners</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <ImageIcon className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeBanners.length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inactiveBanners.length}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Input
            placeholder="Search banners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Banner
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBanners.map((banner) => (
                <TableRow key={banner.id} className="group">
                  <TableCell>
                    <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{banner.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{banner.subtitle}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{positionLabels[banner.position]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {banner.link || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={() => toggleActive(banner.id)}
                      />
                      <Badge className={cn(
                        banner.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {banner.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {banner.createdAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openViewDialog(banner)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredBanners.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
              <DialogDescription>
                {editingBanner ? "Update the banner details." : "Create a new promotional banner."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Banner title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Banner subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden aspect-[3/1] bg-muted">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/sale or https://..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="hero">Hero Banner</option>
                    <option value="promo">Promotional</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <span className="text-sm">{formData.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingBanner ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingBanner?.title}</DialogTitle>
              <DialogDescription>Banner preview and details</DialogDescription>
            </DialogHeader>
            {viewingBanner && (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden aspect-[3/1] bg-muted">
                  <img
                    src={viewingBanner.imageUrl}
                    alt={viewingBanner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{positionLabels[viewingBanner.position]}</Badge>
                  <Badge className={viewingBanner.isActive ? "bg-success/10 text-success" : ""}>
                    {viewingBanner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{viewingBanner.subtitle}</p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Link: </span>
                  {viewingBanner.link || "No link"}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
