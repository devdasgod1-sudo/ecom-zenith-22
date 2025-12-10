import { AdminLayout } from "@/components/layout/AdminLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { DollarSign, Package, TrendingDown, UserPlus } from "lucide-react";

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Sales"
          value="$48,294"
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
        />
        <KPICard
          title="Active Products"
          value="1,842"
          change="+32 new this week"
          changeType="positive"
          icon={Package}
          iconColor="bg-primary/10 text-primary"
        />
        <KPICard
          title="Lost (Refunds)"
          value="$2,134"
          change="-8.2% from last month"
          changeType="positive"
          icon={TrendingDown}
          iconColor="bg-destructive/10 text-destructive"
        />
        <KPICard
          title="New Signups"
          value="847"
          change="+18.7% from last month"
          changeType="positive"
          icon={UserPlus}
          iconColor="bg-warning/10 text-warning"
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SalesChart />
        <TrafficChart />
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <RecentOrders />
      </div>
    </AdminLayout>
  );
}
