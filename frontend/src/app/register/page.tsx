"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";




export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Wait until client renders
    useEffect(() => {
        setMounted(true);
    }, []);

    // // Redirect if token exists (client-side only)
    // useEffect(() => {
    //     if (mounted) {
    //         const token = localStorage.getItem("token");
    //         if (token) {
    //             console.log("Redirecting: already logged in");
    //             router.replace("/"); // Or /admin if you prefer
    //         }
    //     }
    // }, [mounted]);

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role: "admin" }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Registration failed");
            } else {
                setSuccess("Registered successfully. Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            }
        } catch (err) {
            setError("Request failed");
        } finally {
            setLoading(false);
        }
    };


    // Prevent rendering until mounted
    if (!mounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700 px-4">
            <div className="bg-white shadow-2xl rounded-xl w-full max-w-md p-8 sm:p-10">
                <h2 className="text-3xl font-bold text-center text-gray-800">Admin Registration</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Register a new PropCalc admin</p>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                {success && <div className="text-green-600 text-sm mb-4">{success}</div>}

                <form onSubmit={handleRegister} className="space-y-5">
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
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label className="flex items-center mt-1 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-60"
                    >
                        {loading ? <Loader /> : "Register"}
                    </button>

                </form>
            </div>
        </div>
    );
}
