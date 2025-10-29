export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

