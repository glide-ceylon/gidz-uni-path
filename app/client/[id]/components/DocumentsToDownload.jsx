"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import {
  FaDownload,
  FaFilePdf,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaClock,
  FaEye,
} from "react-icons/fa";

const DocumentsToDownload = ({ applicationId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", file: null });

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
      .eq("upload_by", "Us")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching documents:", error.message);
    } else {
      setDocuments(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async () => {
    const { name, file } = newDoc;

    // Basic validation
    if (!name || !file) {
      alert("Please provide a document name and select a file.");
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

    // Insert file information into the database
    const { data: insertedData, error: insertError } = await supabase
      .from("documents")
      .insert([
        {
          application_id: applicationId,
          name,
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

    setDocuments([...documents, insertedData[0]]);
    setNewDoc({ name: "", file: null });
    setUploading(false);
  };
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-appleGray-800 mb-2 flex items-center">
          <FaDownload className="w-5 h-5 text-sky-500 mr-2" />
          Available Downloads
        </h3>
        <p className="text-sm text-appleGray-600">
          Documents provided by GIDZ Uni Path team
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
          <p className="text-appleGray-500 font-medium">
            No documents available yet
          </p>
          <p className="text-sm text-appleGray-400 mt-1">
            Your counselor will upload documents here
          </p>
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
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaFilePdf className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-appleGray-800 text-sm">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-appleGray-500">
                      Provided by: {doc.upload_by}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {doc.url ? (
                    <div className="flex items-center space-x-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-soft hover:shadow-medium inline-flex items-center space-x-2"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>View</span>
                      </a>
                      <a
                        href={doc.url}
                        download
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-soft hover:shadow-medium inline-flex items-center space-x-2"
                      >
                        <FaDownload className="w-4 h-4" />
                        <span>Download</span>
                      </a>
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-appleGray-200 text-appleGray-500 rounded-xl text-sm font-medium">
                      Not Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsToDownload;
