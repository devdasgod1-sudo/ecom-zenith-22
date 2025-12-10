import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const orders = [
  { id: "#ORD-7284", customer: "Sarah Johnson", amount: "$234.50", status: "completed" },
  { id: "#ORD-7283", customer: "Michael Chen", amount: "$189.00", status: "pending" },
  { id: "#ORD-7282", customer: "Emma Wilson", amount: "$432.00", status: "completed" },
  { id: "#ORD-7281", customer: "James Brown", amount: "$78.50", status: "processing" },
  { id: "#ORD-7280", customer: "Lisa Anderson", amount: "$567.00", status: "completed" },
];

const statusStyles = {
  completed: "bg-success/10 text-success hover:bg-success/20",
  pending: "bg-warning/10 text-warning hover:bg-warning/20",
  processing: "bg-primary/10 text-primary hover:bg-primary/20",
};

export function RecentOrders() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Latest customer transactions</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {order.customer.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-card-foreground">{order.customer}</p>
                <p className="text-sm text-muted-foreground">{order.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-card-foreground">{order.amount}</span>
              <Badge className={cn("capitalize", statusStyles[order.status as keyof typeof statusStyles])}>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
