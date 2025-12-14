// src/components/admin/categories/CategoryDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, X, Folder, Save, Loader2, Code } from "lucide-react";
import { RichTextToolbar } from "./RichTextToolbar";
import { useState, useCallback, useRef, useEffect } from "react";
import type { CategoryDialogProps, CategoryFormData } from "./interfacefile";

// Hide scrollbar styles
const hideScrollbarStyle = `
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .content-editor:empty:before {
        content: attr(data-placeholder);
        color: #9ca3af;
        pointer-events: none;
    }
    .content-editor blockquote {
        border-left: 4px solid #e5e7eb;
        padding-left: 16px;
        margin: 8px 0;
        color: #6b7280;
    }
    .content-editor pre {
        background: #1f2937;
        color: #e5e7eb;
        padding: 12px;
        border-radius: 6px;
        font-family: monospace;
        margin: 8px 0;
        overflow-x: auto;
    }
    .content-editor h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
    .content-editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
    .content-editor h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
    .content-editor ul { list-style-type: disc; padding-left: 20px; }
    .content-editor ol { list-style-type: decimal; padding-left: 20px; }
    .content-editor a { color: #3b82f6; text-decoration: underline; }
    .content-editor img { max-width: 100%; height: auto; border-radius: 4px; }
    .content-editor table { border-collapse: collapse; width: 100%; }
    .content-editor td, .content-editor th { border: 1px solid #e5e7eb; padding: 8px; }
`;

export function CategoryDialog({
    open,
    onOpenChange,
    editingCategory,
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    parentOptions,
    editorRef,
    fileInputRef,
    onSave,
}: CategoryDialogProps) {
    const [saving, setSaving] = useState(false);
    const descriptionEditorRef = useRef<HTMLDivElement>(null);

    // Sync description editor content when formData changes or dialog opens
    useEffect(() => {
        if (open && descriptionEditorRef.current) {
            descriptionEditorRef.current.innerHTML = formData.description || "";
        }
    }, [open, editingCategory]);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    }, [setImagePreview]);

    const handleRemoveImage = useCallback(() => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [setImagePreview, fileInputRef]);

    const handleFieldChange = useCallback((field: keyof CategoryFormData, value: any) => {
        setFormData({ ...formData, [field]: value });
    }, [formData, setFormData]);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const updates: Partial<CategoryFormData> = { title };

        // Auto-generate slug from title if slug is empty or matches the old auto-generated slug
        if (!formData.slug || formData.slug === formData.title.toLowerCase().replace(/\s+/g, "-")) {
            updates.slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        }

        setFormData({ ...formData, ...updates });
    }, [formData, setFormData]);

    const handleDescriptionBlur = useCallback(() => {
        if (descriptionEditorRef.current) {
            setFormData({ ...formData, description: descriptionEditorRef.current.innerHTML });
        }
    }, [formData, setFormData]);

    const handleSave = useCallback(async () => {
        // Capture description content before saving
        if (descriptionEditorRef.current) {
            formData.description = descriptionEditorRef.current.innerHTML;
        }

        setSaving(true);
        try {
            await onSave();
        } finally {
            setSaving(false);
        }
    }, [onSave, formData]);

    const handleClose = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: hideScrollbarStyle }} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto hide-scrollbar p-0">
                    <DialogHeader className="border-b px-6 py-4 sticky top-0 bg-background z-10">
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Folder className="h-4 w-4 text-primary" />
                            </div>
                            {editingCategory ? "Edit Category" : "Create New Category"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        {/* Left Column */}
                        <div className="space-y-5">
                            {/* Parent Category */}
                            <div className="space-y-2">
                                <Label>Parent Category</Label>
                                <Select
                                    value={formData.parent}
                                    onValueChange={(v) => handleFieldChange("parent", v)}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select parent category..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            <span className="flex items-center gap-2">
                                                <Folder className="h-4 w-4" />
                                                Root Level (No Parent)
                                            </span>
                                        </SelectItem>
                                        {parentOptions.map((item) => (
                                            <SelectItem
                                                key={item.category.id}
                                                value={item.category.id}
                                                disabled={item.category.id === editingCategory?.id}
                                            >
                                                <span style={{ paddingLeft: `${item.depth * 16}px` }} className="flex items-center">
                                                    {item.depth > 0 && "└─ "} {item.category.title}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Name */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Category Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="Enter category name"
                                    className="h-10"
                                />
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="navbar_link"
                                    checked={formData.navbar_link}
                                    onChange={(e) => handleFieldChange("navbar_link", e.target.checked)}
                                    className="h-4 w-4 rounded border-input accent-primary"
                                />
                                <Label htmlFor="navbar_link" className="cursor-pointer font-normal">
                                    Featured (Show in Navbar)
                                </Label>
                            </div>

                            {/* Thumbnail Image */}
                            <div className="space-y-2">
                                <Label>Thumbnail Image</Label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Upload Image
                                    </Button>
                                    {imagePreview && (
                                        <div className="relative group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-16 w-16 object-cover rounded border border-border"
                                            />
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Description - Rich Text Editor */}
                            <div className="space-y-0">
                                <Label className="mb-2 block">Description</Label>
                                <RichTextToolbar editorRef={descriptionEditorRef} />
                                <div
                                    ref={descriptionEditorRef}
                                    contentEditable
                                    onBlur={handleDescriptionBlur}
                                    data-placeholder="Compose an epic..."
                                    className="content-editor min-h-[250px] rounded-b-md border border-t-0 border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-y-auto hide-scrollbar"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            {/* Slug */}
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => handleFieldChange("slug", e.target.value)}
                                    placeholder="category-slug"
                                    className="h-10 font-mono text-sm"
                                />
                            </div>

                            {/* Meta Title & Keywords */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meta_title">Meta Title</Label>
                                    <Input
                                        id="meta_title"
                                        value={formData.meta_title}
                                        onChange={(e) => handleFieldChange("meta_title", e.target.value)}
                                        placeholder="SEO title"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                                    <Input
                                        id="meta_keywords"
                                        value={formData.meta_keywords}
                                        onChange={(e) => handleFieldChange("meta_keywords", e.target.value)}
                                        placeholder="keyword1, keyword2"
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            {/* Meta Description */}
                            <div className="space-y-2">
                                <Label htmlFor="meta_description">Meta Description</Label>
                                <Input
                                    id="meta_description"
                                    value={formData.meta_description}
                                    onChange={(e) => handleFieldChange("meta_description", e.target.value)}
                                    placeholder="Brief SEO description..."
                                    className="h-10"
                                />
                            </div>

                            {/* Custom Code */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Code className="h-4 w-4" />
                                    Custom Code
                                </Label>
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    className="min-h-[120px] rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-y-auto hide-scrollbar"
                                    dangerouslySetInnerHTML={{ __html: "" }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Add custom HTML/CSS code for this category (optional)
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t px-6 py-4 gap-2 sticky bottom-0 bg-background">
                        <Button variant="outline" onClick={handleClose} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {editingCategory ? "Update Category" : "Create Category"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}