import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, MessageSquare, Star, Trash2, X } from "lucide-react";
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
];

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function Reviews() {
  const [reviews, setReviews] = useState(mockReviews);

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

  return (
    <AdminLayout title="Reviews & Comments">
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {review.customer.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review.customer}</p>
                    <p className="text-sm text-muted-foreground">{review.email}</p>
                  </div>
                  <Badge className={cn("ml-auto lg:ml-0", statusStyles[review.status])}>
                    {review.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= review.rating
                            ? "fill-warning text-warning"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">for {review.product}</span>
                </div>
                <p className="text-foreground">{review.comment}</p>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex gap-2 lg:flex-col">
                {review.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-success hover:text-success"
                      onClick={() => updateStatus(review.id, "approved")}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => updateStatus(review.id, "rejected")}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={() => deleteReview(review.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
