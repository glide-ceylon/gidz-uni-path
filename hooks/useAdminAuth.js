"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if admin session is valid
  const checkSession = async () => {
    try {
      const response = await fetch("/api/admin-auth/validate", {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.admin) {
          setAdmin(data.admin);
          setIsAuthenticated(true);
          return true;
        }
      }

      // Session invalid
      setAdmin(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error("Session check error:", error);
      setAdmin(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          remember_me: rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAdmin(data.data.admin);
        setIsAuthenticated(true);
        return { success: true, admin: data.data.admin };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error" };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch("/api/admin-auth/login", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
      router.replace("/my-admin");
    }
  };

  // Check session on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const isValid = await checkSession();

      if (!isValid) {
        // Redirect to login if not authenticated
        router.replace("/my-admin");
      }

      setLoading(false);
    };

    initAuth();
  }, [router]);

  return {
    loading,
    admin,
    isAuthenticated,
    login,
    logout,
    checkSession,
  };
}
