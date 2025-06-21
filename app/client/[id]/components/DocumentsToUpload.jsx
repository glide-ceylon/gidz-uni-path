"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import {
  FaCheck,
  FaUpload,
  FaFilePdf,
  FaTimes,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

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
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-appleGray-800 mb-2 flex items-center">
          <FaCloudUploadAlt className="w-5 h-5 text-sky-500 mr-2" />
          Upload Documents
        </h3>
        <p className="text-sm text-appleGray-600">
          Upload your required documents in PDF format
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <FaClock className="w-6 h-6 text-sky-500" />
            </div>
            <p className="text-appleGray-600">Loading documents...</p>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-appleGray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-6 h-6 text-appleGray-400" />
          </div>
          <p className="text-appleGray-500 font-medium">No documents found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group bg-appleGray-50 hover:bg-white border border-appleGray-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <FaFilePdf className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-appleGray-800 text-sm">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-appleGray-500">
                      Uploaded by: {doc.upload_by}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {doc.url ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-soft">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => openModal(doc)}
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-soft hover:shadow-medium inline-flex items-center space-x-2"
                      title="Upload Document"
                    >
                      <FaUpload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 w-11/12 max-w-lg p-8 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-appleGray-400 hover:text-appleGray-600 hover:bg-appleGray-100 rounded-full transition-all duration-200"
              disabled={uploading}
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCloudUploadAlt className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="text-2xl font-bold text-appleGray-800 text-center mb-2">
                Upload Document
              </h3>
              <p className="text-center text-appleGray-600">
                Upload <span className="font-medium">{currentDoc?.name}</span>
              </p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Select PDF File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-appleGray-300 rounded-2xl shadow-soft bg-appleGray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                  />
                </div>
                <p className="text-xs text-appleGray-500 mt-2">
                  Maximum file size: 5MB. Only PDF files are accepted.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-appleGray-200 hover:bg-appleGray-300 text-appleGray-700 rounded-2xl font-medium transition-all duration-300"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-soft inline-flex items-center justify-center space-x-2 ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload className="w-4 h-4" />
                      <span>Upload</span>
                    </>
                  )}
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
