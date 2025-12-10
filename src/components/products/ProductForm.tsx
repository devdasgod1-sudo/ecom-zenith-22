import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Box,
  DollarSign,
  FileText,
  Globe,
  Image,
  ImagePlus,
  Layers,
  Package,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(5000).optional(),
  slug: z.string().min(1, "Slug is required"),
  basePrice: z.number().min(0, "Price must be positive"),
  salePrice: z.number().min(0).optional(),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().min(0, "Stock must be positive"),
  status: z.enum(["active", "draft", "archived"]),
  category: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Variant {
  id: string;
  attribute: string;
  value: string;
  price: number;
  stock: number;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

const categories = [
  { id: "electronics", name: "Electronics", attributes: ["Color", "Storage", "RAM"] },
  { id: "fashion", name: "Fashion", attributes: ["Size", "Color", "Material"] },
  { id: "home", name: "Home & Living", attributes: ["Color", "Size", "Material"] },
  { id: "accessories", name: "Accessories", attributes: ["Color", "Size"] },
];

const attributeOptions: Record<string, string[]> = {
  Color: ["Red", "Blue", "Green", "Black", "White", "Navy", "Gray"],
  Size: ["XS", "S", "M", "L", "XL", "XXL"],
  Storage: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  RAM: ["4GB", "8GB", "16GB", "32GB"],
  Material: ["Cotton", "Polyester", "Leather", "Silk", "Wool"],
};

export function ProductForm() {
  const navigate = useNavigate();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [description, setDescription] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      basePrice: 0,
      sku: "",
      stock: 0,
      status: "draft",
    },
  });

  const name = watch("name");
  const categoryAttributes = categories.find((c) => c.id === selectedCategory)?.attributes || [];

  const generateSlug = () => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("slug", slug);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: crypto.randomUUID(), attribute: "", value: "", price: 0, stock: 0 },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImages([
        ...images,
        { id: crypto.randomUUID(), url, isPrimary: images.length === 0 },
      ]);
    }
  };

  const removeImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    if (newImages.length > 0 && !newImages.some((img) => img.isPrimary)) {
      newImages[0].isPrimary = true;
    }
    setImages(newImages);
  };

  const setPrimaryImage = (id: string) => {
    setImages(
      images.map((img) => ({ ...img, isPrimary: img.id === id }))
    );
  };

  const onSubmit = (data: ProductFormData) => {
    console.log("Product data:", { ...data, description, variants, images });
    toast({
      title: "Product saved",
      description: "Your product has been saved successfully.",
    });
    navigate("/products");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid gap-1 bg-muted/50 p-1">
          <TabsTrigger value="basic" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Basic</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="variants" className="gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Variants</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Tab */}
        <TabsContent value="basic" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the core product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Product Name
                  </Label>
                  <Input id="name" {...register("name")} placeholder="Enter product name" />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2">
                    <Input id="slug" {...register("slug")} placeholder="product-slug" />
                    <Button type="button" variant="outline" onClick={generateSlug}>
                      Generate
                    </Button>
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setValue("category", value);
                  }}
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Description
                </Label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Write a detailed product description. Use formatting to highlight key features..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Product Images
              </CardTitle>
              <CardDescription>Add and organize product photos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={cn(
                      "relative group aspect-square rounded-xl overflow-hidden border-2 transition-all",
                      img.isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border"
                    )}
                  >
                    <img
                      src={img.url}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.isPrimary && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrimaryImage(img.id)}
                        >
                          Primary
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => removeImage(img.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {img.isPrimary && (
                      <Badge className="absolute top-2 left-2 bg-primary">
                        Primary
                      </Badge>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImage}
                  className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Pricing & Inventory
              </CardTitle>
              <CardDescription>Set prices and manage stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price ($)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    {...register("basePrice", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.basePrice && (
                    <p className="text-sm text-destructive">{errors.basePrice.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    {...register("salePrice", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" {...register("sku")} placeholder="PRD-001" />
                  {errors.sku && (
                    <p className="text-sm text-destructive">{errors.sku.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue="draft"
                  onValueChange={(value) =>
                    setValue("status", value as "active" | "draft" | "archived")
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Product Variants
              </CardTitle>
              <CardDescription>
                {selectedCategory
                  ? `Add variants based on ${categories.find((c) => c.id === selectedCategory)?.name} attributes`
                  : "Select a category first to see available attributes"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedCategory && (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Please select a category in the Basic tab to enable variant attributes
                  </p>
                </div>
              )}

              {selectedCategory && variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex-1 min-w-[150px] space-y-2">
                    <Label>Attribute</Label>
                    <Select
                      value={variant.attribute}
                      onValueChange={(value) => {
                        updateVariant(variant.id, "attribute", value);
                        updateVariant(variant.id, "value", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryAttributes.map((attr) => (
                          <SelectItem key={attr} value={attr}>
                            {attr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[150px] space-y-2">
                    <Label>Value</Label>
                    <Select
                      value={variant.value}
                      onValueChange={(value) => updateVariant(variant.id, "value", value)}
                      disabled={!variant.attribute}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent>
                        {(attributeOptions[variant.attribute] || []).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28 space-y-2">
                    <Label>Price (+)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(variant.id, "price", parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(variant.id, "stock", parseInt(e.target.value) || 0)
                      }
                      placeholder="0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(variant.id)}
                    className="text-destructive hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {selectedCategory && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Variant
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                SEO Configuration
              </CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register("metaTitle")}
                  placeholder="Enter meta title (max 60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {watch("metaTitle")?.length || 0}/60 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  placeholder="Enter meta description (max 160 characters)"
                  maxLength={160}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  {watch("metaDescription")?.length || 0}/160 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  {...register("canonicalUrl")}
                  placeholder="https://example.com/products/your-product"
                />
              </div>

              {/* SEO Preview */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Search Result Preview</p>
                <p className="text-primary font-medium truncate">
                  {watch("metaTitle") || name || "Product Title"}
                </p>
                <p className="text-sm text-success truncate">
                  https://yourstore.com/{watch("slug") || "product-slug"}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {watch("metaDescription") || "Product description will appear here..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button type="submit" className="gap-2">
          <Package className="h-4 w-4" />
          Save Product
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate("/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
