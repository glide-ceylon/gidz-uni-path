"use client";

import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminLayout({ children }) {
  const { loading, isAuthenticated, admin } = useAdminAuth();

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
      {/* Optional: Admin Header with user info */}
      {admin && (
        <div className="bg-white border-b border-appleGray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {admin.first_name
                    ? admin.first_name[0]
                    : admin.email[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-appleGray-900">
                  {admin.first_name && admin.last_name
                    ? `${admin.first_name} ${admin.last_name}`
                    : admin.email}
                </p>
                <p className="text-xs text-appleGray-500">
                  {admin.role} {admin.department && `• ${admin.department}`}
                </p>
              </div>
            </div>
            <div className="text-xs text-appleGray-500">Admin Panel</div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
