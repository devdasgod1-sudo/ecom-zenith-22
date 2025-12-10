import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CreditCard, Search } from "lucide-react";
import { useState } from "react";

interface Payment {
  id: string;
  transactionId: string;
  customer: string;
  amount: number;
  method: string;
  status: "success" | "pending" | "failed";
  date: string;
}

const mockPayments: Payment[] = [
  { id: "1", transactionId: "TXN-7284", customer: "Sarah Johnson", amount: 234.50, method: "Visa ****4242", status: "success", date: "2024-01-15 14:32" },
  { id: "2", transactionId: "TXN-7283", customer: "Michael Chen", amount: 189.00, method: "Mastercard ****5555", status: "pending", date: "2024-01-15 13:18" },
  { id: "3", transactionId: "TXN-7282", customer: "Emma Wilson", amount: 432.00, method: "PayPal", status: "success", date: "2024-01-15 11:45" },
  { id: "4", transactionId: "TXN-7281", customer: "James Brown", amount: 78.50, method: "Visa ****1234", status: "failed", date: "2024-01-15 10:22" },
  { id: "5", transactionId: "TXN-7280", customer: "Lisa Anderson", amount: 567.00, method: "Mastercard ****8888", status: "success", date: "2024-01-14 16:55" },
  { id: "6", transactionId: "TXN-7279", customer: "David Kim", amount: 299.99, method: "Apple Pay", status: "success", date: "2024-01-14 15:30" },
  { id: "7", transactionId: "TXN-7278", customer: "Anna Martinez", amount: 145.00, method: "Visa ****9876", status: "pending", date: "2024-01-14 14:12" },
  { id: "8", transactionId: "TXN-7277", customer: "Robert Taylor", amount: 89.99, method: "PayPal", status: "success", date: "2024-01-14 12:08" },
];

const statusStyles = {
  success: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
};

export default function Payments() {
  const [search, setSearch] = useState("");

  const filteredPayments = mockPayments.filter(
    (p) =>
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  const totalSuccess = mockPayments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

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
                <p className="text-2xl font-bold text-foreground">${totalSuccess.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {mockPayments.filter((p) => p.status === "pending").length}
                </p>
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
                <p className="text-2xl font-bold text-foreground">
                  {mockPayments.filter((p) => p.status === "failed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
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
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
