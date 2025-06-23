"use client"; // <-- This must be at the very top

import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user session
    const checkUserSession = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");

        if (storedUserId) {
          // Verify the user still exists in the database
          const { data, error } = await supabase
            .from("applications")
            .select("id, email, first_name, last_name")
            .eq("id", storedUserId)
            .single();

          if (data && !error) {
            setUser(data);
            setUserId(data.id);
          } else {
            // User doesn't exist anymore, clear localStorage
            localStorage.removeItem("userId");
            setUser(null);
            setUserId(null);
          }
        }
      } catch (err) {
        console.error("Error checking user session:", err);
        localStorage.removeItem("userId");
        setUser(null);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setUserId(userData.id);
    localStorage.setItem("userId", userData.id);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
