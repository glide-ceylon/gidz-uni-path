"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // or "next/router" if using older Next.js
import { FiCheckCircle } from "react-icons/fi";

export default function ApplicationPage() {
  const [appNumber, setAppNumber] = useState("");
  const [password, setPassword] = useState("");
  const [applicationData, setApplicationData] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    setError("");
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
    }
  };

  // If you *only* intend to redirect upon valid credentials
  // and do NOT intend to show application details on this page,
  // you can remove everything below. Otherwise, keep as-is.
  if (!applicationData) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="shadow-lg rounded-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Application Status
          </h1>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Application Number (Email)
            </label>
            <input
              type="text"
              value={appNumber}
              onChange={(e) => setAppNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            onClick={handleVerify}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Verify
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Application Details
          </h1>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <p className="mb-4">
              <strong className="text-gray-700">Applicant Name:</strong>{" "}
              {applicationData.firstName}
            </p>
            <p className="mb-4">
              <strong className="text-gray-700">Procedure:</strong>{" "}
              {applicationData.procedure || "N/A"}
            </p>
          </div>
          {applicationData.documents?.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Documents to Submit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applicationData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 flex flex-col"
                  >
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      {doc.name}
                    </h3>
                    {doc.submitted ? (
                      <p className="text-green-600 font-semibold flex-1">
                        Submitted
                      </p>
                    ) : (
                      <p className="text-red-600 font-semibold flex-1">
                        Not Submitted
                      </p>
                    )}
                    <div>
                      {doc.submitted ? (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-700 py-2 rounded-md cursor-not-allowed"
                        >
                          Upload Complete
                        </button>
                      ) : (
                        <label className="w-full bg-blue-500 text-white py-2 rounded-md text-center cursor-pointer hover:bg-blue-600 transition duration-200 inline-block">
                          Upload Document
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => handleDocumentUpload(e, doc.name)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center my-6">
              <FiCheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <p className="text-2xl font-bold text-gray-700">
                No documents required for submission.
              </p>
            </div>
          )}
          <button
            onClick={() => setApplicationData(null)}
            className="mt-8 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
}
