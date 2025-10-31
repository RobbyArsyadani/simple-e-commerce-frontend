"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import { useAuth } from "@/store/auth";

interface LoginResponse {
  token: string;
  user: { id: number; name: string; role: "user" | "admin" };
}

export default function LoginPage() {
  const router = useRouter();
  const { token, user, login, init } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    init();
    if (token) router.replace("/products");
  }, [init, token, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetcher<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      login(data.token, data.user);

      // 🔥 pastikan Zustand sempat update sebelum redirect
      await new Promise((resolve) => setTimeout(resolve, 100));

      router.replace("/products");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

