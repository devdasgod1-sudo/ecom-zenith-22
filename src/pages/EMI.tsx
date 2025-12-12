import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import {
  Calculator,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Percent,
  Plus,
  Printer,
  Trash2,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  History,
  CheckCircle2,
  Clock,
  XCircle,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

interface EMIPaymentHistory {
  id: string;
  month: number;
  amount: number;
  paidDate: string;
  status: "paid" | "pending" | "overdue";
}

interface EMIApplication {
  id: string;
  applicationNo: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  ppPhoto: string;
  productName: string;
  productImage: string;
  totalAmount: number;
  downPayment: number;
  emiAmount: number;
  tenure: number;
  interestRate: number;
  bankName: string;
  bankAccountNo: string;
  cardNumber: string;
  cardExpiry: string;
  cardLastFour: string;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  appliedDate: string;
  approvedDate?: string;
  paymentHistory: EMIPaymentHistory[];
}

const mockEMIApplications: EMIApplication[] = [
  {
    id: "1",
    applicationNo: "EMI-2024-001",
    customerName: "Ram Sharma",
    email: "ram@email.com",
    phone: "+977-9841234567",
    address: "Kathmandu, Nepal",
    ppPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    productName: "Samsung Galaxy S24 Ultra",
    productImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop",
    totalAmount: 180000,
    downPayment: 72000,
    emiAmount: 9500,
    tenure: 12,
    interestRate: 12,
    bankName: "Nepal Bank Ltd",
    bankAccountNo: "1234567890123456",
    cardNumber: "4242424242424242",
    cardExpiry: "12/26",
    cardLastFour: "4242",
    status: "active",
    appliedDate: "2024-01-10",
    approvedDate: "2024-01-12",
    paymentHistory: [
      { id: "1", month: 1, amount: 9500, paidDate: "2024-02-10", status: "paid" },
      { id: "2", month: 2, amount: 9500, paidDate: "2024-03-10", status: "paid" },
      { id: "3", month: 3, amount: 9500, paidDate: "2024-04-10", status: "paid" },
      { id: "4", month: 4, amount: 9500, paidDate: "", status: "pending" },
    ],
  },
  {
    id: "2",
    applicationNo: "EMI-2024-002",
    customerName: "Sita Thapa",
    email: "sita@email.com",
    phone: "+977-9851234567",
    address: "Pokhara, Nepal",
    ppPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    productName: "MacBook Pro 14",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
    totalAmount: 350000,
    downPayment: 140000,
    emiAmount: 19000,
    tenure: 12,
    interestRate: 10,
    bankName: "Nabil Bank",
    bankAccountNo: "9876543210987654",
    cardNumber: "5555555555555555",
    cardExpiry: "08/25",
    cardLastFour: "5555",
    status: "pending",
    appliedDate: "2024-01-14",
    paymentHistory: [],
  },
  {
    id: "3",
    applicationNo: "EMI-2024-003",
    customerName: "Hari Prasad",
    email: "hari@email.com",
    phone: "+977-9861234567",
    address: "Biratnagar, Nepal",
    ppPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    productName: "LG 55 OLED TV",
    productImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop",
    totalAmount: 220000,
    downPayment: 88000,
    emiAmount: 11800,
    tenure: 12,
    interestRate: 11,
    bankName: "Himalayan Bank",
    bankAccountNo: "1122334455667788",
    cardNumber: "4111111111111234",
    cardExpiry: "03/27",
    cardLastFour: "1234",
    status: "completed",
    appliedDate: "2023-12-01",
    approvedDate: "2023-12-03",
    paymentHistory: Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 1),
      month: i + 1,
      amount: 11800,
      paidDate: `2024-0${String(i + 1).padStart(2, "0")}-03`,
      status: "paid" as const,
    })),
  },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  active: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
};

const paymentStatusStyles = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
};

