"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if user is logged in and verify their session
  const checkAuth = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return false;
      }

      // Verify user exists in database
      const { data, error } = await supabase
        .from("applications")
        .select("id, email, first_name, last_name")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setUser(data);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        // User doesn't exist, clear invalid session
        localStorage.removeItem("userId");
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Auth check error:", err);
      localStorage.removeItem("userId");
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("id, email, first_name, last_name")
        .eq("email", email.toLowerCase().trim())
        .eq("password", password)
        .single();

      if (data && !error) {
        localStorage.setItem("userId", data.id);
        setUser(data);
        setIsAuthenticated(true);
        return { success: true, user: data };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Login failed" };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("userId");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  }, [router]);

  // Require authentication for protected routes
  const requireAuth = useCallback(
    (targetUserId = null) => {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return false;
      }

      // If targetUserId is provided, ensure user can only access their own data
      if (targetUserId && user.id !== targetUserId) {
        logout();
        return false;
      }

      return true;
    },
    [isAuthenticated, user, router, logout]
  );

  // Initialize auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for storage changes (logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userId") {
        if (!e.newValue) {
          // User logged out in another tab
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // User logged in in another tab
          checkAuth();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuth]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    requireAuth,
    checkAuth,
  };
};
