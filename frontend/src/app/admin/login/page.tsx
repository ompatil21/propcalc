'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid login");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ role: data.role }));

            if (data.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700 px-4">
            <div className="bg-white shadow-2xl rounded-xl w-full max-w-md p-8 sm:p-10">
                <h2 className="text-3xl font-bold text-center text-gray-800">Login to PropCalc</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Admin access only</p>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-60"
                    >
                        {loading ? <Loader /> : "LOGIN"}
                    </button>
                </form>

                {/* Admin Register Link */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    Don’t have an admin account?{" "}
                    <Link href="/admin/register" className="text-indigo-600 hover:underline font-medium">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}
