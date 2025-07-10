"use client";

import { useAdminAuth } from "../../hooks/useAdminAuth";
import Nav from "../components/nav-german";

export default function AdminLayout({ children }) {
  const { loading, isAuthenticated } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-appleGray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-500 mx-auto"></div>
          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-semibold text-appleGray-800">
              Loading Admin Panel
            </h3>
            <p className="text-appleGray-600">Authenticating your access...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, the useAdminAuth hook will redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-appleGray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="text-xl font-semibold text-appleGray-800">
              Redirecting to login...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appleGray-50">
      {/* Use the existing navigation */}
      <Nav />

      {/* Page Content */}
      <main className="min-h-screen pt-4">{children}</main>
    </div>
  );
}
