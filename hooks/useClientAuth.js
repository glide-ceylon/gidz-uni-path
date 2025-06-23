// Authentication middleware for client pages
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useClientAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem("userId");
      const urlParts = window.location.pathname.split("/");
      const urlId = urlParts[urlParts.length - 1];

      // Not logged in
      if (!userId) {
        router.push("/login");
        return false;
      }

      // Trying to access different user's data
      if (userId !== urlId) {
        localStorage.removeItem("userId");
        router.push("/login");
        return false;
      }

      return true;
    };

    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("userId");
    router.push("/");
  };

  return { logout };
};
