"use client";

import { useAdminAuth } from "../../../hooks/useAdminAuth";
import { useState, useEffect } from "react";

export default function AdminDebugPage() {
  const { loading, admin, isAuthenticated } = useAdminAuth();
  const [sessionInfo, setSessionInfo] = useState(null);
  const [apiTest, setApiTest] = useState(null);
  const [sessionTest, setSessionTest] = useState(null);
  const [permissionTest, setPermissionTest] = useState(null);

  // Test the session validation API
  const testSession = async () => {
    try {
      const response = await fetch("/api/admin-auth/validate", {
        credentials: "include",
      });
      const data = await response.json();
      setSessionInfo({ response: response.status, data });
    } catch (error) {
      setSessionInfo({ error: error.message });
    }
  };

  // Test the admin-users API
  const testAdminAPI = async () => {
    try {
      const response = await fetch("/api/admin-users", {
        credentials: "include",
      });
      const data = await response.json();
      setApiTest({ response: response.status, data });
    } catch (error) {
      setApiTest({ error: error.message });
    }
  };

  // Test session endpoint
  const testSessionEndpoint = async () => {
    try {
      const response = await fetch("/api/admin-test/session", {
        credentials: "include",
      });
      const data = await response.json();
      setSessionTest({ response: response.status, data });
    } catch (error) {
      setSessionTest({ error: error.message });
    }
  };

  // Test permissions endpoint
  const testPermissionsEndpoint = async () => {
    try {
      const response = await fetch("/api/admin-test/session", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setPermissionTest({ response: response.status, data });
    } catch (error) {
      setPermissionTest({ error: error.message });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      testSession();
      testAdminAPI();
      testSessionEndpoint();
      testPermissionsEndpoint();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Debug Information</h1>

      <div className="space-y-6">
        {/* Authentication Status */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Is Authenticated:</strong>{" "}
              {isAuthenticated ? "Yes" : "No"}
            </p>
            <p>
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </p>
            {admin && (
              <div>
                <p>
                  <strong>Admin Email:</strong> {admin.email}
                </p>
                <p>
                  <strong>Admin Role:</strong> {admin.role}
                </p>
                <p>
                  <strong>Admin Name:</strong> {admin.first_name}{" "}
                  {admin.last_name}
                </p>
                <div className="mt-2">
                  <strong>Permissions:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-sm overflow-auto">
                    {JSON.stringify(admin.permissions, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session Test */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">
            Session Validation Test
          </h2>
          <button
            onClick={testSession}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-2"
          >
            Test Session API
          </button>
          <button
            onClick={testSessionEndpoint}
            className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
          >
            Test Session Endpoint
          </button>
          {sessionInfo && (
            <div>
              <h3 className="font-semibold mt-4 mb-2">
                Auth Validate Response:
              </h3>
              <p>
                <strong>Response Status:</strong> {sessionInfo.response}
              </p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            </div>
          )}
          {sessionTest && (
            <div>
              <h3 className="font-semibold mt-4 mb-2">
                Session Test Response:
              </h3>
              <p>
                <strong>Response Status:</strong> {sessionTest.response}
              </p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(sessionTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Permissions Test */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">
            Admin Creation Permissions Test
          </h2>
          <button
            onClick={testPermissionsEndpoint}
            className="bg-orange-500 text-white px-4 py-2 rounded mb-4"
          >
            Test Creation Permissions
          </button>
          {permissionTest && (
            <div>
              <p>
                <strong>Response Status:</strong> {permissionTest.response}
              </p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(permissionTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Admin API Test */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Admin Users API Test</h2>
          <button
            onClick={testAdminAPI}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Test Admin Users API
          </button>
          {apiTest && (
            <div>
              <p>
                <strong>Response Status:</strong> {apiTest.response}
              </p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-96">
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Cookies Info */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Browser Cookies</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {document.cookie || "No cookies found"}
          </pre>
        </div>
      </div>
    </div>
  );
}
