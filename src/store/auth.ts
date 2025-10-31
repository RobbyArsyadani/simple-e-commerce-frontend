import { create } from "zustand";

interface User {
  id: number;
  name: string;
  role: "user" | "admin";
}

interface AuthState {
  token: string | null;
  user: User | null;
  initialized: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  init: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  initialized: false,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, initialized: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, initialized: true });
  },

  init: () => {
    const { initialized } = get();
    if (initialized) return; // ⛔️ jangan jalankan lagi kalau sudah

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      set({ token, user, initialized: true });
    } else {
      set({ initialized: true });
    }
  },
}));

