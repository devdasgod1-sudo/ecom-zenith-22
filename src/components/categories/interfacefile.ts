// Category interfaces for the admin panel

export interface Category {
    id: string;
    title: string;
    slug: string;
    parent: string | null;
    image: string | null;
    description: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    navbar_link: boolean;
    children?: Category[];
}

export interface CategoryFormData {
    title: string;
    slug: string;
    description: string;
    parent: string;
    navbar_link: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
}

export interface CategoryTreeProps {
    categories: Category[];
    onEdit: (cat: Category) => void;
    onDelete: (id: string) => void;
    onView: (cat: Category) => void;
}

export interface CategoryItemProps {
    category: Category;
    level?: number;
    onEdit: (cat: Category) => void;
    onDelete: (id: string) => void;
    onView: (cat: Category) => void;
}

export interface ParentOption {
    category: Category;
    depth: number;
}



export interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingCategory: Category | null;
    formData: CategoryFormData;
    setFormData: (data: CategoryFormData) => void;
    imagePreview: string | null;
    setImagePreview: (url: string | null) => void;
    parentOptions: ParentOption[];
    editorRef: React.RefObject<HTMLDivElement>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onSave: () => Promise<void>;
}

export interface RichTextToolbarProps {
    editorRef: React.RefObject<HTMLDivElement>;
}