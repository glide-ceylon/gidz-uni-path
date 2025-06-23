"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

// Authentication types
export const AUTH_TYPES = {
  GUEST: "guest",
  CLIENT: "client",
  ADMIN: "admin",
};

export const useAuthSystem = () => {
  const [authState, setAuthState] = useState({
    type: AUTH_TYPES.GUEST,
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  // Check client authentication (database-based)
  const checkClientAuth = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return null;

      // Verify user exists in database
      const { data, error } = await supabase
        .from("applications")
        .select("id, email, first_name, last_name")
        .eq("id", userId)
        .single();

      if (data && !error) {
        return {
          type: AUTH_TYPES.CLIENT,
          user: data,
          isAuthenticated: true,
        };
      } else {
        // Invalid client session
        localStorage.removeItem("userId");
        return null;
      }
    } catch (err) {
      console.error("Client auth check error:", err);
      localStorage.removeItem("userId");
      return null;
    }
  }, []);
  // Check admin authentication (authenticator/supabase-based)
  const checkAdminAuth = useCallback(async () => {
    try {
      // Check Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        return {
          type: AUTH_TYPES.ADMIN,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
          },
          isAuthenticated: true,
        };
      }

      // Fallback to localStorage (for backward compatibility)
      const adminAuth = localStorage.getItem("isLoggedIn");
      const adminData = localStorage.getItem("adminData");

      if (adminAuth === "true" && adminData) {
        const parsedAdminData = JSON.parse(adminData);
        return {
          type: AUTH_TYPES.ADMIN,
          user: parsedAdminData,
          isAuthenticated: true,
        };
      }
      return null;
    } catch (err) {
      console.error("Admin auth check error:", err);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("adminData");
      return null;
    }
  }, []);
  // Main authentication check
  const checkAuthentication = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      // Check admin first (higher priority)
      const adminAuth = await checkAdminAuth();
      if (adminAuth) {
        setAuthState({
          ...adminAuth,
          loading: false,
        });
        return;
      }

      // Check client authentication
      const clientAuth = await checkClientAuth();
      if (clientAuth) {
        setAuthState({
          ...clientAuth,
          loading: false,
        });
        return;
      }

      // No authentication found
      setAuthState({
        type: AUTH_TYPES.GUEST,
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (err) {
      console.error("Authentication check failed:", err);
      setAuthState({
        type: AUTH_TYPES.GUEST,
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, [checkClientAuth, checkAdminAuth]); // Client login
  const clientLogin = useCallback(async (email, password) => {
    console.log("ClientLogin called with:", email);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("id, email, first_name, last_name")
        .eq("email", email.toLowerCase().trim())
        .eq("password", password)
        .single();

      console.log("Database query result:", { data, error });
      if (data && !error) {
        // Store userId in localStorage immediately
        localStorage.setItem("userId", data.id);

        // Update auth state
        const newAuthState = {
          type: AUTH_TYPES.CLIENT,
          user: data,
          isAuthenticated: true,
          loading: false,
        };

        setAuthState(newAuthState);
        console.log(
          "Client login successful, auth state updated:",
          newAuthState
        );

        // Dispatch custom event to notify all components
        window.dispatchEvent(new Event("authStateChanged"));

        // Return success immediately
        return { success: true, user: data };
      } else {
        console.log("Database query failed:", error);
        return { success: false, error: "Invalid credentials" };
      }
    } catch (err) {
      console.error("Client login error:", err);
      return { success: false, error: "Login failed" };
    }
  }, []);
  // Admin login (supabase auth)
  const adminLogin = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const adminData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
      };

      // Store for backward compatibility
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("adminData", JSON.stringify(adminData));
      setAuthState({
        type: AUTH_TYPES.ADMIN,
        user: adminData,
        isAuthenticated: true,
        loading: false,
      });

      // Dispatch custom event to notify all components
      window.dispatchEvent(new Event("authStateChanged"));

      return { success: true, user: adminData };
    } catch (err) {
      console.error("Admin login error:", err);
      return { success: false, error: "Login failed" };
    }
  }, []);
  // Universal logout
  const logout = useCallback(async () => {
    // Clear Supabase session
    await supabase.auth.signOut();

    // Clear all possible auth data
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminData");
    setAuthState({
      type: AUTH_TYPES.GUEST,
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    // Dispatch custom event to notify all components
    window.dispatchEvent(new Event("authStateChanged"));

    router.push("/");
  }, [router]);

  // Get navigation config based on auth state
  const getNavConfig = useCallback(() => {
    switch (authState.type) {
      case AUTH_TYPES.CLIENT:
        return {
          showVisaServices: false,
          showApplications: false,
          showCheckStatus: true,
          showContact: true,
          primaryAction: {
            type: "link",
            href: `/client/${authState.user?.id}`,
            label: "My Portal",
            className:
              "text-appleGray-700 hover:text-sky-500 font-medium transition-colors duration-200",
          },
          secondaryAction: {
            type: "button",
            onClick: logout,
            label: "Logout",
            className:
              "bg-red-50 text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200 border border-red-200",
          },
        };

      case AUTH_TYPES.ADMIN:
        return {
          showVisaServices: false,
          showApplications: true,
          showCheckStatus: false, // Hide Check Status for admin
          showContact: false, // Hide Contact for admin
          primaryAction: {
            type: "link",
            href: "/admin",
            label: "Admin Dashboard",
            className:
              "text-appleGray-700 hover:text-sky-500 font-medium transition-colors duration-200",
          },
          secondaryAction: {
            type: "button",
            onClick: logout,
            label: "Logout",
            className:
              "bg-red-50 text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200 border border-red-200",
          },
        };
      default: // GUEST
        return {
          showVisaServices: true,
          showApplications: false, // Only admins should see Applications menu
          showCheckStatus: true,
          showContact: true,
          primaryAction: {
            type: "link",
            href: "/login",
            label: "Login",
            className:
              "bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold btn-apple-hover shadow-soft",
          },
          secondaryAction: null,
        };
    }
  }, [authState, logout]);
  // Initialize auth check on mount
  useEffect(() => {
    console.log("useAuthSystem: Initial auth check");
    checkAuthentication();
  }, [checkAuthentication]);
  // Listen for storage changes (cross-tab sync) and auth state changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (["userId", "isLoggedIn", "adminData"].includes(e.key)) {
        checkAuthentication();
      }
    };

    const handleAuthStateChange = () => {
      checkAuthentication();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChanged", handleAuthStateChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthStateChange);
    };
  }, [checkAuthentication]);

  return {
    ...authState,
    clientLogin,
    adminLogin,
    logout,
    getNavConfig,
    checkAuthentication,
  };
};
