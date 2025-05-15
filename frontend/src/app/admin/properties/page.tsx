"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAdmin from "@/components/RequireAdmin";
import { API } from "@/lib/api";

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const limit = 10;
    const router = useRouter();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/admin/properties?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProperties(data.properties);
            setTotal(data.total);
        } catch (err) {
            console.error("Error loading properties:", err);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Delete this property?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/admin/properties/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert("Deleted");
                fetchData();
            } else {
                const errorMsg = await res.text();
                alert("Delete failed: " + errorMsg);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Network error while deleting.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const filtered = properties.filter((p: any) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <RequireAdmin>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Manage Properties</h2>

                <input
                    type="text"
                    placeholder="Search by title or type..."
                    className="px-4 py-2 border dark:border-gray-600 rounded-md w-full max-w-md shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="overflow-x-auto shadow rounded">
                    <table className="min-w-full bg-white dark:bg-gray-800 text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                                        No properties found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p: any, index) => (
                                    <tr
                                        key={p._id}
                                        className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                                            }`}
                                        onClick={() => router.push(`/admin/properties/${p._id}`)}
                                    >
                                        <td className="px-6 py-4">{p.title}</td>
                                        <td className="px-6 py-4">{p.location}</td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {p.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(p._id);
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                    <span>Page {page}</span>
                    <button disabled={(page * limit) >= total} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
            </div>
        </RequireAdmin>
    );
}
