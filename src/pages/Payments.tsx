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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { Calendar, CreditCard, Eye, MoreHorizontal, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface Payment {
  id: string;
  transactionId: string;
  customer: string;
  email: string;
  amount: number;
  method: string;
  status: "success" | "pending" | "failed";
  date: string;
}

const mockPayments: Payment[] = [
  { id: "1", transactionId: "TXN-7284", customer: "Sarah Johnson", email: "sarah@email.com", amount: 234.50, method: "Visa ****4242", status: "success", date: "2024-01-15 14:32" },
  { id: "2", transactionId: "TXN-7283", customer: "Michael Chen", email: "michael@email.com", amount: 189.00, method: "Mastercard ****5555", status: "pending", date: "2024-01-15 13:18" },
  { id: "3", transactionId: "TXN-7282", customer: "Emma Wilson", email: "emma@email.com", amount: 432.00, method: "PayPal", status: "success", date: "2024-01-15 11:45" },
  { id: "4", transactionId: "TXN-7281", customer: "James Brown", email: "james@email.com", amount: 78.50, method: "Visa ****1234", status: "failed", date: "2024-01-15 10:22" },
  { id: "5", transactionId: "TXN-7280", customer: "Lisa Anderson", email: "lisa@email.com", amount: 567.00, method: "Mastercard ****8888", status: "success", date: "2024-01-14 16:55" },
  { id: "6", transactionId: "TXN-7279", customer: "David Kim", email: "david@email.com", amount: 299.99, method: "Apple Pay", status: "success", date: "2024-01-14 15:30" },
  { id: "7", transactionId: "TXN-7278", customer: "Anna Martinez", email: "anna@email.com", amount: 145.00, method: "Visa ****9876", status: "pending", date: "2024-01-08 14:12" },
  { id: "8", transactionId: "TXN-7277", customer: "Robert Taylor", email: "robert@email.com", amount: 89.99, method: "PayPal", status: "success", date: "2024-01-05 12:08" },
  { id: "9", transactionId: "TXN-7276", customer: "Jennifer White", email: "jennifer@email.com", amount: 356.00, method: "Visa ****3456", status: "success", date: "2023-12-28 09:45" },
  { id: "10", transactionId: "TXN-7275", customer: "Thomas Lee", email: "thomas@email.com", amount: 123.50, method: "Mastercard ****7777", status: "failed", date: "2023-12-15 16:20" },
];

const statusStyles = {
  success: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
};

type DateFilter = "all" | "day" | "week" | "month" | "year";

const dateFilterLabels: Record<DateFilter, string> = {
  all: "All Time",
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

export default function Payments() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => {
    const now = new Date();
    return mockPayments.filter((p) => {
      const matchesSearch =
        p.customer.toLowerCase().includes(search.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (dateFilter === "all") return true;
      
      const paymentDate = new Date(p.date);
      const diffTime = now.getTime() - paymentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      switch (dateFilter) {
        case "day":
          return diffDays < 1;
        case "week":
          return diffDays < 7;
        case "month":
          return diffDays < 30;
        case "year":
          return diffDays < 365;
        default:
          return true;
      }
    });
  }, [search, dateFilter]);

  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = useMemo(() => {
    const success = filteredPayments.filter((p) => p.status === "success");
    const pending = filteredPayments.filter((p) => p.status === "pending");
    const failed = filteredPayments.filter((p) => p.status === "failed");
    return {
      totalSuccess: success.reduce((sum, p) => sum + p.amount, 0),
      pendingCount: pending.length,
      failedCount: failed.length,
    };
  }, [filteredPayments]);

  return (
    <AdminLayout title="Payments">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <CreditCard className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Successful</p>
                <p className="text-2xl font-bold text-foreground">${stats.totalSuccess.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <CreditCard className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <CreditCard className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-foreground">{stats.failedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "day", "week", "month", "year"] as DateFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={dateFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setDateFilter(filter);
                  setCurrentPage(1);
                }}
                className="gap-1"
              >
                {filter !== "all" && <Calendar className="h-3 w-3" />}
                {dateFilterLabels[filter]}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.id} className="group">
                  <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                  <TableCell className="font-medium">{payment.customer}</TableCell>
                  <TableCell className="font-semibold">${payment.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", statusStyles[payment.status])}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{payment.date}</TableCell>
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
                        <DropdownMenuItem onClick={() => setViewingPayment(payment)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
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
            totalItems={filteredPayments.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* View Dialog */}
        <Dialog open={!!viewingPayment} onOpenChange={() => setViewingPayment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            {viewingPayment && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-lg">{viewingPayment.transactionId}</p>
                    <Badge className={cn("capitalize", statusStyles[viewingPayment.status])}>
                      {viewingPayment.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">{viewingPayment.customer}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Email</span>
                    <span>{viewingPayment.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold text-lg">${viewingPayment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span>{viewingPayment.method}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Date</span>
                    <span>{viewingPayment.date}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
