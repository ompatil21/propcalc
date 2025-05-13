"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    const fetchData = async () => {
        const res = await fetch(`/api/admin/properties?page=${page}&limit=${limit}`);
        const data = await res.json();
        setProperties(data.properties);
        setTotal(data.total);
    };

    const handleDelete = async (id: string) => {
        const confirm = window.confirm("Delete this property?");
        if (!confirm) return;
        const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("Deleted");
            fetchData();
        } else {
            alert("Delete failed");
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <RequireAdmin>
            <div>
                <h2 className="text-xl font-semibold mb-4">Properties</h2>
                <table className="w-full bg-white shadow rounded overflow-hidden text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((p: any) => (
                            <tr key={p._id} className="border-t">
                                <td className="px-4 py-2">{p.title}</td>
                                <td className="px-4 py-2">{p.location}</td>
                                <td className="px-4 py-2">{p.type}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between mt-4">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                    <span>Page {page}</span>
                    <button disabled={(page * limit) >= total} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
            </div>
        </RequireAdmin>
    );
}
