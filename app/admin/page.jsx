"use client";
import React, { useState, useEffect } from "react";
import UserCard from "./components/UserCard";
import { supabase } from "../../lib/supabase";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuthSystem, AUTH_TYPES } from "../../hooks/useAuthSystem";

// A reusable backdrop for modals
const ModalBackdrop = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-appleGray-200 px-8 py-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-appleGray-800">
                Create New Application
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-appleGray-100 hover:bg-appleGray-200 rounded-2xl flex items-center justify-center transition-colors duration-200"
              >
                <Icon
                  icon="material-symbols:close"
                  className="text-xl text-appleGray-600"
                />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-appleGray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-appleGray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter phone number"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Passport Number (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter passport number"
                value={formData.passport_number}
                onChange={(e) =>
                  setFormData({ ...formData, passport_number: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Initial Status
              </label>
              <select
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
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
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-appleGray-200">
              <button
                type="button"
                className="flex-1 px-6 py-3 bg-appleGray-100 hover:bg-appleGray-200 text-appleGray-700 rounded-2xl font-medium transition-all duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover"
              >
                Create Application
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-appleGray-200 px-8 py-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-appleGray-800">
                Edit Application
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-appleGray-100 hover:bg-appleGray-200 rounded-2xl flex items-center justify-center transition-colors duration-200"
              >
                <Icon
                  icon="material-symbols:close"
                  className="text-xl text-appleGray-600"
                />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-appleGray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-appleGray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter phone number"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Passport Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter passport number"
                value={formData.passport_number}
                onChange={(e) =>
                  setFormData({ ...formData, passport_number: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-appleGray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Step1">University Documents</option>
                <option value="Step2">University</option>
                <option value="Step3">Visa Documents</option>
                <option value="Step4">Visa</option>
                <option value="Step5">Visa Appointment</option>
                <option value="Step6">Successful</option>
              </select>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-appleGray-200">
              <button
                type="button"
                className="flex-1 px-6 py-3 bg-appleGray-100 hover:bg-appleGray-200 text-appleGray-700 rounded-2xl font-medium transition-all duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover"
              >
                Save Changes
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
    {
      value: "Step1",
      label: "University Documents",
      color: "bg-blue-100 text-blue-700",
      icon: "material-symbols:school",
    },
    {
      value: "Step2",
      label: "University",
      color: "bg-purple-100 text-purple-700",
      icon: "material-symbols:account-balance",
    },
    {
      value: "Step3",
      label: "Visa Documents",
      color: "bg-orange-100 text-orange-700",
      icon: "material-symbols:description",
    },
    {
      value: "Step4",
      label: "Visa",
      color: "bg-red-100 text-red-700",
      icon: "material-symbols:passport",
    },
    {
      value: "Step5",
      label: "Visa Appointment",
      color: "bg-yellow-100 text-yellow-700",
      icon: "material-symbols:event",
    },
    {
      value: "Step6",
      label: "Successful",
      color: "bg-green-100 text-green-700",
      icon: "material-symbols:check-circle",
    },
  ];

  const getCurrentStatus = () =>
    statusOptions.find((option) => option.value === application.status);
  const getNewStatus = () =>
    statusOptions.find((option) => option.value === newStatus);

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 w-full max-w-md">
          {/* Modal Header */}
          <div className="border-b border-appleGray-200 px-8 py-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-appleGray-800">
                Change Status
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-appleGray-100 hover:bg-appleGray-200 rounded-2xl flex items-center justify-center transition-colors duration-200"
              >
                <Icon
                  icon="material-symbols:close"
                  className="text-xl text-appleGray-600"
                />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-8">
            {/* Current Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-appleGray-700 mb-3">
                Current Status
              </label>
              <div
                className={`flex items-center space-x-3 p-4 rounded-2xl ${
                  getCurrentStatus()?.color
                }`}
              >
                <Icon icon={getCurrentStatus()?.icon} className="text-xl" />
                <span className="font-medium">{getCurrentStatus()?.label}</span>
              </div>
            </div>

            {/* New Status Selection */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-appleGray-700 mb-3">
                  Change to
                </label>
                <div className="space-y-3">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        newStatus === option.value
                          ? "border-sky-500 bg-sky-50"
                          : "border-appleGray-200 hover:border-appleGray-300 hover:bg-appleGray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={newStatus === option.value}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="sr-only"
                      />
                      <Icon
                        icon={option.icon}
                        className="text-xl text-appleGray-600"
                      />
                      <span className="font-medium text-appleGray-800">
                        {option.label}
                      </span>
                      {newStatus === option.value && (
                        <Icon
                          icon="material-symbols:check-circle"
                          className="text-xl text-sky-500 ml-auto"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-appleGray-200">
                <button
                  type="button"
                  className="flex-1 px-6 py-3 bg-appleGray-100 hover:bg-appleGray-200 text-appleGray-700 rounded-2xl font-medium transition-all duration-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover flex items-center justify-center space-x-2"
                >
                  <Icon icon="material-symbols:sync" className="text-lg" />
                  <span>Update Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to map backend steps to labels
const getStatusLabel = (status) => {
  const statusMap = {
    Step1: "University Documents",
    Step2: "University",
    Step3: "Visa Documents",
    Step4: "Visa",
    Step5: "Visa Appointment",
    Step6: "Successful",
  };
  return statusMap[status] || status;
};

const AdminHomePage = () => {
  // All hooks must be called at the top level, before any conditional logic
  const router = useRouter();
  const { type, isAuthenticated, loading } = useAuthSystem();

  // State hooks - must be declared before any conditional returns
  const [applications, setApplications] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editApplication, setEditApplication] = useState(null);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [currentChangingApplication, setCurrentChangingApplication] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState("all");
  const [loadingStatusId, setLoadingStatusId] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    activeApplications: 0,
    completedApplications: 0,
    pendingApplications: 0,
  });
  // Function to fetch applications - declared before useEffect
  const fetchUsers = async (Step = "all", term = "") => {
    let query = supabase.from("applications").select("*");

    // Apply Step filter if not 'all'
    if (Step !== "all") {
      query = query.eq("status", Step);
    }

    // If there's a search term, filter by name or email
    if (term.trim()) {
      // Use .or() with .ilike() for case-insensitive partial match
      query = query.or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching applications:", error.message);
    } else {
      setApplications(data);

      // Calculate dashboard stats
      const total = data.length;
      const step1 = data.filter((app) => app.status === "Step1").length;
      const step2 = data.filter((app) => app.status === "Step2").length;
      const step3 = data.filter((app) => app.status === "Step3").length;
      const step4 = data.filter((app) => app.status === "Step4").length;
      const step5 = data.filter((app) => app.status === "Step5").length;
      const step6 = data.filter((app) => app.status === "Step6").length;

      setDashboardStats({
        totalApplications: total,
        activeApplications: step1 + step2 + step3 + step4 + step5,
        completedApplications: step6,
        pendingApplications: step1,
      });
    }
  };

  // Authentication protection for admin route
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || type !== AUTH_TYPES.ADMIN) {
        console.log("Unauthorized access to /admin. Redirecting to /my-admin");
        router.push("/my-admin");
        return;
      }
    }
  }, [loading, isAuthenticated, type, router]);

  // Fetch applications on mount and when currentStep or searchTerm changes
  useEffect(() => {
    if (isAuthenticated && type === AUTH_TYPES.ADMIN && !loading) {
      fetchUsers(currentStep, searchTerm);
    }
  }, [currentStep, searchTerm, isAuthenticated, type, loading]); // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-appleGray-50 pt-20 flex items-center justify-center">
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

  // If not authenticated as admin, don't render anything (redirect is happening)
  if (!isAuthenticated || type !== AUTH_TYPES.ADMIN) {
    return null;
  }
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
    { value: "Step1", label: "University Documents" },
    { value: "Step2", label: "University" },
    { value: "Step3", label: "Visa Documents" },
    { value: "Step4", label: "Visa" },
    { value: "Step5", label: "Visa Appointment" },
    { value: "Step6", label: "Successful" },
  ];
  return (
    <div className="min-h-screen bg-appleGray-50">
      {" "}
      {/* Header Section with clear navbar separation */}
      <div className="relative pt-20 admin-header-separator">
        {/* Subtle divider line for navbar separation */}
        <div className="absolute top-[80px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-10"></div>

        {/* Additional visual separation with subtle shadow */}
        <div className="absolute top-[81px] left-0 right-0 h-2 bg-gradient-to-b from-white/20 to-transparent z-10"></div>
        <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white shadow-lg relative admin-dashboard-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-8 lg:mb-0">
                <h1 className="text-4xl font-bold mb-3 animate-fade-in">
                  Admin Dashboard
                </h1>
                <p
                  className="text-sky-100 text-lg animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  Manage applications and track student progress
                </p>
              </div>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {dashboardStats.totalApplications}
                  </div>
                  <div className="text-sky-100 text-sm">Total</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {dashboardStats.activeApplications}
                  </div>
                  <div className="text-sky-100 text-sm">Active</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {dashboardStats.completedApplications}
                  </div>
                  <div className="text-sky-100 text-sm">Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {dashboardStats.pendingApplications}
                  </div>
                  <div className="text-sky-100 text-sm">Pending</div>
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 p-6 mb-8">
          {/* Step Tabs */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-appleGray-800 mb-4">
              Filter by Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {Steps.map((step) => (
                <button
                  key={step.value}
                  onClick={() => setCurrentStep(step.value)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                    currentStep === step.value
                      ? "bg-sky-500 text-white shadow-soft"
                      : "bg-appleGray-100 text-appleGray-700 hover:bg-appleGray-200 hover:shadow-soft"
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <Icon
                  icon="material-symbols:search"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-appleGray-500 text-xl"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover flex items-center space-x-2"
              >
                <Icon icon="material-symbols:add" className="text-lg" />
                <span>New Application</span>
              </button>

              <button
                onClick={() => router.push("/admin/messages")}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover flex items-center space-x-2"
              >
                <Icon icon="humbleicons:chats" className="text-lg" />
                <span>Messages</span>
              </button>

              <button
                onClick={() => router.push("/admin/entries")}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover flex items-center space-x-2"
              >
                <Icon icon="lsicon:view-outline" className="text-lg" />
                <span>Entries</span>
              </button>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        {applications.length > 0 ? (
          <>
            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:hidden">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-3xl shadow-soft border border-appleGray-200 overflow-hidden hover:shadow-large transition-all duration-300 card-apple-hover"
                >
                  <div className="p-6">
                    <UserCard
                      application={application}
                      isSelected={selectedUserId === application.id}
                      onSelect={handleSelect}
                    />

                    {/* Status Badge */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-appleGray-200">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-appleGray-600">
                          Current Status
                        </p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            application.status === "Step4"
                              ? "bg-green-100 text-green-700"
                              : application.status === "Step3"
                              ? "bg-blue-100 text-blue-700"
                              : application.status === "Step2"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      <button
                        onClick={() => openEditModal(application)}
                        className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-all duration-200 btn-apple-hover flex items-center justify-center space-x-2"
                      >
                        <Icon
                          icon="material-symbols:edit"
                          className="text-sm"
                        />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => openChangeStatusModal(application)}
                        className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-all duration-200 btn-apple-hover flex items-center justify-center space-x-2"
                      >
                        <Icon
                          icon="material-symbols:sync"
                          className="text-sm"
                        />
                        <span>Status</span>
                      </button>

                      {application.status === "Step4" && (
                        <button
                          onClick={() =>
                            handleDeleteApplication(application.id)
                          }
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 btn-apple-hover flex items-center justify-center space-x-2"
                        >
                          <Icon
                            icon="material-symbols:delete"
                            className="text-sm"
                          />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-soft border border-appleGray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-appleGray-50 border-b border-appleGray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-appleGray-800">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-appleGray-800">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-appleGray-800">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-appleGray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-appleGray-200">
                    {applications.map((application) => (
                      <tr
                        key={application.id}
                        className={`hover:bg-appleGray-50 transition-colors duration-200 ${
                          selectedUserId === application.id ? "bg-sky-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center">
                              <Icon
                                icon="material-symbols:person"
                                className="text-lg text-white"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-appleGray-800">
                                {application.first_name} {application.last_name}
                              </div>
                              <div className="text-sm text-appleGray-600">
                                ID: {application.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-appleGray-800">
                              {application.email}
                            </div>
                            <div className="text-sm text-appleGray-600">
                              {application.telephone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              application.status === "Step4"
                                ? "bg-green-100 text-green-700"
                                : application.status === "Step3"
                                ? "bg-blue-100 text-blue-700"
                                : application.status === "Step2"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {getStatusLabel(application.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSelect(application.id)}
                              className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-all duration-200"
                              title="View Details"
                            >
                              <Icon
                                icon="material-symbols:visibility"
                                className="text-sm"
                              />
                            </button>
                            <button
                              onClick={() => openEditModal(application)}
                              className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all duration-200"
                              title="Edit"
                            >
                              <Icon
                                icon="material-symbols:edit"
                                className="text-sm"
                              />
                            </button>
                            <button
                              onClick={() => openChangeStatusModal(application)}
                              className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200"
                              title="Change Status"
                            >
                              <Icon
                                icon="material-symbols:sync"
                                className="text-sm"
                              />
                            </button>
                            {application.status === "Step4" && (
                              <button
                                onClick={() =>
                                  handleDeleteApplication(application.id)
                                }
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200"
                                title="Delete"
                              >
                                <Icon
                                  icon="material-symbols:delete"
                                  className="text-sm"
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 p-12 text-center">
            <div className="w-20 h-20 bg-appleGray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Icon
                icon="material-symbols:search-off"
                className="text-3xl text-appleGray-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-appleGray-800 mb-3">
              No Applications Found
            </h3>
            <p className="text-appleGray-600 mb-6">
              {searchTerm || currentStep !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Start by creating your first application."}
            </p>
            {!searchTerm && currentStep === "all" && (
              <button
                onClick={openCreateModal}
                className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium transition-all duration-200 btn-apple-hover"
              >
                Create First Application
              </button>
            )}
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
