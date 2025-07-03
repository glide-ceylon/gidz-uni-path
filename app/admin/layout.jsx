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

      {/* Admin Sub-Navigation */}
      <div className="pt-20 bg-white border-b border-appleGray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-appleGray-800">
                  Admin Panel
                </h1>
                <p className="text-sm text-appleGray-500">
                  Management Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="min-h-screen pt-4">{children}</main>
    </div>
  );
}
