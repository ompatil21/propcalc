"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const role = getUserRole();
        if (role !== "admin") {
            router.replace("/login"); // or redirect anywhere else
        } else {
            setChecking(false);
        }
    }, []);

    if (checking) return <p className="text-center mt-10">Checking admin access...</p>;
    return <>{children}</>;
}
