"use client";
import React, { useState, useEffect } from "react";
import UserCard from "./components/UserCard";
import { supabase } from "../../lib/supabase";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

// A reusable backdrop for modals
const ModalBackdrop = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40"
    onClick={onClick}
  />
);

// CREATE APPLICATION MODAL
const CreateApplicationModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    address: "",
    passport_number: "",
    status: "Step1", // Initialize with default status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    // Clear form after submission
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      telephone: "",
      address: "",
      passport_number: "",
      status: "Step1",
    });
    onClose();
  };

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
          <h2 className="text-xl font-bold mb-4">Create New Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-2 border w-full rounded"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-2 border w-full rounded"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border w-full rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Telephone"
              className="p-2 border w-full rounded"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="p-2 border w-full rounded"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Passport Number"
              className="p-2 border w-full rounded"
              value={formData.passport_number}
              onChange={(e) =>
                setFormData({ ...formData, passport_number: e.target.value })
              }
            />
            {/* Status Selection */}
            <select
              className="p-2 border w-full rounded"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Step1">Documents</option>
              <option value="Step2">University</option>
              <option value="Step3">Visa</option>
              <option value="Step4">Successful</option>
            </select>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// EDIT APPLICATION MODAL
const EditApplicationModal = ({ application, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: application.first_name || "",
    last_name: application.last_name || "",
    email: application.email || "",
    telephone: application.telephone || "",
    address: application.address || "",
    passport_number: application.passport_number || "",
    status: application.status || "Step1",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(application.id, formData);
    onClose();
  };

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
          <h2 className="text-xl font-bold mb-4">Edit Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border w-full rounded"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Name"
              className="p-2 border w-full rounded"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border w-full rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Telephone"
              className="p-2 border w-full rounded"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="p-2 border w-full rounded"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Passport Number"
              className="p-2 border w-full rounded"
              value={formData.passport_number}
              onChange={(e) =>
                setFormData({ ...formData, passport_number: e.target.value })
              }
            />
            {/* Status Selection */}
            <select
              className="p-2 border w-full rounded"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Step1">Documents</option>
              <option value="Step2">University</option>
              <option value="Step3">Visa</option>
              <option value="Step4">Successful</option>
            </select>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// STATUS CHANGE MODAL
const ChangeStatusModal = ({ application, onClose, onChangeStatus }) => {
  const [newStatus, setNewStatus] = useState(application.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onChangeStatus(newStatus);
    onClose();
  };

  const statusOptions = [
    { value: "Step1", label: "Documents" },
    { value: "Step2", label: "University" },
    { value: "Step3", label: "Visa" },
    { value: "Step4", label: "Successful" },
  ];

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm relative">
          <h2 className="text-xl font-bold mb-4">Change Status</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              className="p-2 border rounded w-full"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Helper function to map backend steps to labels
const getStatusLabel = (status) => {
  const statusMap = {
    Step1: "Documents",
    Step2: "University",
    Step3: "Visa",
    Step4: "Successful",
  };
  return statusMap[status] || status;
};

const AdminHomePage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editApplication, setEditApplication] = useState(null);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [currentChangingApplication, setCurrentChangingApplication] =
    useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Step Filter State
  const [currentStep, setCurrentStep] = useState("all");

  // Loading state for status updates
  const [loadingStatusId, setLoadingStatusId] = useState(null);

  const router = useRouter();

  // Fetch applications on mount and when currentStep or searchTerm changes
  useEffect(() => {
    fetchUsers(currentStep, searchTerm);
  }, [currentStep, searchTerm]);

  // Read / Fetch
  const fetchUsers = async (Step = "all", term = "") => {
    let query = supabase.from("applications").select("*");

    // Apply Step filter if not 'all'
    if (Step !== "all") {
      query = query.eq("status", Step);
    }

    // If there's a search term, filter by name or email
    if (term.trim()) {
      // Use .or() with .ilike() for case-insensitive partial match
      query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching applications:", error.message);
    } else {
      setApplications(data);
    }
  };

  // Create
  const handleCreateApplication = async (newApp) => {
    const { error } = await supabase.from("applications").insert([newApp]);
    if (error) {
      console.error("Error creating application:", error.message);
    } else {
      // Refresh the list
      await fetchUsers(currentStep, searchTerm);
    }
  };

  // Update
  const handleUpdateApplication = async (id, updatedFields) => {
    const { error } = await supabase
      .from("applications")
      .update(updatedFields)
      .eq("id", id);
    if (error) {
      console.error("Error updating application:", error.message);
    } else {
      // Refresh the list
      await fetchUsers(currentStep, searchTerm);
    }
  };

  // Delete
  const handleDeleteApplication = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmation) return;
  
      // Now delete the application
    const { error: applicationError } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);
  
    if (applicationError) {
      console.error("Error deleting application:", applicationError.message);
    } else {
      // Refresh the list
      await fetchUsers(currentStep, searchTerm);
    }
  };
  

  // Handle card click
  const handleSelect = (id) => {
    setSelectedUserId((prevId) => (prevId === id ? null : id));
    // Open detail in a new tab (optional)
    router.push("/admin/application/" + id);
  };

  // Open "Create" modal
  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  // Open "Edit" modal
  const openEditModal = (application) => {
    setEditApplication(application);
    setShowEditModal(true);
  };

  // Open "Change Status" modal
  const openChangeStatusModal = (application) => {
    setCurrentChangingApplication(application);
    setShowChangeStatusModal(true);
  };

  // Handle the search button click
  const handleSearch = () => {
    // Re-fetch the list filtered by the current search term and Step
    fetchUsers(currentStep, searchTerm);
  };

  // Handle status change
  const handleChangeStatus = async (newStatus) => {
    if (!currentChangingApplication) return;

    setLoadingStatusId(currentChangingApplication.id); // Set loading state
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", currentChangingApplication.id);
    if (error) {
      console.error("Error updating status:", error.message);
      alert("Failed to update status. Please try again.");
    } else {
      // Optionally, you can show a success message
      // Refresh the list
      await fetchUsers(currentStep, searchTerm);
    }
    setLoadingStatusId(null); // Reset loading state
  };

  // Define the Steps for tabs with user-friendly labels
  const Steps = [
    { value: "all", label: "All" },
    { value: "Step1", label: "Documents" },
    { value: "Step2", label: "University" },
    { value: "Step3", label: "Visa" },
    { value: "Step4", label: "Successful" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold mb-8 text-center">Applications</h1>

      {/* Step Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          {Steps.map((step) => (
            <button
              key={step.value}
              onClick={() => setCurrentStep(step.value)}
              className={`px-4 py-2 rounded ${
                currentStep === step.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Button to open "Create Application" modal */}
      <div className="max-w-6xl mx-auto flex justify-end mb-6">
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create New Application
        </button>
        <button
          onClick={() => router.push("/admin/messages")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 flex items-center justify-center"
        >
          <Icon icon={"humbleicons:chats"} className="text-2xl" />
          View Chats
        </button>
        <button
          onClick={() => router.push("/admin/entries")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 flex items-center justify-center"
        >
          <Icon icon={"lsicon:view-outline"} className="text-2xl" />
          View Entries
        </button>
      </div>

      {/* Search bar */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center space-x-2">
        <input
          type="text"
          className="p-2 border rounded w-full"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* List of applications */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div key={application.id} className="bg-white p-4 rounded shadow">
              <UserCard
                application={application}
                isSelected={selectedUserId === application.id}
                onSelect={handleSelect}
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openEditModal(application)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                {application.status == "Step4" && (
                  <button
                    onClick={() => handleDeleteApplication(application.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
              {/* Change Status Section */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold">Current Status:</h3>
                <p className="text-gray-700">
                  {getStatusLabel(application.status)}
                </p>
                <button
                  onClick={() => openChangeStatusModal(application)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Change Status
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No applications found.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateApplicationModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateApplication}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editApplication && (
        <EditApplicationModal
          application={editApplication}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateApplication}
        />
      )}

      {/* Change Status Modal */}
      {showChangeStatusModal && currentChangingApplication && (
        <ChangeStatusModal
          application={currentChangingApplication}
          onClose={() => setShowChangeStatusModal(false)}
          onChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
};

export default AdminHomePage;
