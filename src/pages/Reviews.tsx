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
import { Textarea } from "@/components/ui/textarea";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { Check, Eye, MessageSquare, MoreHorizontal, Search, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  customer: string;
  email: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const mockReviews: Review[] = [
  { id: "1", customer: "Sarah Johnson", email: "sarah@email.com", product: "Premium Watch", rating: 5, comment: "Absolutely love this watch! The quality is exceptional and it looks even better in person.", date: "2024-01-15", status: "pending" },
  { id: "2", customer: "Michael Chen", email: "michael@email.com", product: "Wireless Headphones", rating: 4, comment: "Great sound quality, comfortable to wear. Battery life could be better.", date: "2024-01-14", status: "approved" },
  { id: "3", customer: "Emma Wilson", email: "emma@email.com", product: "Designer Sunglasses", rating: 3, comment: "Nice design but the price is a bit steep for what you get.", date: "2024-01-13", status: "pending" },
  { id: "4", customer: "James Brown", email: "james@email.com", product: "Running Shoes", rating: 5, comment: "Best running shoes I've ever owned. Super comfortable for long runs!", date: "2024-01-12", status: "approved" },
  { id: "5", customer: "Lisa Anderson", email: "lisa@email.com", product: "Skincare Set", rating: 2, comment: "Products are okay but didn't see any noticeable results after a month.", date: "2024-01-11", status: "rejected" },
  { id: "6", customer: "David Kim", email: "david@email.com", product: "Laptop Stand", rating: 5, comment: "Perfect ergonomic solution. My neck pain is gone!", date: "2024-01-10", status: "approved" },
  { id: "7", customer: "Anna Martinez", email: "anna@email.com", product: "Coffee Maker", rating: 4, comment: "Makes great coffee but takes a while to heat up.", date: "2024-01-09", status: "pending" },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function Reviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredReviews = reviews.filter(
    (r) =>
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const updateStatus = (id: string, status: Review["status"]) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({
      title: `Review ${status}`,
      description: `The review has been ${status}.`,
    });
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast({
      title: "Review deleted",
      description: "The review has been permanently deleted.",
      variant: "destructive",
    });
  };

  const openReplyDialog = (review: Review) => {
    setReplyingTo(review);
    setReplyText("");
    setReplyDialogOpen(true);
  };

  const sendReply = () => {
    if (!replyText.trim()) {
      toast({ title: "Error", description: "Please enter a reply message.", variant: "destructive" });
      return;
    }
    toast({
      title: "Reply sent",
      description: `Your reply to ${replyingTo?.customer} has been sent.`,
    });
    setReplyDialogOpen(false);
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating ? "fill-warning text-warning" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );

  return (
    <AdminLayout title="Reviews & Comments">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReviews.map((review) => (
                <TableRow key={review.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {review.customer.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium">{review.customer}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{review.product}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell>
                    <p className="truncate max-w-[200px] text-sm">{review.comment}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", statusStyles[review.status])}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{review.date}</TableCell>
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
                        <DropdownMenuItem onClick={() => setViewingReview(review)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {review.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => updateStatus(review.id, "approved")}>
                              <Check className="mr-2 h-4 w-4 text-success" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(review.id, "rejected")}>
                              <X className="mr-2 h-4 w-4 text-destructive" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => openReplyDialog(review)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteReview(review.id)}
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
            totalItems={filteredReviews.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* View Dialog */}
        <Dialog open={!!viewingReview} onOpenChange={() => setViewingReview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            {viewingReview && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {viewingReview.customer.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{viewingReview.customer}</p>
                    <p className="text-sm text-muted-foreground">{viewingReview.email}</p>
                  </div>
                  <Badge className={cn("ml-auto capitalize", statusStyles[viewingReview.status])}>
                    {viewingReview.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(viewingReview.rating)}
                  <span className="text-sm text-muted-foreground">for {viewingReview.product}</span>
                </div>
                <p className="text-foreground">{viewingReview.comment}</p>
                <p className="text-sm text-muted-foreground">{viewingReview.date}</p>
                <div className="flex gap-2">
                  {viewingReview.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        className="gap-2 text-success"
                        onClick={() => {
                          updateStatus(viewingReview.id, "approved");
                          setViewingReview(null);
                        }}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 text-destructive"
                        onClick={() => {
                          updateStatus(viewingReview.id, "rejected");
                          setViewingReview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setViewingReview(null);
                      openReplyDialog(viewingReview);
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reply to Review</DialogTitle>
              <DialogDescription>
                Send a response to {replyingTo?.customer}'s review
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {replyingTo && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(replyingTo.rating)}
                    <span className="text-sm text-muted-foreground">{replyingTo.product}</span>
                  </div>
                  <p className="text-sm">{replyingTo.comment}</p>
                </div>
              )}
              <Textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendReply} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
