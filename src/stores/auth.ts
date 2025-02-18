import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  const checkStatus = async () => {

    try {
      const response = await fetch(`${API_BASE}/dogs/breeds`, {credentials: "include"});
      isAuthenticated.value = response.ok;
    } catch (error) {
      console.log(error);
      isAuthenticated.value = false;
    }
  };

  const login = async (name: string, email: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ name, email }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (response.ok) {
      isAuthenticated.value = true;
    }
    return response.ok;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    
    isAuthenticated.value = false;
  };

  return { isAuthenticated, checkStatus, login, logout };
});