import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  Folder,
  FolderOpen,
  Link2,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  navbarLink: boolean;
  icon: string;
  children?: Category[];
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    parentId: null,
    navbarLink: true,
    icon: "laptop",
    children: [
      { id: "1-1", name: "Smartphones", slug: "smartphones", description: "Mobile phones", parentId: "1", navbarLink: true, icon: "smartphone" },
      { id: "1-2", name: "Laptops", slug: "laptops", description: "Portable computers", parentId: "1", navbarLink: true, icon: "laptop" },
      { id: "1-3", name: "Audio", slug: "audio", description: "Headphones and speakers", parentId: "1", navbarLink: false, icon: "headphones" },
    ],
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    description: "Clothing and accessories",
    parentId: null,
    navbarLink: true,
    icon: "shirt",
    children: [
      { id: "2-1", name: "Men", slug: "men", description: "Men's fashion", parentId: "2", navbarLink: true, icon: "user" },
      { id: "2-2", name: "Women", slug: "women", description: "Women's fashion", parentId: "2", navbarLink: true, icon: "user" },
      { id: "2-3", name: "Kids", slug: "kids", description: "Kids' fashion", parentId: "2", navbarLink: false, icon: "baby" },
    ],
  },
  {
    id: "3",
    name: "Home & Living",
    slug: "home-living",
    description: "Home decor and furniture",
    parentId: null,
    navbarLink: true,
    icon: "home",
    children: [
      { id: "3-1", name: "Furniture", slug: "furniture", description: "Home furniture", parentId: "3", navbarLink: true, icon: "armchair" },
      { id: "3-2", name: "Decor", slug: "decor", description: "Decorative items", parentId: "3", navbarLink: false, icon: "lamp" },
    ],
  },
];

function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];
  categories.forEach((cat) => {
    result.push(cat);
    if (cat.children) {
      result.push(...cat.children);
    }
  });
  return result;
}

interface CategoryItemProps {
  category: Category;
  level?: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  onView: (cat: Category) => void;
}

function CategoryItem({ category, level = 0, onEdit, onDelete, onView }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 group transition-colors",
          level > 0 && "ml-6 border-l-2 border-border"
        )}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="w-6" />
        )}

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          {hasChildren && isOpen ? (
            <FolderOpen className="h-5 w-5 text-primary" />
          ) : (
            <Folder className="h-5 w-5 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{category.name}</span>
            {category.navbarLink && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Link2 className="h-3 w-3" />
                Navbar
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{category.description}</p>
        </div>

        <Badge variant="secondary" className="shrink-0">
          /{category.slug}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(category)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "none",
    navbarLink: false,
  });

  const allCategories = flattenCategories(categories);
  const parentOptions = allCategories.filter((c) => !c.parentId);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", parentId: "none", navbarLink: false });
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId || "none",
      navbarLink: category.navbarLink,
    });
    setDialogOpen(true);
  };

  const openViewDialog = (category: Category) => {
    setViewingCategory(category);
    setViewDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData({ ...formData, name, slug });
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({ title: "Error", description: "Please enter a category name.", variant: "destructive" });
      return;
    }

    const newCategory: Category = {
      id: editingCategory?.id || crypto.randomUUID(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      parentId: formData.parentId === "none" ? null : formData.parentId,
      navbarLink: formData.navbarLink,
      icon: "folder",
    };

    if (editingCategory) {
      // Update existing
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === editingCategory.id) {
            return { ...cat, ...newCategory, children: cat.children };
          }
          if (cat.children) {
            return {
              ...cat,
              children: cat.children.map((child) =>
                child.id === editingCategory.id ? { ...child, ...newCategory } : child
              ),
            };
          }
          return cat;
        })
      );
      toast({ title: "Category updated", description: "Category has been updated successfully." });
    } else {
      // Add new
      if (formData.parentId !== "none") {
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === formData.parentId) {
              return { ...cat, children: [...(cat.children || []), newCategory] };
            }
            return cat;
          })
        );
      } else {
        setCategories([...categories, { ...newCategory, children: [] }]);
      }
      toast({ title: "Category created", description: "Category has been created successfully." });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => {
      const filtered = prev.filter((cat) => cat.id !== id);
      return filtered.map((cat) => ({
        ...cat,
        children: cat.children?.filter((child) => child.id !== id),
      }));
    });
    toast({ title: "Category deleted", description: "Category has been deleted.", variant: "destructive" });
  };

  const navbarCategories = allCategories.filter((c) => c.navbarLink);

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        {/* Navbar Preview */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Navbar Links Preview
            </h3>
            <Badge variant="secondary">{navbarCategories.length} links</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {navbarCategories.map((cat) => (
              <Badge key={cat.id} variant="outline" className="px-3 py-1">
                {cat.name}
              </Badge>
            ))}
            {navbarCategories.length === 0 && (
              <span className="text-sm text-muted-foreground">No navbar links configured</span>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Organize your products with nested categories
          </p>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Category Tree */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              onView={openViewDialog}
            />
          ))}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                {editingCategory ? "Edit Category" : "Create Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update the category details." : "Add a new category to organize your products."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="category-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Root Category)</SelectItem>
                    {parentOptions.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="navbarLink"
                  checked={formData.navbarLink}
                  onChange={(e) => setFormData({ ...formData, navbarLink: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="navbarLink" className="cursor-pointer">
                  Show in Navbar
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewingCategory?.name}</DialogTitle>
            </DialogHeader>
            {viewingCategory && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Folder className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{viewingCategory.name}</p>
                    <p className="text-sm text-muted-foreground">/{viewingCategory.slug}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{viewingCategory.description || "No description"}</p>
                <div className="flex gap-2">
                  {viewingCategory.navbarLink && (
                    <Badge className="gap-1">
                      <Link2 className="h-3 w-3" />
                      Navbar Link
                    </Badge>
                  )}
                  {viewingCategory.parentId && (
                    <Badge variant="outline">Has Parent</Badge>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
