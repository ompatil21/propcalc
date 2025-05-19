"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Users, Building2, BarChart, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Loader from "@/components/Loader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Properties", href: "/admin/properties", icon: Building2 },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    ];

    const hideSidebar = pathname === "/admin/login" || pathname === "/admin/register";

    // Navigation loader
    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleStop = () => setLoading(false);

        router.prefetch(pathname);
        handleStop();

        const observer = new MutationObserver(() => {
            handleStop();
        });

        const root = document.querySelector("main");
        if (root) observer.observe(root, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [pathname]);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/"); // ⬅️ Redirect to landing page
    };

    // ⛔ Avoid rendering <main> wrapper on login/register pages
    if (hideSidebar) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md px-6 py-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400">Admin Panel</h2>
                    <nav className="space-y-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setLoading(true)}
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
                </div>

                <div className="space-y-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center text-sm text-red-500 hover:text-red-700 transition"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                    <ThemeToggle />
                </div>
            </aside>

            <main className="flex-1 p-8 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/50 z-50">
                        <Loader />
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
