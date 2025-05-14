"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Pencil, Trash2, Lock, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface User {
    _id: string | { $oid: string };
    email: string;
    role: string;
    active?: boolean;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Failed to fetch users:", await res.text());
                    return;
                }

                const data = await res.json();
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                console.error("Error loading users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter((user) =>
            user.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [search, users]);

    const getId = (user: User): string => {
        if (typeof user._id === "object" && user._id !== null && "$oid" in user._id) {
            console.log("✅ Extracted from $oid:", user._id.$oid);
            return user._id.$oid;
        }
        if (typeof user._id === "string") {
            console.log("✅ Using string _id:", user._id);
            return user._id;
        }
        console.warn("❌ getId() fallback: no valid _id", user._id);
        return "";
    };


    const handleDelete = async (user: User) => {
        const userId = getId(user);

        if (!userId || userId.trim().length !== 24) {
            toast({
                title: "Invalid user ID",
                description: "Cannot delete user without a valid MongoDB ObjectId.",
                variant: "destructive",
            });
            console.warn("🚫 Invalid userId for delete:", userId);
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("❌ Delete failed:", errText);
                toast({ title: "Delete failed", description: errText });
                return;
            }

            setUsers((prev) => prev.filter((u) => getId(u) !== userId));
            toast({ title: "User deleted successfully." });
        } catch (err) {
            console.error("❌ Delete error:", err);
            toast({ title: "Error", description: String(err) });
        }
    };


    const handleToggleActive = async (user: User) => {
        const token = localStorage.getItem("token");
        const userId = getId(user);
        if (!userId) return;

        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ active: !user.active }),
            });
            if (!res.ok) throw new Error("Failed to update user");

            setUsers((prev) =>
                prev.map((u) => (getId(u) === userId ? { ...u, active: !user.active } : u))
            );
            toast({
                title: `User ${user.active ? "disabled" : "enabled"}`,
            });
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <input
                    type="text"
                    placeholder="Search by email..."
                    className="px-4 py-2 border dark:border-gray-600 rounded-md w-full max-w-xs shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentUsers.map((user) => {
                                console.log("🔍 user._id = ", user._id);

                                const userId = getId(user);


                                console.log("🧪 Rendering row with userId:", userId);
                                return (
                                    <tr key={`user-${userId}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 capitalize">{user.role}</td>
                                        <td className="px-6 py-4">
                                            {user.active === false ? (
                                                <span className="text-red-500 font-semibold">Disabled</span>
                                            ) : (
                                                <span className="text-green-600 font-semibold">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {user.role !== "admin" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleToggleActive(user)}
                                                        className="text-yellow-500 hover:text-yellow-600"
                                                        title={user.active ? "Disable" : "Enable"}
                                                    >
                                                        <Shield className="w-4 h-4 inline" />
                                                    </button>
                                                    <button
                                                        onClick={() => alert("Edit not implemented yet")}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Edit user"
                                                    >
                                                        <Pencil className="w-4 h-4 inline" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="w-4 h-4 inline" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="inline-flex items-center" aria-label="Admin actions restricted">
                                                    <Lock className="w-4 h-4 inline text-gray-400" />
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {currentUsers.length === 0 && (
                                <tr key="no-users-row">
                                    <td colSpan={4} className="text-center text-gray-400 py-6">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-4">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
