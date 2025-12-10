import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Edit, Eye, Image as ImageIcon, MoreHorizontal, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
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
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    link: "",
    position: "hero",
    isActive: true,
  });

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
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{banners.length}</p>
                <p className="text-sm text-muted-foreground">Total Banners</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <ImageIcon className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeBanners.length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inactiveBanners.length}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage promotional banners and hero images
          </p>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Banner
          </Button>
        </div>

        {/* Banner Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden group">
              <div className="relative aspect-[3/1] overflow-hidden bg-muted">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white">{banner.title}</h3>
                  <p className="text-sm text-white/80">{banner.subtitle}</p>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge
                    className={cn(
                      banner.isActive
                        ? "bg-success/90 text-success-foreground"
                        : "bg-muted/90 text-muted-foreground"
                    )}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{positionLabels[banner.position]}</Badge>
                  <span className="text-sm text-muted-foreground">{banner.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={banner.isActive}
                    onCheckedChange={() => toggleActive(banner.id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewDialog(banner)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(banner)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
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
