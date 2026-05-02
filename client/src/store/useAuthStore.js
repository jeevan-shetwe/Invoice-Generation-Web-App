import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (userData, token, refreshToken) => {
        localStorage.setItem("token", token);
        set({ user: userData, token, refreshToken, isAuthenticated: true });
      },
      setAccessToken: (token) => {
        localStorage.setItem("token", token);
        set({ token });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      },
      formatCurrency: (amount, currencyCode) => {
        const user = useAuthStore.getState().user;
        const currency = currencyCode || user?.currency || "USD";
        const symbols = {
          USD: "$",
          EUR: "€",
          GBP: "£",
          INR: "₹",
          CAD: "C$",
          AUD: "A$",
          JPY: "¥",
          CNY: "¥",
        };
        const symbol = symbols[currency] || "$";
        return `${symbol}${parseFloat(amount || 0).toFixed(2)}`;
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
