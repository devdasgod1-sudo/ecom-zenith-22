import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  CreditCard,
  Edit,
  Percent,
  Plus,
  Smartphone,
  Trash2,
  Wallet,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PaymentGateway {
  id: string;
  name: string;
  type: "wallet" | "bank" | "card";
  logo: string;
  isActive: boolean;
  interestRate?: number;
  description?: string;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  interestRate: number;
  isActive: boolean;
  accountDetails?: string;
}

const mockGateways: PaymentGateway[] = [
  { id: "1", name: "eSewa", type: "wallet", logo: "https://esewa.com.np/common/images/esewa_logo.png", isActive: true, description: "Nepal's leading digital wallet" },
  { id: "2", name: "Khalti", type: "wallet", logo: "https://khalti.com/static/khalti_logo.png", isActive: true, description: "Digital wallet for seamless payments" },
  { id: "3", name: "IME Pay", type: "wallet", logo: "https://imepay.com.np/logo.png", isActive: false, description: "Mobile payment solution" },
  { id: "4", name: "Connect IPS", type: "bank", logo: "https://connectips.com/logo.png", isActive: true, description: "Inter-bank payment system" },
];

const mockBanks: Bank[] = [
  { id: "1", name: "Nepal Bank Ltd", logo: "https://nepalbank.com.np/logo.png", interestRate: 12, isActive: true, accountDetails: "Main Branch, Kathmandu" },
  { id: "2", name: "Nabil Bank", logo: "https://nabilbank.com/logo.png", interestRate: 10, isActive: true, accountDetails: "Durbar Marg Branch" },
  { id: "3", name: "Himalayan Bank", logo: "https://himalayanbank.com/logo.png", interestRate: 11, isActive: true, accountDetails: "Thamel Branch" },
  { id: "4", name: "NIC Asia Bank", logo: "https://nicasiabank.com/logo.png", interestRate: 11.5, isActive: false, accountDetails: "Lazimpat Branch" },
  { id: "5", name: "Global IME Bank", logo: "https://globalimebank.com/logo.png", interestRate: 12.5, isActive: true, accountDetails: "New Road Branch" },
];

const typeIcons = {
  wallet: Smartphone,
  bank: Building2,
  card: CreditCard,
};

