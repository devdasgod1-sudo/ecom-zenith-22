// src/components/admin/categories/CategoryItem.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
    GripVertical,
    Link2,
    MoreHorizontal,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Category, CategoryItemProps } from "./interfacefile";

export function CategoryItem({ category, level = 0, onEdit, onDelete, onView }: CategoryItemProps) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleEdit = () => {
        onEdit(category);
    };

    const handleDelete = () => {
        onDelete(category.id);
    };

    const handleView = () => {
        onView(category);
    };

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-muted/50 group transition-all duration-200",
                    level > 0 && "ml-4 border-l-2 border-primary/20 hover:border-primary/40"
                )}
                style={{ marginLeft: level > 0 ? `${level * 20}px` : 0 }}
            >
                {/* Expand/Collapse Button */}
                <div className="w-6 flex justify-center">
                    {hasChildren ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 hover:bg-primary/10"
                            onClick={handleToggle}
                        >
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-primary" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                        </Button>
                    ) : (
                        <div className="w-6 h-6 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        </div>
                    )}
                </div>

                {/* Folder Icon */}
                <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-colors",
                    hasChildren && isOpen ? "bg-primary/15" : "bg-muted"
                )}>
                    {hasChildren && isOpen ? (
                        <FolderOpen className="h-5 w-5 text-primary" />
                    ) : (
                        <Folder className={cn("h-5 w-5", hasChildren ? "text-primary" : "text-muted-foreground")} />
                    )}
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{category.title}</span>
                        {category.navbar_link && (
                            <Badge variant="outline" className="gap-1 text-xs border-primary/30 text-primary">
                                <Link2 className="h-3 w-3" />
                                Navbar
                            </Badge>
                        )}
                        {hasChildren && (
                            <Badge variant="secondary" className="text-xs">
                                {category.children!.length}
                            </Badge>
                        )}
                    </div>
                    {category.description && (
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                            {category.description}
                        </p>
                    )}
                </div>

                {/* Slug Badge */}
                <Badge variant="outline" className="shrink-0 hidden sm:flex font-mono text-xs">
                    /{category.slug}
                </Badge>

                {/* Actions Menu */}
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
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={handleView}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEdit}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Category
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Children */}
            {hasChildren && isOpen && (
                <div className="relative">
                    <div
                        className="absolute left-[30px] top-0 bottom-2 w-px bg-gradient-to-b from-primary/20 to-transparent"
                        style={{ marginLeft: `${level * 20}px` }}
                    />
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