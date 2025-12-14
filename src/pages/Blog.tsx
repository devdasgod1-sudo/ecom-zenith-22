import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import { Edit, Eye, FileText, MoreHorizontal, Plus, Search, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: "published" | "draft" | "archived";
  date: string;
  image: string;
}

const mockPosts: BlogPost[] = [
  { id: "1", title: "10 Fashion Trends for 2024", slug: "fashion-trends-2024", excerpt: "Discover the hottest fashion trends...", content: "<h2>Fashion Trends</h2><p>Content here...</p>", author: "Sarah Johnson", category: "Fashion", status: "published", date: "2024-01-15", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200" },
  { id: "2", title: "How to Style Your Living Room", slug: "style-living-room", excerpt: "Transform your space with these tips...", content: "<h2>Interior Design</h2><p>Content here...</p>", author: "Michael Chen", category: "Home", status: "published", date: "2024-01-14", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200" },
  { id: "3", title: "Top Tech Gadgets Review", slug: "tech-gadgets-review", excerpt: "Our experts review the latest gadgets...", content: "<h2>Tech Review</h2><p>Content here...</p>", author: "Emma Wilson", category: "Tech", status: "draft", date: "2024-01-13", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200" },
  { id: "4", title: "Healthy Eating Guide", slug: "healthy-eating-guide", excerpt: "Start your wellness journey...", content: "<h2>Health</h2><p>Content here...</p>", author: "James Brown", category: "Health", status: "published", date: "2024-01-12", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200" },
  { id: "5", title: "Travel Destinations 2024", slug: "travel-destinations-2024", excerpt: "Must-visit places this year...", content: "<h2>Travel</h2><p>Content here...</p>", author: "Lisa Anderson", category: "Travel", status: "draft", date: "2024-01-11", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200" },
  { id: "6", title: "DIY Home Projects", slug: "diy-home-projects", excerpt: "Easy projects for your home...", content: "<h2>DIY</h2><p>Content here...</p>", author: "David Kim", category: "Home", status: "published", date: "2024-01-10", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=200" },
];

const statusStyles = {
  published: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
};

export default function Blog() {
  const [posts, setPosts] = useState(mockPosts);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "draft" as "published" | "draft",
    image: "",
  });

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.author.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openCreateDialog = () => {
    setEditingPost(null);
    setFormData({ title: "", excerpt: "", content: "", category: "", status: "draft", image: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
      image: post.image,
    });
    setDialogOpen(true);
  };

  const openViewDialog = (post: BlogPost) => {
    setViewingPost(post);
    setViewDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.category) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    if (editingPost) {
      setPosts(posts.map((p) =>
        p.id === editingPost.id
          ? { ...p, ...formData, slug: formData.title.toLowerCase().replace(/\s+/g, "-") }
          : p
      ));
      toast({ title: "Post updated", description: "Blog post has been updated successfully." });
    } else {
      const newPost: BlogPost = {
        id: crypto.randomUUID(),
        ...formData,
        slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
        author: "Admin User",
        date: new Date().toISOString().split("T")[0],
      };
      setPosts([newPost, ...posts]);
      toast({ title: "Post created", description: "Blog post has been created successfully." });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    toast({ title: "Post deleted", description: "Blog post has been deleted.", variant: "destructive" });
  };

  return (
    <AdminLayout title="Blog Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.map((post) => (
                <TableRow key={post.id} className="group">
                  <TableCell>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {post.excerpt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{post.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", statusStyles[post.status])}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{post.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewDialog(post)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(post.id)}
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
            totalItems={filteredPosts.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {editingPost ? "Edit Post" : "Create New Post"}
              </DialogTitle>
              <DialogDescription>
                {editingPost ? "Update the blog post details." : "Add a new blog post to your website."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "published" | "draft" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewingPost?.title}</DialogTitle>
              <DialogDescription>
                By {viewingPost?.author} • {viewingPost?.date}
              </DialogDescription>
            </DialogHeader>
            {viewingPost && (
              <div className="space-y-4">
                {viewingPost.image && (
                  <img
                    src={viewingPost.image}
                    alt={viewingPost.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div className="flex gap-2">
                  <Badge variant="outline">{viewingPost.category}</Badge>
                  <Badge className={cn("capitalize", statusStyles[viewingPost.status])}>
                    {viewingPost.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{viewingPost.excerpt}</p>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: viewingPost.content }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
