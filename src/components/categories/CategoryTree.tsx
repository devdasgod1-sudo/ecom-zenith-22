// src/components/admin/categories/CategoryTree.tsx
import { CategoryItem } from "./CategoryItem";
import type { CategoryTreeProps } from "./interfacefile";
import { Folder } from "lucide-react";

export function CategoryTree({ categories, onEdit, onDelete, onView }: CategoryTreeProps) {
    if (!categories || categories.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <Folder className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No categories yet</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">
                        Create your first category to start organizing your products into a tree structure.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Category Tree</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {categories.length} root {categories.length === 1 ? 'category' : 'categories'}
                    </span>
                </div>
            </div>
            <div className="p-2 space-y-0.5">
                {categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                    />
                ))}
            </div>
        </div>
    );
}