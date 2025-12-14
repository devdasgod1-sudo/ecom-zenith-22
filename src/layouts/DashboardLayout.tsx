
import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    CreditCard,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    Image,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Products", path: "/products", icon: Package },
        { label: "Categories", path: "/categories", icon: Layers },
        { label: "Blog", path: "/blog", icon: FileText },
        { label: "Reviews", path: "/reviews", icon: Users },
        { label: "Payments", path: "/payments", icon: CreditCard },
        { label: "EMI", path: "/emi", icon: CreditCard },
        { label: "Gateways", path: "/payment-gateways", icon: Settings },
        { label: "Notifications", path: "/notifications", icon: Bell },
        { label: "Banners", path: "/banners", icon: Image },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">


            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>


            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
