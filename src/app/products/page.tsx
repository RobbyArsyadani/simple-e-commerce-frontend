"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { fetcher } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { Product } from "@/types";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const { user, token, logout, init } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    init();
    if (!token) router.push("/login");
    else fetcher<Product[]>("/products").then(setProducts).catch(console.error);
  }, [token, init, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetcher("/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        }),
      });
      const updated = await fetcher<Product[]>("/products");
      setProducts(updated);
      setForm({ name: "", price: "", stock: "" });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Produk</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {user.role === "admin" && (
        <form
          onSubmit={handleAdd}
          className="flex gap-2 mb-6 bg-white p-4 rounded-xl shadow"
        >
          <input
            name="name"
            placeholder="Nama Produk"
            onChange={handleChange}
            value={form.name}
            className="border p-2 rounded w-1/3"
          />
          <input
            name="price"
            placeholder="Harga"
            onChange={handleChange}
            value={form.price}
            className="border p-2 rounded w-1/3"
          />
          <input
            name="stock"
            placeholder="Stok"
            onChange={handleChange}
            value={form.stock}
            className="border p-2 rounded w-1/3"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tambah
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white shadow p-4 rounded-xl">
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p>💰 Rp {p.price.toLocaleString()}</p>
            <p>📦 Stok: {p.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

