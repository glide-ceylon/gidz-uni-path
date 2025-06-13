"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

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
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        Download
      </h2>

      {loading ? (
        <div className="text-center">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center">No documents found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Document Name</th>
                <th className="py-2 px-4 border-b text-left">Uploaded By</th>
                <th className="py-2 px-4 border-b text-left">View/Download</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="py-2 px-4 border-b">{doc.name}</td>
                  <td className="py-2 px-4 border-b">{doc.upload_by}</td>
                  <td className="py-2 px-4 border-b">
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View/Download
                      </a>
                    ) : (
                      "Not Uploaded"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentsToDownload;
