"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { FaCheck } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

const DocumentsToUpload = ({ applicationId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);

  // Fetch documents when component mounts or applicationId changes
  useEffect(() => {
    if (applicationId) {
      fetchDocuments(applicationId);
    }
  }, [applicationId]);

  const fetchDocuments = async (appId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("application_id", appId)
      .eq("upload_by", "Client")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching documents:", error.message);
    } else {
      setDocuments(data);
    }
    setLoading(false);
  };

  const openModal = (doc) => {
    setCurrentDoc(doc);
    setIsModalOpen(true);
    setFileToUpload(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDoc(null);
    setFileToUpload(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!currentDoc) {
      alert("No document selected.");
      return;
    }

    const file = fileToUpload;

    // Basic validation
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    // Validate file size (<= 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size should be 5MB or less.");
      return;
    }

    setUploading(true);

    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const fileName = `${Date.now()}_${sanitizedFileName}`;

    const { data: storageData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      alert("Failed to upload file. Please try again.");
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(storageData.path);

    const fileURL = publicUrlData.publicUrl;

    // Insert or update file information in the database
    const { data: insertedData, error: insertError } = await supabase
      .from("documents")
      .upsert([
        {
          id: currentDoc.id,
          application_id: applicationId,
          name: currentDoc.name,
          upload_by: "Us",
          url: fileURL,
        },
      ])
      .select();

    if (insertError) {
      console.error("Error saving document information:", insertError.message);
      alert("Failed to save document information. Please try again.");
      setUploading(false);
      return;
    }

    // Update the documents state
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === insertedData[0].id ? insertedData[0] : doc
      )
    );

    setUploading(false);
    closeModal();
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Upload</h2>

      {loading ? (
        <div className="text-center">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center">No documents found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Document Name</th>
                <th className="py-2 px-4 border-b">Uploaded By</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="py-2 px-4 border-b">{doc.name}</td>
                  <td className="py-2 px-4 border-b">{doc.upload_by}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-green-500"
                      >
                        <FaCheck size={20} title="Uploaded" />
                      </a>
                    ) : (
                      <button
                        onClick={() => openModal(doc)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Upload Document"
                      >
                        <FiUpload size={20} className="animate-bounce" />
                        <span className="font-medium">Upload</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Uploading File */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              Upload {currentDoc?.name}
            </h3>
            <form onSubmit={handleFileUpload}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="file">
                  Select PDF File
                </label>
                <input
                  type="file"
                  id="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsToUpload;