export default function PaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);
  const [banks, setBanks] = useState<Bank[]>(mockBanks);
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [isAddGatewayOpen, setIsAddGatewayOpen] = useState(false);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);

  const toggleGateway = (id: string) => {
    setGateways(gateways.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g)));
    toast({ title: "Gateway status updated" });
  };

  const toggleBank = (id: string) => {
    setBanks(banks.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
    toast({ title: "Bank status updated" });
  };

  const deleteGateway = (id: string) => {
    setGateways(gateways.filter((g) => g.id !== id));
    toast({ title: "Gateway removed" });
  };

  const deleteBank = (id: string) => {
    setBanks(banks.filter((b) => b.id !== id));
    toast({ title: "Bank removed" });
  };

  return (
    <AdminLayout title="Payment Gateways">
      <div className="space-y-8">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Wallets</p>
                  <p className="text-2xl font-bold">{gateways.filter((g) => g.type === "wallet" && g.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <Building2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Banks</p>
                  <p className="text-2xl font-bold">{banks.filter((b) => b.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                  <Percent className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Interest</p>
                  <p className="text-2xl font-bold">
                    {(banks.reduce((sum, b) => sum + b.interestRate, 0) / banks.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Methods</p>
                  <p className="text-2xl font-bold">{gateways.length + banks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Gateways Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Payment Gateways
              </CardTitle>
              <CardDescription>Manage digital wallets and payment methods</CardDescription>
            </div>
            <Button onClick={() => setIsAddGatewayOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Gateway
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gateways.map((gateway) => {
                const Icon = typeIcons[gateway.type];
                return (
                  <div
                    key={gateway.id}
                    className={`relative rounded-xl border p-4 transition-all ${
                      gateway.isActive ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                          gateway.isActive ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <Icon className={`h-6 w-6 ${gateway.isActive ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{gateway.name}</h3>
                          <Badge variant="outline" className="mt-1 capitalize">
                            {gateway.type}
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={gateway.isActive}
                        onCheckedChange={() => toggleGateway(gateway.id)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{gateway.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingGateway(gateway)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGateway(gateway.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Banks Section for EMI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                EMI Partner Banks
              </CardTitle>
              <CardDescription>Configure bank partners for EMI processing</CardDescription>
            </div>
            <Button onClick={() => setIsAddBankOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Bank
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {banks.map((bank) => (
                <div
                  key={bank.id}
                  className={`relative rounded-xl border p-4 transition-all ${
                    bank.isActive ? "border-success/30 bg-success/5" : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        bank.isActive ? "bg-success/10" : "bg-muted"
                      }`}>
                        <Building2 className={`h-6 w-6 ${bank.isActive ? "text-success" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{bank.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Percent className="h-3 w-3 text-warning" />
                          <span className="text-sm font-medium text-warning">{bank.interestRate}% p.a.</span>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={bank.isActive}
                      onCheckedChange={() => toggleBank(bank.id)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{bank.accountDetails}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBank(bank)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBank(bank.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gateway Dialog */}
        <GatewayFormDialog
          open={isAddGatewayOpen || !!editingGateway}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddGatewayOpen(false);
              setEditingGateway(null);
            }
          }}
          editData={editingGateway}
          onSave={(data) => {
            if (editingGateway) {
              setGateways(gateways.map((g) => (g.id === editingGateway.id ? { ...g, ...data } : g)));
            } else {
              const newGateway: PaymentGateway = {
                id: crypto.randomUUID(),
                name: data.name || "",
                type: (data.type as "wallet" | "bank" | "card") || "wallet",
                logo: data.logo || "",
                description: data.description || "",
                isActive: true,
              };
              setGateways([...gateways, newGateway]);
            }
            setIsAddGatewayOpen(false);
            setEditingGateway(null);
            toast({ title: editingGateway ? "Gateway updated" : "Gateway added" });
          }}
        />

        {/* Bank Dialog */}
        <BankFormDialog
          open={isAddBankOpen || !!editingBank}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddBankOpen(false);
              setEditingBank(null);
            }
          }}
          editData={editingBank}
          onSave={(data) => {
            if (editingBank) {
              setBanks(banks.map((b) => (b.id === editingBank.id ? { ...b, ...data } : b)));
            } else {
              const newBank: Bank = {
                id: crypto.randomUUID(),
                name: data.name || "",
                logo: data.logo || "",
                interestRate: data.interestRate || 12,
                accountDetails: data.accountDetails || "",
                isActive: true,
              };
              setBanks([...banks, newBank]);
            }
            setIsAddBankOpen(false);
            setEditingBank(null);
            toast({ title: editingBank ? "Bank updated" : "Bank added" });
          }}
        />
      </div>
    </AdminLayout>
  );
}

function GatewayFormDialog({
  open,
  onOpenChange,
  editData,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData: PaymentGateway | null;
  onSave: (data: Partial<PaymentGateway>) => void;
}) {
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    type: editData?.type || "wallet",
    logo: editData?.logo || "",
    description: editData?.description || "",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Gateway" : "Add Payment Gateway"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gateway Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., eSewa"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="wallet">Digital Wallet</option>
              <option value="bank">Bank Transfer</option>
              <option value="card">Card Payment</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSave(formData)} className="flex-1">
              {editData ? "Update" : "Add"} Gateway
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

function BankFormDialog({
  open,
  onOpenChange,
  editData,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData: Bank | null;
  onSave: (data: Partial<Bank>) => void;
}) {
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    logo: editData?.logo || "",
    interestRate: editData?.interestRate || 12,
    accountDetails: editData?.accountDetails || "",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Bank" : "Add EMI Partner Bank"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Nepal Bank Ltd"
            />
          </div>
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              type="number"
              step="0.5"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Branch/Account Details</Label>
            <Input
              value={formData.accountDetails}
              onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
              placeholder="Branch name, location"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSave(formData)} className="flex-1">
              {editData ? "Update" : "Add"} Bank
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
