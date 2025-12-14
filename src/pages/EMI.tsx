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
  DollarSign,
  Share2,
  CheckCircle,
  XCircle,
  Calendar,
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
  dob?: string;
  nationalID?: string;
  gender?: string;
  maritalStatus?: string;
  salary?: string;

  productName: string;
  totalAmount: number;
  downPayment: number;
  emiAmount: number;
  tenure: number;
  interestRate: number;

  bankName: string;
  bankAccountNo: string;
  cardLastFour: string;

  guarantor?: {
    name: string;
    phone: string;
    nationalID: string;
    gender: string;
    maritalStatus: string;
    address: string;
  };

  documents?: {
    citizenshipFront?: string;
    citizenshipBack?: string;
    bankStatement?: string;
    guarantorCitizenshipFront?: string;
    guarantorCitizenshipBack?: string;
    userSignature?: string;
    photo?: string;
    guarantorPhoto?: string;
  };

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
    dob: "1990-05-15",
    nationalID: "123-456-789",
    gender: "Male",
    maritalStatus: "Married",
    salary: "50000",
    productName: "Samsung Galaxy S24 Ultra",
    totalAmount: 180000,
    downPayment: 72000,
    emiAmount: 9500,
    tenure: 12,
    interestRate: 12,
    bankName: "Global IME Bank",
    bankAccountNo: "****5678",
    cardLastFour: "4242",
    documents: {
      photo: "/placeholder-user.jpg",
      citizenFront: "/placeholder-doc.jpg",
    },
    status: "pending",
    appliedDate: "2024-01-10",
  },
  {
    id: "2",
    applicationNo: "EMI-2024-002",
    customerName: "Sita Thapa",
    email: "sita@email.com",
    phone: "+977-9851234567",
    address: "Pokhara, Nepal",
    gender: "Female",
    productName: "MacBook Pro 14",
    totalAmount: 350000,
    downPayment: 140000,
    emiAmount: 19000,
    tenure: 12,
    interestRate: 10,
    bankName: "Nabil Bank",
    bankAccountNo: "****9012",
    cardLastFour: "5555",
    status: "active",
    appliedDate: "2024-01-14",
    approvedDate: "2024-01-15",
  },
  {
    id: "3",
    applicationNo: "EMI-2024-003",
    customerName: "Hari Prasad",
    email: "hari@email.com",
    phone: "+977-9861234567",
    address: "Biratnagar, Nepal",
    gender: "Male",
    maritalStatus: "Single",
    productName: "LG 55 OLED TV",
    totalAmount: 220000,
    downPayment: 88000,
    emiAmount: 11800,
    tenure: 12,
    interestRate: 11,
    bankName: "Himalayan Bank",
    bankAccountNo: "****3456",
    cardLastFour: "1234",
    guarantor: {
      name: "Shyam Prasad",
      phone: "+977-9800000000",
      nationalID: "987-654-321",
      gender: "Male",
      maritalStatus: "Married",
      address: "Biratnagar, Nepal"
    },
    status: "completed",
    appliedDate: "2023-12-01",
    approvedDate: "2023-12-03",
  },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-fsP2/10 text-fsP2",
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

  const handleStatusUpdate = (id: string, newStatus: EMIApplication['status']) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, status: newStatus, approvedDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : app.approvedDate } : app
    ));
    toast({
      title: `Application ${newStatus}`,
      className: newStatus === 'approved' ? 'bg-success text-white' : 'bg-destructive text-white'
    });
    if (viewingApp && viewingApp.id === id) {
      setViewingApp(prev => prev ? ({ ...prev, status: newStatus }) : null);
    }
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fsP2/10">
                <FileText className="h-6 w-6 text-fsP2" />
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fsP1">
                <DollarSign className="h-6 w-6 text-white" />
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
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-fsP2 hover:bg-fsP2/90">
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
                      <div className="h-8 w-8 rounded-full bg-fsP2/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-fsP2" />
                      </div>
                      <div>
                        <p className="font-medium">{app.customerName}</p>
                        <p className="text-xs text-muted-foreground">{app.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{app.productName}</TableCell>
                  <TableCell className="font-semibold">Rs. {app.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-fsP2 font-medium">Rs. {app.emiAmount.toLocaleString()}</TableCell>
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
                        className="h-8 w-8 text-fsP2 hover:bg-fsP2/10"
                        onClick={() => setViewingApp(app)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-fsP1 hover:bg-fsP1/10"
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

        {/* View Dialog - Detailed Accept View */}
        <Dialog open={!!viewingApp} onOpenChange={() => setViewingApp(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0 rounded-2xl">
            <DialogHeader className="p-6 bg-gradient-to-r from-fsP2 to-[#035B91] text-white rounded-t-2xl">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6" />
                EMI Application Review
              </DialogTitle>
              <div className="flex justify-between items-center mt-2">
                <p className="text-white/80 text-sm">Application No: {viewingApp?.applicationNo}</p>
                <Badge className={cn("capitalize border-white/20", statusStyles[viewingApp?.status || 'pending'])}>
                  {viewingApp?.status}
                </Badge>
              </div>
            </DialogHeader>
            {viewingApp && (
              <div className="p-6 space-y-8 bg-gray-50/50">
                {/* 1. Personal Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <User className="h-5 w-5 text-fsP2" />
                    <h3 className="font-semibold text-gray-800">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem label="Full Name" value={viewingApp.customerName} />
                    <InfoItem label="Email" value={viewingApp.email} />
                    <InfoItem label="Phone" value={viewingApp.phone} />
                    <InfoItem label="Address" value={viewingApp.address} />
                    <InfoItem label="Date of Birth" value={viewingApp.dob} />
                    <InfoItem label="National ID" value={viewingApp.nationalID} />
                    <InfoItem label="Gender" value={viewingApp.gender} />
                    <InfoItem label="Marital Status" value={viewingApp.maritalStatus} />
                    <InfoItem label="Monthly Salary" value={`Rs. ${viewingApp.salary || 'N/A'}`} />
                  </div>
                </div>

                {/* 2. Product & EMI Details */}
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <Calculator className="h-5 w-5 text-fsP2" />
                    <h3 className="font-semibold text-gray-800">Product & EMI Details</h3>
                  </div>
                  <div className="bg-fsP2/5 rounded-xl p-4 border border-fsP2/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <InfoItem label="Product Name" value={viewingApp.productName} className="col-span-1 md:col-span-2 text-lg font-medium text-fsP2" />
                      <InfoItem label="Total Amount" value={`Rs. ${viewingApp.totalAmount.toLocaleString()}`} />
                      <InfoItem label="Down Payment" value={`Rs. ${viewingApp.downPayment.toLocaleString()}`} />
                      <InfoItem label="Loan Amount" value={`Rs. ${(viewingApp.totalAmount - viewingApp.downPayment).toLocaleString()}`} />
                      <InfoItem label="Interest Rate" value={`${viewingApp.interestRate}%`} />
                      <InfoItem label="Tenure" value={`${viewingApp.tenure} Months`} />
                      <div className="md:col-span-2 mt-2 pt-2 border-t border-fsP2/20 flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Monthly EMI</span>
                        <span className="text-2xl font-bold text-fsP2">Rs. {viewingApp.emiAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Bank & Credit Card */}
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <Building2 className="h-5 w-5 text-fsP2" />
                    <h3 className="font-semibold text-gray-800">Bank & Credit Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="Bank Name" value={viewingApp.bankName} />
                    <InfoItem label="Account Number" value={viewingApp.bankAccountNo} />
                    <InfoItem label="Card (Last 4)" value={`**** ${viewingApp.cardLastFour}`} />
                  </div>
                </div>

                {/* 4. Guarantor Info (if available) */}
                {viewingApp.guarantor && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                      <User className="h-5 w-5 text-fsP2" />
                      <h3 className="font-semibold text-gray-800">Guarantor Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <InfoItem label="Name" value={viewingApp.guarantor.name} />
                      <InfoItem label="Phone" value={viewingApp.guarantor.phone} />
                      <InfoItem label="National ID" value={viewingApp.guarantor.nationalID} />
                      <InfoItem label="Address" value={viewingApp.guarantor.address} />
                    </div>
                  </div>
                )}

                {/* 5. Documents */}
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <FileText className="h-5 w-5 text-fsP2" />
                    <h3 className="font-semibold text-gray-800">Documents</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <DocumentCard label="User Photo" src={viewingApp.documents?.photo} />
                    <DocumentCard label="Citizenship Front" src={viewingApp.documents?.citizenshipFront} />
                    <DocumentCard label="Citizenship Back" src={viewingApp.documents?.citizenshipBack} />
                    <DocumentCard label="Bank Statement" src={viewingApp.documents?.bankStatement} />
                    {viewingApp.guarantor && (
                      <>
                        <DocumentCard label="Guarantor Photo" src={viewingApp.documents?.guarantorPhoto} />
                        <DocumentCard label="Guarantor Citizenship" src={viewingApp.documents?.guarantorCitizenshipFront} />
                      </>
                    )}
                  </div>
                </div>


                {/* Actions Footer */}
                <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end gap-3 -mx-6 -mb-6 mt-6">
                  {viewingApp.status === 'pending' && (
                    <>
                      <Button
                        variant="destructive"
                        className="gap-2"
                        onClick={() => handleStatusUpdate(viewingApp.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject Application
                      </Button>
                      <Button
                        className="gap-2 bg-success hover:bg-success/90 text-white"
                        onClick={() => handleStatusUpdate(viewingApp.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept & Approve
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => setViewingApp(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add/Edit Dialog - Kept simple for now as focus is on View */}
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

const InfoItem = ({ label, value, className }: { label: string, value?: string | number, className?: string }) => (
  <div className={className}>
    <span className="text-xs font-medium text-gray-500 uppercase block mb-1">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
  </div>
);

const DocumentCard = ({ label, src }: { label: string, src?: string }) => (
  <div className="border border-gray-200 rounded-lg p-2 bg-white hover:shadow-md transition-shadow">
    <p className="text-xs text-center text-gray-500 mb-2">{label}</p>
    <div className="aspect-[4/3] bg-gray-100 rounded flex items-center justify-center overflow-hidden relative">
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-cover" />
      ) : (
        <FileText className="text-gray-300 h-8 w-8" />
      )}
    </div>
  </div>
);

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
            <h3 className="font-medium flex items-center gap-2 text-fsP2">
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
            <h3 className="font-medium flex items-center gap-2 text-fsP2">
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
              <div className="rounded-lg bg-gradient-to-r from-fsP2 to-[#035B91] p-4 text-white">
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
            <h3 className="font-medium flex items-center gap-2 text-fsP2">
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
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Global IME Bank">Global IME Bank</SelectItem>
                    <SelectItem value="Nabil Bank">Nabil Bank</SelectItem>
                    <SelectItem value="Himalayan Bank">Himalayan Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.bankAccountNo}
                  onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                  placeholder="Enter account number"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-fsP2 hover:bg-fsP2/90" onClick={() => onSave(formData)}>Save Application</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
