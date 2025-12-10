import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { Edit, Eye, MoreHorizontal, Package, Plus, Search, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  image: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
  category: string;
  description: string;
}

const mockProducts: Product[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop", name: "Premium Watch", sku: "WTC-001", price: 299.99, stock: 45, status: "active", category: "Accessories", description: "Elegant premium watch with leather strap" },
  { id: "2", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop", name: "Wireless Headphones", sku: "HPH-002", price: 149.99, stock: 120, status: "active", category: "Electronics", description: "High-quality wireless headphones" },
  { id: "3", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80&h=80&fit=crop", name: "Polaroid Camera", sku: "CAM-003", price: 89.99, stock: 0, status: "draft", category: "Electronics", description: "Vintage-style instant camera" },
  { id: "4", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop", name: "Designer Sunglasses", sku: "SUN-004", price: 199.99, stock: 67, status: "active", category: "Accessories", description: "Premium designer sunglasses" },
  { id: "5", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80&h=80&fit=crop", name: "Running Shoes", sku: "SHO-005", price: 129.99, stock: 234, status: "active", category: "Footwear", description: "Comfortable running shoes" },
  { id: "6", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&h=80&fit=crop", name: "Skincare Set", sku: "SKN-006", price: 79.99, stock: 89, status: "active", category: "Beauty", description: "Complete skincare routine set" },
  { id: "7", image: "https://images.unsplash.com/photo-1491553895911-0055uj99a0?w=80&h=80&fit=crop", name: "Leather Wallet", sku: "WAL-007", price: 59.99, stock: 156, status: "archived", category: "Accessories", description: "Genuine leather wallet" },
  { id: "8", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop", name: "Sport Sneakers", sku: "SNK-008", price: 179.99, stock: 78, status: "active", category: "Footwear", description: "Athletic sport sneakers" },
];

const statusStyles = {
  active: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
  archived: "bg-muted text-muted-foreground",
};

export function ProductsTable() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast({ title: "Product deleted", description: "Product has been deleted.", variant: "destructive" });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => navigate("/products/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} className="group">
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "font-medium",
                      product.stock === 0 && "text-destructive",
                      product.stock > 0 && product.stock < 50 && "text-warning"
                    )}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={cn("capitalize", statusStyles[product.status])}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingProduct(product)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredProducts.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{viewingProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {viewingProduct.sku}</p>
                  <Badge className={cn("capitalize mt-2", statusStyles[viewingProduct.status])}>
                    {viewingProduct.status}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">${viewingProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Stock</span>
                  <span className={cn(
                    "font-medium",
                    viewingProduct.stock === 0 && "text-destructive",
                    viewingProduct.stock > 0 && viewingProduct.stock < 50 && "text-warning"
                  )}>
                    {viewingProduct.stock} units
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline">{viewingProduct.category}</Badge>
                </div>
                <div className="py-2">
                  <span className="text-muted-foreground">Description</span>
                  <p className="mt-1">{viewingProduct.description}</p>
                </div>
              </div>
              <Button
                className="w-full gap-2"
                onClick={() => {
                  setViewingProduct(null);
                  navigate(`/products/${viewingProduct.id}`);
                }}
              >
                <Edit className="h-4 w-4" />
                Edit Product
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
