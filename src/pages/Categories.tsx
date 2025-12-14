// src/pages/admin/categories.tsx

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Link2, Plus, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { CategoryDialog } from "@/components/categories/CategoryDialog";
import { CategoryTree } from "@/components/categories/CategoryTree";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AdminService from "@/services/api";
import type { Category } from "@/components/categories/interfacefile";

// ==================== Tree Helpers ====================
function flattenCategoriesForSelect(
  categories: Category[],
  depth = 0
): { category: Category; depth: number }[] {
  let result: { category: Category; depth: number }[] = [];
  categories.forEach((cat) => {
    result.push({ category: cat, depth });
    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategoriesForSelect(cat.children, depth + 1));
    }
  });
  return result;
}

function addCategoryToTree(categories: Category[], newCategory: Category): Category[] {
  if (!newCategory.parent) return [...categories, newCategory];

  return categories.map((cat) => {
    if (cat.id === newCategory.parent) {
      return { ...cat, children: [...(cat.children || []), newCategory] };
    }
    if (cat.children) {
      return { ...cat, children: addCategoryToTree(cat.children, newCategory) };
    }
    return cat;
  });
}

function updateCategoryInTree(categories: Category[], updatedCategory: Category): Category[] {
  return categories.map((cat) => {
    if (cat.id === updatedCategory.id) {
      return { ...updatedCategory, children: cat.children };
    }
    if (cat.children) {
      return { ...cat, children: updateCategoryInTree(cat.children, updatedCategory) };
    }
    return cat;
  });
}

function deleteCategoryFromTree(categories: Category[], id: string): Category[] {
  return categories
    .filter((cat) => cat.id !== id)
    .map((cat) => ({
      ...cat,
      children: cat.children ? deleteCategoryFromTree(cat.children, id) : undefined,
    }));
}

// ==================== Initial Form State ====================
const initialFormData = {
  title: "",
  slug: "",
  description: "",
  parent: "none",
  navbar_link: false,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
};


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState(initialFormData);


  const handleFetchCategories = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      const data = await AdminService.CategoryList();
      setCategories(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    handleFetchCategories();
  }, []);

  // ==================== Parent Options for Select ====================
  const parentOptions = flattenCategoriesForSelect(categories);

  // ==================== Dialog Handlers ====================
  const handleOpenCreateDialog = useCallback(() => {
    setEditingCategory(null);
    setImagePreview(null);
    setFormData(initialFormData);
    if (editorRef.current) editorRef.current.innerHTML = "";
    setDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback((category: Category) => {
    setEditingCategory(category);
    setImagePreview(category.image || null);
    setFormData({
      title: category.title,
      slug: category.slug,
      description: category.description || "",
      parent: category.parent || "none",
      navbar_link: category.navbar_link,
      meta_title: category.meta_title || "",
      meta_description: category.meta_description || "",
      meta_keywords: category.meta_keywords || "",
    });
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = category.meta_description || "";
      }
    }, 100);
    setDialogOpen(true);
  }, []);

  const handleOpenViewDialog = useCallback((category: Category) => {
    setViewingCategory(category);
    setViewDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingCategory(null);
  }, []);

  const handleCloseViewDialog = useCallback(() => {
    setViewDialogOpen(false);
    setViewingCategory(null);
  }, []);

  // ==================== Form Change Handlers ====================
  const handleFormChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ==================== Save Category ====================
  const handleSaveCategory = useCallback(async () => {
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("slug", formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"));
    data.append("description", formData.description);
    data.append("navbar_link", String(formData.navbar_link));
    data.append("meta_title", formData.meta_title);
    data.append("meta_keywords", formData.meta_keywords);

    const metaDescHtml = editorRef.current?.innerHTML || "";
    data.append("meta_description", metaDescHtml);

    if (formData.parent !== "none") {
      data.append("parent", formData.parent);
    }

    if (fileInputRef.current?.files?.[0]) {
      data.append("image", fileInputRef.current.files[0]);
    } else if (editingCategory && !imagePreview && editingCategory.image) {
      data.append("image", "");
    }

    try {
      if (editingCategory) {
        const updatedCat = await AdminService.CategoryUpdate(editingCategory.id, data);
        setCategories((prev) => updateCategoryInTree(prev, updatedCat));
        toast({ title: "Success", description: "Category updated successfully" });
      } else {
        const newCat = await AdminService.CategoryCreate(data);
        setCategories((prev) => addCategoryToTree(prev, newCat));
        toast({ title: "Success", description: "Category created successfully" });
      }
      handleCloseDialog();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Operation failed",
        variant: "destructive",
      });
    }
  }, [formData, editingCategory, imagePreview, handleCloseDialog]);

  // ==================== Delete Category ====================
  const handleDeleteCategory = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this category and all its subcategories?")) {
      return;
    }
    try {
      await AdminService.CategoryDelete(id);
      setCategories((prev) => deleteCategoryFromTree(prev, id));
      toast({ title: "Deleted", description: "Category removed successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  }, []);

  // ==================== Refresh Handler ====================
  const handleRefresh = useCallback(() => {
    handleFetchCategories(true);
  }, [handleFetchCategories]);

  // ==================== Loading State ====================
  if (loading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">
              Organize your products with nested categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-9 w-9"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={handleOpenCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Category Tree */}
        <CategoryTree
          categories={categories}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteCategory}
          onView={handleOpenViewDialog}
        />

        {/* Create/Edit Dialog */}
        <CategoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingCategory={editingCategory}
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          parentOptions={parentOptions}
          editorRef={editorRef}
          fileInputRef={fileInputRef}
          onSave={handleSaveCategory}
        />

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleCloseViewDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {viewingCategory?.title}
              </DialogTitle>
            </DialogHeader>
            {viewingCategory && (
              <div className="space-y-4">
                {viewingCategory.image && (
                  <img
                    src={viewingCategory.image}
                    alt={viewingCategory.title}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Title</span>
                    <p className="font-medium">{viewingCategory.title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Slug</span>
                    <p className="font-medium">/{viewingCategory.slug}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="mt-1">
                    {viewingCategory.description || "No description provided"}
                  </p>
                </div>

                {(viewingCategory.meta_title || viewingCategory.meta_description) && (
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-medium text-sm text-muted-foreground">SEO Meta</h4>
                    {viewingCategory.meta_title && (
                      <div>
                        <span className="text-sm text-muted-foreground">Meta Title</span>
                        <p>{viewingCategory.meta_title}</p>
                      </div>
                    )}
                    {viewingCategory.meta_description && (
                      <div>
                        <span className="text-sm text-muted-foreground">Meta Description</span>
                        <div
                          dangerouslySetInnerHTML={{ __html: viewingCategory.meta_description }}
                          className="text-sm mt-1 prose prose-sm max-w-none"
                        />
                      </div>
                    )}
                    {viewingCategory.meta_keywords && (
                      <div>
                        <span className="text-sm text-muted-foreground">Keywords</span>
                        <p>{viewingCategory.meta_keywords}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {viewingCategory.navbar_link && (
                    <Badge className="gap-1" variant="secondary">
                      <Link2 className="h-3 w-3" />
                      Navbar Link
                    </Badge>
                  )}
                  {viewingCategory.children && viewingCategory.children.length > 0 && (
                    <Badge variant="outline">
                      {viewingCategory.children.length} subcategories
                    </Badge>
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