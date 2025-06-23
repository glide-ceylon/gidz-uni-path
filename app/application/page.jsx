"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function ApplicationPage() {
  const [appNumber, setAppNumber] = useState("");
  const [password, setPassword] = useState("");
  const [applicationData, setApplicationData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!appNumber.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // This route should check email & password in your Supabase 'applications' table
      const response = await fetch("/api/forms/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: appNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If invalid credentials or an error occurred, throw
        throw new Error(data.error || "Verification failed");
      }

      // If credentials are valid, you can redirect directly:
      // (You could do any additional checks on `data` if needed)
      router.push(
        "http://localhost:3000/admin/application/9d412cbe-d308-4f71-a9b3-44c04ab6f382"
      );
    } catch (err) {
      // Display error message on failure
      setError(err.message);
      setApplicationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = (e, docName) => {
    // Handle document upload logic here
    console.log(`Uploading document for: ${docName}`);
  };
  // Login/Status Check View
  if (!applicationData) {
    return (
      <div className="min-h-screen bg-appleGray-50 pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Icon
                icon="material-symbols:search"
                className="text-3xl text-white"
              />
            </div>
            <h1 className="text-3xl font-bold text-appleGray-800 mb-3">
              Check Application Status
            </h1>
            <p className="text-appleGray-600">
              Enter your email and password to view your application status
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-appleGray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerify();
                    }}
                  />
                  <Icon
                    icon="material-symbols:mail"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-appleGray-500 text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-appleGray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerify();
                    }}
                  />
                  <Icon
                    icon="material-symbols:lock"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-appleGray-500 text-xl"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <Icon
                    icon="material-symbols:error"
                    className="text-xl text-red-500"
                  />
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-appleGray-300 disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:search" className="text-lg" />
                    <span>Check Status</span>
                  </>
                )}
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-appleGray-200">
              <h3 className="text-sm font-medium text-appleGray-700 mb-3">
                Need Help?
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-appleGray-600">
                  • Use the email address you provided during application
                </p>
                <p className="text-sm text-appleGray-600">
                  • Contact support if you forgot your password
                </p>
                <p className="text-sm text-appleGray-600">
                  • Application ID format: xxxx-xxxx-xxxx
                </p>
              </div>
              <button
                onClick={() => router.push("/contact")}
                className="mt-4 text-sky-500 hover:text-sky-600 font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <Icon icon="material-symbols:support" className="text-lg" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } // Application Details View
  else {
    return (
      <div className="min-h-screen bg-appleGray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-appleGray-800 mb-2">
                  Application Details
                </h1>
                <p className="text-appleGray-600">
                  Track your application progress and submit required documents
                </p>
              </div>
              <button
                onClick={() => setApplicationData(null)}
                className="px-6 py-3 bg-appleGray-100 hover:bg-appleGray-200 text-appleGray-700 rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Icon icon="material-symbols:logout" className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-appleGray-800 mb-6">
              Application Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-appleGray-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center">
                  <Icon
                    icon="material-symbols:person"
                    className="text-xl text-white"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-appleGray-600">
                    Applicant Name
                  </p>
                  <p className="text-lg font-semibold text-appleGray-800">
                    {applicationData.firstName || "Not Available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-appleGray-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Icon
                    icon="material-symbols:description"
                    className="text-xl text-white"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-appleGray-600">
                    Procedure Type
                  </p>
                  <p className="text-lg font-semibold text-appleGray-800">
                    {applicationData.procedure || "Standard Application"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {applicationData.documents?.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-appleGray-800">
                  Required Documents
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-appleGray-600">Submitted</span>
                  <div className="w-3 h-3 bg-orange-500 rounded-full ml-4"></div>
                  <span className="text-sm text-appleGray-600">Pending</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {applicationData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-appleGray-50 rounded-2xl p-6 border-2 border-transparent hover:border-appleGray-200 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-appleGray-800 mb-2">
                          {doc.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {doc.submitted ? (
                            <>
                              <Icon
                                icon="material-symbols:check-circle"
                                className="text-xl text-green-500"
                              />
                              <span className="text-green-600 font-medium">
                                Submitted
                              </span>
                            </>
                          ) : (
                            <>
                              <Icon
                                icon="material-symbols:pending"
                                className="text-xl text-orange-500"
                              />
                              <span className="text-orange-600 font-medium">
                                Required
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      {doc.submitted ? (
                        <button
                          disabled
                          className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-2xl font-medium cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <Icon
                            icon="material-symbols:check-circle"
                            className="text-lg"
                          />
                          <span>Upload Complete</span>
                        </button>
                      ) : (
                        <label className="w-full px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium cursor-pointer transition-all duration-200 btn-apple-hover flex items-center justify-center space-x-2">
                          <Icon
                            icon="material-symbols:upload"
                            className="text-lg"
                          />
                          <span>Upload Document</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png,.jpeg"
                            onChange={(e) => handleDocumentUpload(e, doc.name)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Icon
                  icon="material-symbols:check-circle"
                  className="text-3xl text-green-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-appleGray-800 mb-3">
                All Documents Submitted
              </h3>
              <p className="text-appleGray-600 mb-6">
                No additional documents are required for your application at
                this time.
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Icon
                  icon="material-symbols:check-circle"
                  className="text-xl"
                />
                <span className="font-medium">Application Complete</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
