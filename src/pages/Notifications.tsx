import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, Bell, Check, Package, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "order" | "stock" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", type: "order", title: "New Order Received", message: "Order #ORD-7285 from Sarah Johnson for $234.50", time: "5 minutes ago", read: false },
  { id: "2", type: "stock", title: "Low Stock Alert", message: "Polaroid Camera (CAM-003) is out of stock", time: "1 hour ago", read: false },
  { id: "3", type: "order", title: "New Order Received", message: "Order #ORD-7284 from Michael Chen for $189.00", time: "2 hours ago", read: false },
  { id: "4", type: "stock", title: "Low Stock Alert", message: "Premium Watch (WTC-001) has only 5 units left", time: "3 hours ago", read: true },
  { id: "5", type: "system", title: "System Update", message: "New features have been deployed. Check the changelog.", time: "Yesterday", read: true },
  { id: "6", type: "order", title: "Order Cancelled", message: "Order #ORD-7280 has been cancelled by customer", time: "Yesterday", read: true },
];

const typeIcons = {
  order: ShoppingCart,
  stock: AlertTriangle,
  system: Bell,
};

const typeStyles = {
  order: "bg-primary/10 text-primary",
  stock: "bg-warning/10 text-warning",
  system: "bg-muted text-muted-foreground",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminLayout title="Notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 && "s"}
            </span>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            return (
              <Card
                key={notification.id}
                className={cn(
                  "p-4 transition-all",
                  !notification.read && "border-l-4 border-l-primary bg-primary/5"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                      typeStyles[notification.type]
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