export default function EMI() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [applications, setApplications] = useState<EMIApplication[]>(mockEMIApplications);
  const [viewingApp, setViewingApp] = useState<EMIApplication | null>(null);
  const [editingApp, setEditingApp] = useState<EMIApplication | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editStatusApp, setEditStatusApp] = useState<EMIApplication | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.customerName.toLowerCase().includes(search.toLowerCase()) ||
        app.applicationNo.toLowerCase().includes(search.toLowerCase()) ||
        app.productName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const paginatedApps = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = useMemo(() => ({
    total: applications.length,
    active: applications.filter((a) => a.status === "active").length,
    pending: applications.filter((a) => a.status === "pending").length,
    totalValue: applications
      .filter((a) => a.status === "active")
      .reduce((sum, a) => sum + a.totalAmount, 0),
  }), [applications]);

  const handleDelete = (id: string) => {
    setApplications(applications.filter((a) => a.id !== id));
    toast({ title: "Application deleted" });
  };

  const handleStatusUpdate = () => {
    if (editStatusApp && newStatus) {
      setApplications(applications.map((a) =>
        a.id === editStatusApp.id ? { ...a, status: newStatus as EMIApplication["status"] } : a
      ));
      toast({ title: "Status updated", description: `Application status changed to ${newStatus}` });
      setEditStatusApp(null);
      setNewStatus("");
    }
  };

  const handleShare = (app: EMIApplication) => {
    const text = `EMI Application: ${app.applicationNo}\nCustomer: ${app.customerName}\nProduct: ${app.productName}\nAmount: Rs. ${app.totalAmount.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Details copied to clipboard" });
  };

  const handlePrint = (app: EMIApplication) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>EMI Document - ${app.applicationNo}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
              .logo { font-size: 28px; font-weight: bold; color: #1e40af; }
              .logo span { color: #eab308; }
              .photo-section { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
              .pp-photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #1e40af; }
              .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
              .section-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ddd; }
              .label { color: #666; }
              .value { font-weight: 500; }
              .highlight { background: linear-gradient(135deg, #1e40af, #eab308); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
              .signature { margin-top: 60px; display: flex; justify-content: space-between; }
              .sig-box { width: 200px; text-align: center; }
              .sig-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Fatafat<span>Sewa</span></div>
              <div>EMI Application Document</div>
              <div style="margin-top: 10px; color: #666;">Application No: ${app.applicationNo}</div>
            </div>
            
            <div class="photo-section">
              <img src="${app.ppPhoto}" class="pp-photo" alt="Customer Photo" />
              <div>
                <h2 style="margin: 0;">${app.customerName}</h2>
                <p style="color: #666; margin: 5px 0;">${app.email}</p>
                <p style="color: #666; margin: 0;">${app.phone}</p>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="row"><span class="label">Full Name</span><span class="value">${app.customerName}</span></div>
              <div class="row"><span class="label">Email</span><span class="value">${app.email}</span></div>
              <div class="row"><span class="label">Phone</span><span class="value">${app.phone}</span></div>
              <div class="row"><span class="label">Address</span><span class="value">${app.address}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">Product Details</div>
              <div class="row"><span class="label">Product</span><span class="value">${app.productName}</span></div>
              <div class="row"><span class="label">Total Amount</span><span class="value">Rs. ${app.totalAmount.toLocaleString()}</span></div>
            </div>
            
            <div class="highlight">
              <div class="section-title" style="color: white;">EMI Details</div>
              <div class="row"><span class="label">Down Payment (40%)</span><span class="value">Rs. ${app.downPayment.toLocaleString()}</span></div>
              <div class="row"><span class="label">Loan Amount</span><span class="value">Rs. ${(app.totalAmount - app.downPayment).toLocaleString()}</span></div>
              <div class="row"><span class="label">Interest Rate</span><span class="value">${app.interestRate}% p.a.</span></div>
              <div class="row"><span class="label">Tenure</span><span class="value">${app.tenure} Months</span></div>
              <div class="row"><span class="label">Monthly EMI</span><span class="value">Rs. ${app.emiAmount.toLocaleString()}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">Bank & Card Information</div>
              <div class="row"><span class="label">Bank Name</span><span class="value">${app.bankName}</span></div>
              <div class="row"><span class="label">Account Number</span><span class="value">****${app.bankAccountNo.slice(-4)}</span></div>
              <div class="row"><span class="label">Card Number</span><span class="value">****${app.cardLastFour}</span></div>
              <div class="row"><span class="label">Card Expiry</span><span class="value">${app.cardExpiry}</span></div>
            </div>
            
            <div class="signature">
              <div class="sig-box"><div class="sig-line">Customer Signature</div></div>
              <div class="sig-box"><div class="sig-line">Authorized Signature</div></div>
            </div>
            
            <div class="footer">
              <p>This is a computer generated document. For queries contact: support@fatafatsewa.com</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <AdminLayout title="EMI Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Calculator className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active EMIs</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Percent className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Value</p>
                <p className="text-2xl font-bold text-foreground">Rs. {(stats.totalValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>EMI/Month</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApps.map((app) => (
                <TableRow key={app.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={app.ppPhoto} alt={app.customerName} />
                        <AvatarFallback>{app.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{app.customerName}</p>
                        <p className="text-xs text-muted-foreground">{app.applicationNo}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={app.productImage} alt={app.productName} className="h-full w-full object-cover" />
                      </div>
                      <span className="max-w-[150px] truncate">{app.productName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">Rs. {app.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-primary font-medium">Rs. {app.emiAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", statusStyles[app.status])}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewingApp(app)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditStatusApp(app);
                          setNewStatus(app.status);
                        }}
                        title="Edit Status"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePrint(app)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(app)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(app.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredApplications.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* View Dialog with Tabs */}
        <Dialog open={!!viewingApp} onOpenChange={() => setViewingApp(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                EMI Application Details
              </DialogTitle>
              <DialogDescription>View complete application details and payment history</DialogDescription>
            </DialogHeader>
            {viewingApp && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details" className="gap-2">
                    <User className="h-4 w-4" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2">
                    <History className="h-4 w-4" />
                    Payment History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 mt-4">
                  {/* Customer with Photo */}
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                    <Avatar className="h-20 w-20 border-4 border-primary/20">
                      <AvatarImage src={viewingApp.ppPhoto} alt={viewingApp.customerName} />
                      <AvatarFallback className="text-2xl">{viewingApp.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{viewingApp.customerName}</h3>
                      <p className="text-muted-foreground">{viewingApp.email}</p>
                      <p className="text-sm text-muted-foreground">{viewingApp.phone}</p>
                      <Badge className={cn("mt-2 capitalize", statusStyles[viewingApp.status])}>
                        {viewingApp.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="rounded-lg bg-muted/30 p-4 space-y-3">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Information
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted">
                        <img src={viewingApp.productImage} alt={viewingApp.productName} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{viewingApp.productName}</p>
                        <p className="text-lg font-bold text-primary">Rs. {viewingApp.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* EMI Details */}
                  <div className="rounded-lg gradient-brand p-4 text-primary-foreground space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      EMI Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-primary-foreground/20">
                        <span className="opacity-80">Down Payment (40%)</span>
                        <span className="font-medium">Rs. {viewingApp.downPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-primary-foreground/20">
                        <span className="opacity-80">Loan Amount</span>
                        <span className="font-medium">Rs. {(viewingApp.totalAmount - viewingApp.downPayment).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-primary-foreground/20">
                        <span className="opacity-80">Interest Rate</span>
                        <span className="font-medium">{viewingApp.interestRate}% p.a.</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-primary-foreground/20">
                        <span className="opacity-80">Tenure</span>
                        <span className="font-medium">{viewingApp.tenure} Months</span>
                      </div>
                      <div className="col-span-2 flex justify-between py-2 text-lg">
                        <span>Monthly EMI</span>
                        <span className="font-bold">Rs. {viewingApp.emiAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank & Card Info */}
                  <div className="rounded-lg bg-muted/30 p-4 space-y-3">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Bank & Card Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Bank Name</span>
                        <span className="font-medium">{viewingApp.bankName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Account No.</span>
                        <span className="font-mono">****{viewingApp.bankAccountNo.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Card Number</span>
                        <span className="font-mono">****{viewingApp.cardLastFour}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Card Expiry</span>
                        <span>{viewingApp.cardExpiry}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="text-center py-8 border rounded-lg border-dashed">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-32 w-32 border-4 border-primary/20">
                        <AvatarImage src={viewingApp.ppPhoto} alt="PP Photo" />
                        <AvatarFallback className="text-4xl">{viewingApp.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Profile Photo</p>
                        <p className="text-sm text-muted-foreground">Customer's PP Photo</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handlePrint(viewingApp)} className="gap-2 flex-1">
                      <Printer className="h-4 w-4" />
                      Print Document
                    </Button>
                    <Button variant="outline" onClick={() => handleShare(viewingApp)} className="gap-2 flex-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  {viewingApp.paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {viewingApp.paymentHistory.filter((p) => p.status === "paid").length} of {viewingApp.tenure} payments completed
                        </p>
                        <Badge variant="outline">
                          Rs. {(viewingApp.paymentHistory.filter((p) => p.status === "paid").length * viewingApp.emiAmount).toLocaleString()} paid
                        </Badge>
                      </div>
                      <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Month</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Paid Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {viewingApp.paymentHistory.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">Month {payment.month}</TableCell>
                                <TableCell>Rs. {payment.amount.toLocaleString()}</TableCell>
                                <TableCell>{payment.paidDate || "-"}</TableCell>
                                <TableCell>
                                  <Badge className={cn("capitalize", paymentStatusStyles[payment.status])}>
                                    {payment.status === "paid" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                    {payment.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                    {payment.status === "overdue" && <XCircle className="h-3 w-3 mr-1" />}
                                    {payment.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payment history yet</p>
                      <p className="text-sm">Payments will appear here once the EMI is activated</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={!!editStatusApp} onOpenChange={() => setEditStatusApp(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Update Application Status</DialogTitle>
              <DialogDescription>
                Change the status for {editStatusApp?.applicationNo}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge className={cn("capitalize", editStatusApp ? statusStyles[editStatusApp.status] : "")}>
                  {editStatusApp?.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditStatusApp(null)}>Cancel</Button>
              <Button onClick={handleStatusUpdate}>Update Status</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Dialog - simplified for now */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>New EMI Application</DialogTitle>
              <DialogDescription>Create a new EMI application</DialogDescription>
            </DialogHeader>
            <EMIFormContent
              onSave={(data) => {
                const newApp: EMIApplication = {
                  id: crypto.randomUUID(),
                  applicationNo: `EMI-2024-${String(applications.length + 1).padStart(3, "0")}`,
                  ...data,
                  status: "pending",
                  appliedDate: new Date().toISOString().split("T")[0],
                  paymentHistory: [],
                };
                setApplications([newApp, ...applications]);
                toast({ title: "Application created" });
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function EMIFormContent({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<EMIApplication, "id" | "applicationNo" | "status" | "appliedDate" | "paymentHistory">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    ppPhoto: "",
    productName: "",
    productImage: "",
    totalAmount: 0,
    tenure: 12,
    interestRate: 12,
    bankName: "",
    bankAccountNo: "",
    cardNumber: "",
    cardExpiry: "",
    cardLastFour: "",
  });

  const downPayment = formData.totalAmount * 0.4;
  const loanAmount = formData.totalAmount - downPayment;
  const monthlyRate = formData.interestRate / 12 / 100;
  const emiAmount = loanAmount > 0 ? Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, formData.tenure)) /
      (Math.pow(1 + monthlyRate, formData.tenure) - 1)
  ) : 0;

  const handleSubmit = () => {
    onSave({
      ...formData,
      downPayment,
      emiAmount,
    });
  };

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2 text-primary">
          <User className="h-4 w-4" />
          Customer Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+977-98XXXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label>PP Photo URL</Label>
            <Input
              value={formData.ppPhoto}
              onChange={(e) => setFormData({ ...formData, ppPhoto: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      {/* Product & EMI */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2 text-primary">
          <Package className="h-4 w-4" />
          Product & EMI Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="Enter product name"
            />
          </div>
          <div className="space-y-2">
            <Label>Product Image URL</Label>
            <Input
              value={formData.productImage}
              onChange={(e) => setFormData({ ...formData, productImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Total Amount (Rs.)</Label>
            <Input
              type="number"
              value={formData.totalAmount || ""}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Tenure (Months)</Label>
            <Select
              value={String(formData.tenure)}
              onValueChange={(v) => setFormData({ ...formData, tenure: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="18">18 Months</SelectItem>
                <SelectItem value="24">24 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <Input
              type="number"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
              placeholder="12"
            />
          </div>
        </div>

        {formData.totalAmount > 0 && (
          <div className="rounded-lg gradient-brand p-4 text-primary-foreground">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm opacity-80">Down Payment (40%)</p>
                <p className="text-lg font-bold">Rs. {downPayment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Loan Amount</p>
                <p className="text-lg font-bold">Rs. {loanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Monthly EMI</p>
                <p className="text-lg font-bold">Rs. {emiAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bank Info */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2 text-primary">
          <CreditCard className="h-4 w-4" />
          Bank & Card Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Select
              value={formData.bankName}
              onValueChange={(v) => setFormData({ ...formData, bankName: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nepal Bank Ltd">Nepal Bank Ltd</SelectItem>
                <SelectItem value="Nabil Bank">Nabil Bank</SelectItem>
                <SelectItem value="Himalayan Bank">Himalayan Bank</SelectItem>
                <SelectItem value="NIC Asia Bank">NIC Asia Bank</SelectItem>
                <SelectItem value="Global IME Bank">Global IME Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              value={formData.bankAccountNo}
              onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
              placeholder="Account number"
            />
          </div>
          <div className="space-y-2">
            <Label>Card Number</Label>
            <Input
              value={formData.cardNumber}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ 
                  ...formData, 
                  cardNumber: value,
                  cardLastFour: value.slice(-4)
                });
              }}
              placeholder="Card number"
            />
          </div>
          <div className="space-y-2">
            <Label>Card Expiry</Label>
            <Input
              value={formData.cardExpiry}
              onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
              placeholder="MM/YY"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Application</Button>
      </div>
    </div>
  );
}
