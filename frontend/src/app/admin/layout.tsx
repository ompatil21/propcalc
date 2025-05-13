"use client"
import Link from "next/link";
import { Home, Users, Building2, BarChart } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Properties", href: "/admin/properties", icon: Building2 },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            {/* Sidebar only */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md px-6 py-8">
                <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400">Admin Panel</h2>
                <nav className="space-y-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-md transition ${isActive
                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <item.icon className="w-4 h-4 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-10">
                    <ThemeToggle />
                </div>
            </aside>

            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
