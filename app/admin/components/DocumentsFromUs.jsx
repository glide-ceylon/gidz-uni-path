"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "../../../lib/supabase";

const DocumentsFromUs = ({ applicationId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [newDoc, setNewDoc] = useState({
    name: "",
    upload_by: "Us", // Default to 'Us'
    file: null,
  });
  const [uploading, setUploading] = useState(false); // Track upload state

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
      .eq("upload_by", "Us") // Changed from 'Client' to 'Us'
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching documents:", error.message);
      // Optionally, set a notification state here
    } else {
      setDocuments(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return null;
    }

    // Validate file size (<= 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size should be 5MB or less.");
      return null;
    }

    // Sanitize the file name (replace spaces with underscores)
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const fileName = `${Date.now()}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { data: storageData, error } = await supabase.storage
      .from("documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("Upload response:", storageData); // Debugging

    if (error) {
      console.error("Error uploading file:", error.message);
      alert("Failed to upload file. Please try again.");
      return null;
    }

    if (!storageData.path) {
      console.error("File path is undefined after upload.");
      alert("Upload failed due to an unknown error.");
      return null;
    }
    debugger;
    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(storageData.path);

    return data.publicUrl;
  };

  const handleAddDocument = async () => {
    const { name, upload_by, file } = newDoc;

    // Basic validation
    if (!name) {
      alert("Please provide a document name.");
      return;
    }

    if (!upload_by) {
      alert("Please select who is uploading the document.");
      return;
    }

    setUploading(true);

    let fileURL = null;
    if (file) {
      fileURL = await handleFileUpload(file);
      if (!fileURL) {
        setUploading(false);
        return; // Stop if upload failed
      }
    }
    debugger;
    // Insert into Supabase
    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          application_id: applicationId,
          name,
          upload_by,
          url: fileURL, // Store the file URL
        },
      ])
      .select();

    if (error) {
      console.error("Error adding document:", error.message);
      alert("Failed to add document. Please try again.");
    } else {
      // Update local state
      setDocuments([...documents, data[0]]);
      // Reset form
      setNewDoc({
        name: "",
        upload_by: "Us",
        file: null,
      });
      setShowAddModal(false);
    }
    setUploading(false);
  };

  // Handle Delete Document
  const handleDeleteDocument = async (docId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmDelete) return;

    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("url")
      .eq("id", docId)
      .single();

    if (fetchError) {
      console.error(
        "Error fetching document for deletion:",
        fetchError.message
      );
      alert("Failed to delete document. Please try again.");
      return;
    }

    // Delete the file from storage if URL exists
    if (doc.url) {
      const filePath = doc.url.split("/storage/v1/object/")[1];
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from("documents")
          .remove([filePath]);

        if (deleteError) {
          console.error(
            "Error deleting file from storage:",
            deleteError.message
          );
          alert("Failed to delete file from storage.");
          return;
        }
      }
    }

    // Now delete the document record
    const { error } = await supabase.from("documents").delete().eq("id", docId);

    if (error) {
      console.error("Error deleting document:", error.message);
      alert("Failed to delete document. Please try again.");
    } else {
      // Update local state
      setDocuments(documents.filter((doc) => doc.id !== docId));
    }
  };

  // Handle Edit Document
  const handleEditDocument = async () => {
    const { id, name, upload_by, file } = currentDoc;

    // Basic validation
    if (!name) {
      alert("Please provide a document name.");
      return;
    }

    setUploading(true);

    let fileURL = currentDoc.url; // Preserve existing URL
    if (file) {
      fileURL = await handleFileUpload(file);
      if (!fileURL) {
        setUploading(false);
        return; // Stop if upload failed
      }
    }

    const { error } = await supabase
      .from("documents")
      .update({
        name,
        upload_by,
        url: fileURL,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating document:", error.message);
      alert("Failed to update document. Please try again.");
    } else {
      // Update local state
      setDocuments(
        documents.map((doc) =>
          doc.id === id ? { ...currentDoc, url: fileURL } : doc
        )
      );
      setShowEditModal(false);
      setCurrentDoc(null);
    }
    setUploading(false);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Download</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowAddModal(true)}
        >
          <Icon icon="mdi:plus" className="mr-2" />
          Add Document
        </button>
      </div>

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
                <th className="py-2 px-4 border-b text-left">View</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
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
                        Click here to view
                      </a>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => alert("Document not yet uploaded.")}
                        disabled
                      >
                        Not Yet Uploaded
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => {
                        setCurrentDoc({ ...doc, file: null });
                        setShowEditModal(true);
                      }}
                    >
                      <Icon icon="mdi:pencil" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Icon icon="mdi:delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==============================
              ADD DOCUMENT MODAL
      ============================== */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-md relative">
            <h2 className="text-xl font-semibold mb-4">Add New Document</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">
                  Document Name:
                </label>
                <input
                  type="text"
                  value={newDoc.name}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Transcript"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Uploaded By:</label>
                <select
                  value={newDoc.upload_by}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, upload_by: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Us">Us</option>
                  <option value="Client">Client</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">
                  Upload PDF (optional):
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, file: e.target.files[0] })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowAddModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleAddDocument}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================
              EDIT DOCUMENT MODAL
      ============================== */}
      {showEditModal && currentDoc && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-md relative">
            <h2 className="text-xl font-semibold mb-4">Edit Document</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">
                  Document Name:
                </label>
                <input
                  type="text"
                  value={currentDoc.name}
                  onChange={(e) =>
                    setCurrentDoc({ ...currentDoc, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Transcript"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Uploaded By:</label>
                <select
                  value={currentDoc.upload_by}
                  onChange={(e) =>
                    setCurrentDoc({ ...currentDoc, upload_by: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Us">Us</option>
                  <option value="Client">Client</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">
                  Upload PDF (optional):
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setCurrentDoc({ ...currentDoc, file: e.target.files[0] })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentDoc(null);
                }}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleEditDocument}
                disabled={uploading}
              >
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsFromUs;
