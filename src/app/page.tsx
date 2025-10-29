"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

export default function HomePage() {
  const router = useRouter();
  const { token, init } = useAuth();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (token) {
      router.replace("/products"); // langsung ke dashboard produk
    } else {
      router.replace("/login"); // kalau belum login
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-500 text-lg animate-pulse">
        Mengarahkan ke halaman yang sesuai...
      </p>
    </div>
  );
}

