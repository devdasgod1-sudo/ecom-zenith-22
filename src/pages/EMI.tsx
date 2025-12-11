import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

interface EMIApplication {
  id: string;
  applicationNo: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  productName: string;
  totalAmount: number;
  downPayment: number;
  emiAmount: number;
  tenure: number;
  interestRate: number;
  bankName: string;
  bankAccountNo: string;
  cardLastFour: string;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  appliedDate: string;
  approvedDate?: string;
}

const mockEMIApplications: EMIApplication[] = [
  {
    id: "1",
    applicationNo: "EMI-2024-001",
    customerName: "Ram Sharma",
    email: "ram@email.com",
    phone: "+977-9841234567",
    address: "Kathmandu, Nepal",
    productName: "Samsung Galaxy S24 Ultra",
    totalAmount: 180000,
    downPayment: 72000,
    emiAmount: 9500,
    tenure: 12,
    interestRate: 12,
    bankName: "Nepal Bank Ltd",
    bankAccountNo: "****5678",
    cardLastFour: "4242",
    status: "active",
    appliedDate: "2024-01-10",
    approvedDate: "2024-01-12",
  },
  {
    id: "2",
    applicationNo: "EMI-2024-002",
    customerName: "Sita Thapa",
    email: "sita@email.com",
    phone: "+977-9851234567",
    address: "Pokhara, Nepal",
    productName: "MacBook Pro 14",
    totalAmount: 350000,
    downPayment: 140000,
    emiAmount: 19000,
    tenure: 12,
    interestRate: 10,
    bankName: "Nabil Bank",
    bankAccountNo: "****9012",
    cardLastFour: "5555",
    status: "pending",
    appliedDate: "2024-01-14",
  },
  {
    id: "3",
    applicationNo: "EMI-2024-003",
    customerName: "Hari Prasad",
    email: "hari@email.com",
    phone: "+977-9861234567",
    address: "Biratnagar, Nepal",
    productName: "LG 55 OLED TV",
    totalAmount: 220000,
    downPayment: 88000,
    emiAmount: 11800,
    tenure: 12,
    interestRate: 11,
    bankName: "Himalayan Bank",
    bankAccountNo: "****3456",
    cardLastFour: "1234",
    status: "completed",
    appliedDate: "2023-12-01",
    approvedDate: "2023-12-03",
  },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  active: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
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
              .doc-title { font-size: 18px; color: #666; margin-top: 10px; }
              .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
              .section-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ddd; }
              .label { color: #666; }
              .value { font-weight: 500; }
              .highlight { background: linear-gradient(135deg, #1e40af, #eab308); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .highlight .row { border-bottom-color: rgba(255,255,255,0.2); }
              .highlight .label { color: rgba(255,255,255,0.8); }
              .highlight .value { color: white; }
              .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
              .signature { margin-top: 60px; display: flex; justify-content: space-between; }
              .sig-box { width: 200px; text-align: center; }
              .sig-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Fatafat<span>Sewa</span></div>
              <div class="doc-title">EMI Application Document</div>
              <div style="margin-top: 10px; color: #666;">Application No: ${app.applicationNo}</div>
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
              <div class="section-title">Bank Information</div>
              <div class="row"><span class="label">Bank Name</span><span class="value">${app.bankName}</span></div>
              <div class="row"><span class="label">Account Number</span><span class="value">${app.bankAccountNo}</span></div>
              <div class="row"><span class="label">Card (Last 4 digits)</span><span class="value">****${app.cardLastFour}</span></div>
            </div>
            
            <div class="signature">
              <div class="sig-box">
                <div class="sig-line">Customer Signature</div>
              </div>
              <div class="sig-box">
                <div class="sig-line">Authorized Signature</div>
              </div>
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
                <TableHead>Application</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>EMI/Month</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApps.map((app) => (
                <TableRow key={app.id} className="group">
                  <TableCell className="font-mono text-sm">{app.applicationNo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{app.customerName}</p>
                        <p className="text-xs text-muted-foreground">{app.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{app.productName}</TableCell>
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
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingApp(app)}
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

        {/* View Dialog - PDF Style */}
        <Dialog open={!!viewingApp} onOpenChange={() => setViewingApp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                EMI Application Details
              </DialogTitle>
            </DialogHeader>
            {viewingApp && (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center pb-4 border-b border-border">
                  <h2 className="text-2xl font-bold gradient-brand-text">FatafatSewa</h2>
                  <p className="text-muted-foreground">EMI Application Document</p>
                  <p className="text-sm text-muted-foreground mt-1">{viewingApp.applicationNo}</p>
                </div>

                {/* Customer Info */}
                <div className="rounded-lg bg-muted/30 p-4 space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{viewingApp.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span>{viewingApp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{viewingApp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Address:</span>
                      <span>{viewingApp.address}</span>
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
                      <span className="opacity-80">Product</span>
                      <span className="font-medium">{viewingApp.productName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary-foreground/20">
                      <span className="opacity-80">Total Amount</span>
                      <span className="font-medium">Rs. {viewingApp.totalAmount.toLocaleString()}</span>
                    </div>
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

                {/* Bank Info */}
                <div className="rounded-lg bg-muted/30 p-4 space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Bank Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Bank Name</span>
                      <span className="font-medium">{viewingApp.bankName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Account No.</span>
                      <span className="font-mono">{viewingApp.bankAccountNo}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Card</span>
                      <span className="font-mono">****{viewingApp.cardLastFour}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Applied Date</span>
                      <span>{viewingApp.appliedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button onClick={() => handlePrint(viewingApp)} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print Document
                  </Button>
                  <Button variant="outline" onClick={() => handleShare(viewingApp)} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add/Edit Dialog */}
        <EMIFormDialog
          open={isAddDialogOpen || !!editingApp}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddDialogOpen(false);
              setEditingApp(null);
            }
          }}
          editData={editingApp}
          onSave={(data) => {
            if (editingApp) {
              setApplications(applications.map((a) => (a.id === editingApp.id ? { ...a, ...data } : a)));
              toast({ title: "Application updated" });
            } else {
              const newApp: EMIApplication = {
                id: crypto.randomUUID(),
                applicationNo: `EMI-2024-${String(applications.length + 1).padStart(3, "0")}`,
                customerName: data.customerName || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
                productName: data.productName || "",
                totalAmount: data.totalAmount || 0,
                downPayment: data.downPayment || 0,
                emiAmount: data.emiAmount || 0,
                tenure: data.tenure || 12,
                interestRate: data.interestRate || 12,
                bankName: data.bankName || "",
                bankAccountNo: data.bankAccountNo || "",
                cardLastFour: data.cardLastFour || "",
                status: "pending",
                appliedDate: new Date().toISOString().split("T")[0],
              };
              setApplications([newApp, ...applications]);
              toast({ title: "Application created" });
            }
            setIsAddDialogOpen(false);
            setEditingApp(null);
          }}
        />
      </div>
    </AdminLayout>
  );
}

function EMIFormDialog({
  open,
  onOpenChange,
  editData,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData: EMIApplication | null;
  onSave: (data: Partial<EMIApplication>) => void;
}) {
  const [formData, setFormData] = useState({
    customerName: editData?.customerName || "",
    email: editData?.email || "",
    phone: editData?.phone || "",
    address: editData?.address || "",
    productName: editData?.productName || "",
    totalAmount: editData?.totalAmount || 0,
    tenure: editData?.tenure || 12,
    interestRate: editData?.interestRate || 12,
    bankName: editData?.bankName || "",
    bankAccountNo: editData?.bankAccountNo || "",
    cardLastFour: editData?.cardLastFour || "",
  });

  const downPayment = formData.totalAmount * 0.4;
  const loanAmount = formData.totalAmount - downPayment;
  const monthlyRate = formData.interestRate / 12 / 100;
  const emiAmount = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, formData.tenure)) /
      (Math.pow(1 + monthlyRate, formData.tenure) - 1)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit EMI Application" : "New EMI Application"}</DialogTitle>
        </DialogHeader>
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
              <Calculator className="h-4 w-4" />
              Product & EMI Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Product Name</Label>
                <Input
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Amount (Rs.)</Label>
                <Input
                  type="number"
                  value={formData.totalAmount}
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

            {/* EMI Preview */}
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
              <Building2 className="h-4 w-4" />
              Bank Information
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
                  placeholder="****1234"
                />
              </div>
              <div className="space-y-2">
                <Label>Credit Card (Last 4 digits)</Label>
                <Input
                  value={formData.cardLastFour}
                  onChange={(e) => setFormData({ ...formData, cardLastFour: e.target.value })}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() =>
                onSave({
                  ...formData,
                  downPayment,
                  emiAmount: isNaN(emiAmount) ? 0 : emiAmount,
                })
              }
              className="flex-1"
            >
              {editData ? "Update Application" : "Create Application"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
