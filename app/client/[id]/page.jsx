"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaPassport,
  FaCalendarAlt,
  FaGraduationCap,
  FaFileAlt,
  FaCreditCard,
  FaUniversity,
  FaUpload,
  FaComments,
  FaCheckCircle,
  FaTimes,
  FaUserGraduate,
  FaExclamationTriangle,
  FaTasks,
  FaLifeRing,
  FaChartLine,
  FaClock,
  FaSearch, // Add logout icon
} from "react-icons/fa";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation"; // Add useRouter
import { useAuthSystem, AUTH_TYPES } from "../../../hooks/useAuthSystem";
import Universities from "./components/Universities";
import DocumentsToDownload from "./components/DocumentsToDownload";
import DocumentsToUpload from "./components/DocumentsToUpload";
import VerticalStepper from "./components/VerticalStepper";
import ApplicationOptions from "./components/ApplicationOptions";
import Message from "./components/Message";
import AppointmentModal from "./components/AppointmentModal";
import NotificationSystem from "./components/NotificationSystem";
import TimelineView from "./components/TimelineView";
import SmartRecommendations from "./components/SmartRecommendations";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Image from "next/image";

const ApplicantDetail = () => {
  const [applicant, setApplicant] = useState(null);
  const [id, setId] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCreateApointemen, setShowCreateApointement] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    progressPercentage: 0,
    universityDocumentsUploaded: 0,
    universityDocumentsTotal: 10,
    visaDocumentsUploaded: 0,
    visaDocumentsTotal: 8,
    universitiesApplied: 0,
    nextDeadline: null,
  });

  const router = useRouter();
  const {
    type: authType,
    user,
    isAuthenticated,
    loading: authLoading,
    logout,
  } = useAuthSystem();
  // Authentication check - ensure user can only access their own data
  useEffect(() => {
    console.log("Client portal auth check:", {
      authLoading,
      isAuthenticated,
      authType,
      user,
    });

    if (!authLoading) {
      const urlId = window.location.pathname.split("/").pop();
      console.log("URL ID:", urlId, "User ID:", user?.id);

      if (!isAuthenticated || authType !== AUTH_TYPES.CLIENT) {
        console.log("Not authenticated or wrong type, redirecting to login");
        router.push("/login");
        return;
      }

      if (user?.id !== urlId) {
        console.log("User ID mismatch, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("Authentication check passed, setting ID");
      setId(urlId);
    }
  }, [authLoading, isAuthenticated, authType, user, router]);

  const calculateDashboardStats = useCallback(
    async (applicantData) => {
      try {
        // Get universities data
        const { data: universities, error: uniError } = await supabase
          .from("universities")
          .select("*")
          .eq("application_id", id);

        if (uniError) console.error("Error fetching universities:", uniError);

        // Calculate progress based on current status
        const statusToProgress = {
          1: 16.67, // Step 1: University Documents
          2: 33.33, // Step 2: University
          3: 50, // Step 3: Visa Documents
          4: 66.67, // Step 4: Visa
          5: 83.33, // Step 5: Visa Appointment
          6: 100, // Step 6: Successful
        };

        const currentStep = applicantData.status?.slice(-1) || "1";
        const progressPercentage = statusToProgress[currentStep] || 0;

        // Calculate document statistics using the type column
        const documents = applicantData.documents || [];

        // Count university documents that have URLs (uploaded)
        const universityDocumentsUploaded = documents.filter(
          (doc) => doc.type === "university" && doc.url && doc.url.trim() !== ""
        ).length;

        // Count visa documents that have URLs (uploaded)
        const visaDocumentsUploaded = documents.filter(
          (doc) => doc.type === "visa" && doc.url && doc.url.trim() !== ""
        ).length;

        // Count total documents by type (including those without URLs)
        const universityDocumentsTotal = documents.filter(
          (doc) => doc.type === "university"
        ).length;

        const visaDocumentsTotal = documents.filter(
          (doc) => doc.type === "visa"
        ).length;

        // Calculate next deadline (mock for now - you can enhance this with real deadlines)
        const nextDeadline =
          universities && universities.length > 0
            ? universities[0].deadline
            : null;

        // Set default totals if no documents exist yet
        const finalUniversityTotal =
          universityDocumentsTotal > 0 ? universityDocumentsTotal : 10;
        const finalVisaTotal = visaDocumentsTotal > 0 ? visaDocumentsTotal : 8;

        setDashboardStats({
          progressPercentage,
          universityDocumentsUploaded,
          universityDocumentsTotal: finalUniversityTotal,
          visaDocumentsUploaded,
          visaDocumentsTotal: finalVisaTotal,
          universitiesApplied: universities?.length || 0,
          nextDeadline,
        });
      } catch (error) {
        console.error("Error calculating dashboard stats:", error);
      }
    },
    [id]
  );

  const fetchApplicant = useCallback(
    async (applicantId) => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*, documents(*)")
          .eq("id", applicantId)
          .single();

        if (error) throw error;
        if (data) {
          setApplicant(data);

          // Find and set profile picture if available
          const profileDoc = data.documents?.find(
            (doc) => doc.name === "Profile Picture"
          );
          if (profileDoc) {
            setProfilePicUrl(profileDoc.url);
          } // Calculate dashboard statistics
          calculateDashboardStats(data);

          // Generate notifications based on application status
          generateNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching applicant:", error.message);
      }
    },
    [calculateDashboardStats]
  );

  useEffect(() => {
    if (id) {
      fetchApplicant(id);
    }
  }, [id, fetchApplicant]);

  const generateNotifications = (applicantData) => {
    const newNotifications = [];
    const now = Date.now();

    // Check for urgent payments
    if (!applicantData.payment1) {
      newNotifications.push({
        id: `payment1-${now}`,
        type: "warning",
        title: "Payment Required",
        message: "Payment 1 is still pending. Please complete to proceed.",
        timestamp: now,
      });
    }

    if (!applicantData.payment2) {
      newNotifications.push({
        id: `payment2-${now}`,
        type: "warning",
        title: "Payment Required",
        message: "Payment 2 is still pending. Please complete to proceed.",
        timestamp: now,
      });
    }

    // Check document status using type column
    const documents = applicantData.documents || [];
    const uploadedDocuments = documents.filter(
      (doc) => doc.url && doc.url.trim() !== ""
    );

    if (uploadedDocuments.length < 5) {
      newNotifications.push({
        id: `documents-${now}`,
        type: "info",
        title: "Documents Needed",
        message: `You have uploaded ${uploadedDocuments.length} documents. Upload more to complete your application.`,
        timestamp: now,
      });
    }

    // Progress milestone notifications
    const currentStep = parseInt(applicantData.status?.slice(-1)) || 1;
    if (currentStep >= 2) {
      newNotifications.push({
        id: `progress-${now}`,
        type: "success",
        title: "Great Progress!",
        message: `You've completed step ${
          currentStep - 1
        } of your application journey.`,
        timestamp: now,
      });
    }

    setNotifications(newNotifications);
  };
  const dismissNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const filePath = `profile/${id}-${Date.now()}-${file.name}`;

      // Upload the file with a progress callback
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          },
        });

      if (uploadError) throw uploadError;

      // Get the public URL for the file
      const { data: imageDetails } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      if (imageDetails.publicUrl) {
        setProfilePicUrl(imageDetails.publicUrl);
      }

      // Insert a record into the documents table
      const { error: docInsertError } = await supabase
        .from("documents")
        .insert([
          {
            application_id: id,
            name: "Profile Picture",
            upload_by: "Client",
            url: imageDetails.publicUrl,
          },
        ]);

      if (docInsertError) throw docInsertError;

      setUploading(false);
      setProgress(0);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploading(false);
    }
  };
  // Define the Modal component inside the same file.
  const Modal = ({ children, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white p-8 rounded-3xl shadow-large border border-appleGray-200 w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 max-w-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-appleGray-400 hover:text-appleGray-600 hover:bg-appleGray-100 rounded-full transition-all duration-200"
          >
            <FaTimes className="w-4 h-4" />
          </button>
          {children}
        </div>
      </div>
    );
  };
  // Show loading or redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-appleGray-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-appleGray-800">
            Authenticating...
          </h2>
          <p className="text-appleGray-600">
            Please wait while we verify your access
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (!applicant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-appleGray-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <FaUserGraduate className="w-8 h-8 text-sky-500" />
          </div>
          <h2 className="text-xl font-semibold text-appleGray-800">
            Loading your portal...
          </h2>
          <p className="text-appleGray-600">
            Please wait while we fetch your information
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-appleGray-50 via-white to-sky-50 relative overflow-hidden">
      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-sky-600/5"></div>

      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-sky-400/10 rounded-full animate-float"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-sky-500/20 rounded-2xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-40 left-20 w-20 h-20 bg-sky-600/15 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-60 right-40 w-16 h-16 bg-sky-400/25 rounded-full animate-float"
        style={{ animationDelay: "3s" }}
      ></div>

      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="relative">
            {" "}
            {/* Logout Button */}
            {/* <div className="absolute top-0 right-0 z-10">
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-appleGray-300 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:border-red-300 group"
              >
                <FaSignOutAlt className="w-4 h-4 text-appleGray-600 group-hover:text-red-600 transition-colors duration-300" />
                <span className="text-sm font-medium text-appleGray-700 group-hover:text-red-600 transition-colors duration-300">
                  Logout
                </span>
              </button>
            </div> */}
            <div className="text-center space-y-6 animate-fade-in-up">
              {/* Student Badge */}
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl flex items-center justify-center mx-auto shadow-soft">
                <FaUserGraduate className="w-10 h-10 text-white" />
              </div>

              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-appleGray-800 mb-2">
                  Client Portal
                </h1>
                <p className="text-xl text-appleGray-600">
                  Welcome back, {applicant.first_name} {applicant.last_name}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard Overview */}
        <div className="max-w-7xl mx-auto mb-8">
          {" "}
          {/* Progress Banner */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-6 lg:p-8 mb-6 text-white shadow-large progress-banner">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">
                  Your Journey Progress
                </h2>
                <p className="text-sky-100">
                  {dashboardStats.progressPercentage}% Complete
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold stats-counter">
                  {dashboardStats.progressPercentage}%
                </div>
                <div className="text-sm text-sky-100">Complete</div>
              </div>
            </div>
            <div className="w-full bg-sky-400/30 rounded-full h-3 mb-4">
              <div
                className="bg-white h-3 rounded-full transition-all duration-1000 ease-out progress-bar-animated"
                style={{
                  width: `${dashboardStats.progressPercentage}%`,
                  "--progress-width": `${dashboardStats.progressPercentage}%`,
                }}
              ></div>
            </div>
            <div className="flex items-center text-sm text-sky-100">
              <FaCheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>
                Next:{" "}
                {dashboardStats.progressPercentage < 20
                  ? "Upload university documents"
                  : dashboardStats.progressPercentage < 40
                  ? "Apply to universities"
                  : dashboardStats.progressPercentage < 60
                  ? "Upload visa documents"
                  : dashboardStats.progressPercentage < 80
                  ? "Complete visa application"
                  : dashboardStats.progressPercentage < 100
                  ? "Schedule visa appointment"
                  : "Journey complete!"}
              </span>
            </div>
          </div>{" "}
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 quick-stats-grid">
            {/* University Documents Status */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-soft border border-appleGray-200 dashboard-card">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaUniversity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    dashboardStats.universityDocumentsUploaded >=
                    Math.floor(dashboardStats.universityDocumentsTotal * 0.8)
                      ? "bg-green-100 text-green-700"
                      : dashboardStats.universityDocumentsUploaded >=
                        Math.floor(
                          dashboardStats.universityDocumentsTotal * 0.5
                        )
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dashboardStats.universityDocumentsUploaded >=
                  Math.floor(dashboardStats.universityDocumentsTotal * 0.8)
                    ? "On Track"
                    : dashboardStats.universityDocumentsUploaded >=
                      Math.floor(dashboardStats.universityDocumentsTotal * 0.5)
                    ? "In Progress"
                    : "Action Needed"}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-appleGray-800 mb-1 stats-counter">
                {dashboardStats.universityDocumentsUploaded}/
                {dashboardStats.universityDocumentsTotal}
              </div>
              <div className="text-xs sm:text-sm text-appleGray-600">
                University Documents
              </div>
            </div>

            {/* Visa Documents Status */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-soft border border-appleGray-200 dashboard-card">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <FaPassport className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    dashboardStats.visaDocumentsUploaded >=
                    Math.floor(dashboardStats.visaDocumentsTotal * 0.75)
                      ? "bg-green-100 text-green-700"
                      : dashboardStats.visaDocumentsUploaded >=
                        Math.floor(dashboardStats.visaDocumentsTotal * 0.4)
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dashboardStats.visaDocumentsUploaded >=
                  Math.floor(dashboardStats.visaDocumentsTotal * 0.75)
                    ? "On Track"
                    : dashboardStats.visaDocumentsUploaded >=
                      Math.floor(dashboardStats.visaDocumentsTotal * 0.4)
                    ? "In Progress"
                    : "Action Needed"}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-appleGray-800 mb-1 stats-counter">
                {dashboardStats.visaDocumentsUploaded}/
                {dashboardStats.visaDocumentsTotal}
              </div>
              <div className="text-xs sm:text-sm text-appleGray-600">
                Visa Documents
              </div>
            </div>

            {/* Universities Applied */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-soft border border-appleGray-200 dashboard-card">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    dashboardStats.universitiesApplied > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {dashboardStats.universitiesApplied > 0
                    ? "Applied"
                    : "Pending"}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-appleGray-800 mb-1 stats-counter">
                {dashboardStats.universitiesApplied}
              </div>
              <div className="text-xs sm:text-sm text-appleGray-600">
                Universities Applied
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-soft border border-appleGray-200 dashboard-card">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FaCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    applicant?.payment1 && applicant?.payment2
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {applicant?.payment1 && applicant?.payment2
                    ? "Complete"
                    : "Pending"}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-appleGray-800 mb-1 stats-counter">
                {(applicant?.payment1 ? 1 : 0) + (applicant?.payment2 ? 1 : 0)}
                /2
              </div>
              <div className="text-xs sm:text-sm text-appleGray-600">
                Payments Complete
              </div>
            </div>
          </div>{" "}
          {/* Critical Alerts */}
          {(dashboardStats.visaDocumentsUploaded <
            Math.floor(dashboardStats.visaDocumentsTotal * 0.4) ||
            dashboardStats.universityDocumentsUploaded <
              Math.floor(dashboardStats.universityDocumentsTotal * 0.5) ||
            !applicant?.payment1 ||
            !applicant?.payment2) && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-3xl p-4 sm:p-6 mb-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">
                    Action Required
                  </h3>
                  <div className="space-y-2">
                    {!applicant?.payment1 && (
                      <div className="flex items-center text-xs sm:text-sm text-red-700">
                        <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span>Complete Payment 1</span>
                      </div>
                    )}
                    {!applicant?.payment2 && (
                      <div className="flex items-center text-xs sm:text-sm text-red-700">
                        <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span>Complete Payment 2</span>
                      </div>
                    )}
                    {dashboardStats.visaDocumentsUploaded <
                      Math.floor(dashboardStats.visaDocumentsTotal * 0.4) && (
                      <div className="flex items-center text-xs sm:text-sm text-red-700">
                        <FaPassport className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span>
                          Upload more visa documents (
                          {dashboardStats.visaDocumentsUploaded}/
                          {dashboardStats.visaDocumentsTotal})
                        </span>
                      </div>
                    )}
                    {dashboardStats.universityDocumentsUploaded <
                      Math.floor(
                        dashboardStats.universityDocumentsTotal * 0.5
                      ) && (
                      <div className="flex items-center text-xs sm:text-sm text-red-700">
                        <FaUniversity className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span>
                          Upload more university documents (
                          {dashboardStats.universityDocumentsUploaded}/
                          {dashboardStats.universityDocumentsTotal})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>{" "}
        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-appleGray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 dashboard-grid">
            <button
              onClick={() => setShowMessageModal(true)}
              className="group bg-white p-4 sm:p-6 rounded-3xl shadow-soft border border-appleGray-200 hover:shadow-medium transition-all duration-300 card-apple-hover relative dashboard-card"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-2xl flex items-center justify-center group-hover:bg-sky-200 transition-colors duration-300">
                  <FaComments className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-appleGray-800">
                    Messages
                  </h4>
                  <p className="text-xs sm:text-sm text-appleGray-600">
                    Chat with counselor
                  </p>
                </div>
              </div>
              {/* Status indicator */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 bg-green-500 rounded-full"></div>
            </button>

            <button
              onClick={() => setShowCreateApointement(true)}
              className="group bg-white p-4 sm:p-6 rounded-3xl shadow-soft border border-appleGray-200 hover:shadow-medium transition-all duration-300 card-apple-hover relative dashboard-card"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                  <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-appleGray-800">
                    Appointments
                  </h4>
                  <p className="text-xs sm:text-sm text-appleGray-600">
                    Schedule meeting
                  </p>
                </div>
              </div>
              {/* Status indicator */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 bg-yellow-500 rounded-full"></div>
            </button>
          </div>
        </div>
        {/* Tabbed Navigation */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-3xl shadow-soft border border-appleGray-200 overflow-hidden">
            {" "}
            {/* Tab Headers */}
            <div className="border-b border-appleGray-200">
              <nav className="flex overflow-x-auto tab-navigation">
                {" "}
                {[
                  { id: "overview", label: "Overview", icon: FaChartLine },
                  { id: "timeline", label: "Timeline", icon: FaCalendarAlt },
                  { id: "documents", label: "Documents", icon: FaFileAlt },
                  {
                    id: "universities",
                    label: "Universities",
                    icon: FaUniversity,
                  },
                  { id: "tasks", label: "Visa", icon: FaPassport },
                  { id: "support", label: "Support", icon: FaLifeRing },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-sky-500 text-sky-600 bg-sky-50"
                        : "border-transparent text-appleGray-600 hover:text-appleGray-800 hover:border-appleGray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {/* Tab badge for urgent items */}
                    {tab.id === "tasks" &&
                      (dashboardStats.visaDocumentsUploaded <
                        Math.floor(dashboardStats.visaDocumentsTotal * 0.4) ||
                        !applicant?.payment1 ||
                        !applicant?.payment2) && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center tab-badge-urgent">
                          !
                        </span>
                      )}
                    {tab.id === "documents" &&
                      (dashboardStats.universityDocumentsUploaded <
                        Math.floor(
                          dashboardStats.universityDocumentsTotal * 0.5
                        ) ||
                        dashboardStats.visaDocumentsUploaded <
                          Math.floor(
                            dashboardStats.visaDocumentsTotal * 0.4
                          )) && (
                        <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          !
                        </span>
                      )}
                  </button>
                ))}
              </nav>
            </div>
            {/* Tab Content */}
            <div className="min-h-[600px] tab-content">
              {activeTab === "overview" && (
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Application Progress */}
                  <div>
                    <h3 className="text-xl font-bold text-appleGray-800 mb-4 flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-sky-500 mr-3" />
                      Application Progress
                    </h3>
                    <div className="bg-gradient-to-r from-sky-500/10 to-sky-600/10 p-6 rounded-2xl">
                      <VerticalStepper
                        currentStep={applicant.status.slice(-1)}
                      />
                    </div>
                  </div>

                  {/* Quick Stats Summary */}
                  <div>
                    <h3 className="text-xl font-bold text-appleGray-800 mb-4 flex items-center">
                      <FaChartLine className="w-5 h-5 text-sky-500 mr-3" />
                      Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-appleGray-50 p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-appleGray-600">
                            Progress
                          </span>
                          <span className="text-lg font-bold text-appleGray-800">
                            {dashboardStats.progressPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-appleGray-50 p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-appleGray-600">
                            Next Step
                          </span>
                          <span className="text-sm font-bold text-sky-600">
                            {dashboardStats.progressPercentage < 20
                              ? "University Documents"
                              : dashboardStats.progressPercentage < 40
                              ? "Universities"
                              : dashboardStats.progressPercentage < 60
                              ? "Visa Documents"
                              : dashboardStats.progressPercentage < 80
                              ? "Visa Application"
                              : dashboardStats.progressPercentage < 100
                              ? "Visa Appointment"
                              : "Complete"}
                          </span>{" "}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Recommendations */}
                  <div>
                    <SmartRecommendations
                      applicantData={applicant}
                      applicationId={id}
                      dashboardStats={dashboardStats}
                    />
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="p-6 sm:p-8 space-y-8">
                  <DocumentsToUpload applicationId={id} />
                  <DocumentsToDownload applicationId={id} />
                </div>
              )}

              {activeTab === "universities" && (
                <div className="p-6 sm:p-8 space-y-8">
                  <Universities applicationId={id} />
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="p-6 sm:p-8">
                  <TimelineView applicantData={applicant} applicationId={id} />
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="p-6 sm:p-8">
                  <AnalyticsDashboard
                    applicantData={applicant}
                    applicationId={id}
                    dashboardStats={dashboardStats}
                  />
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="p-6 sm:p-8 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-appleGray-800 mb-6 flex items-center">
                      <FaTasks className="w-5 h-5 text-sky-500 mr-3" />
                      Visa Application Tracker
                    </h3>

                    {/* Visa Application Tracker Steps */}
                    <div className="bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200 rounded-3xl p-6 mb-6">
                      <h4 className="text-lg font-semibold text-sky-800 mb-6 flex items-center">
                        <FaPassport className="w-5 h-5 text-sky-600 mr-3" />
                        Visa Application Progress
                      </h4>

                      <div className="space-y-4">
                        {[
                          {
                            step: 1,
                            title: "Application Document",
                            description:
                              "Complete and submit your visa application documents",
                            status: "completed", // can be: completed, current, pending
                            icon: FaFileAlt,
                          },
                          {
                            step: 2,
                            title: "Document Submitted on waiting list",
                            description:
                              "Your documents are submitted and in the processing queue",
                            status: "current",
                            icon: FaClock,
                          },
                          {
                            step: 3,
                            title: "Under Preliminary Review",
                            description:
                              "Embassy is conducting preliminary review of your application",
                            status: "pending",
                            icon: FaSearch,
                          },
                          {
                            step: 4,
                            title: "Interview Preparation",
                            description:
                              "Prepare for your visa interview if required",
                            status: "pending",
                            icon: FaComments,
                          },
                          {
                            step: 5,
                            title: "Appointment Date",
                            description:
                              "Schedule and attend your visa appointment",
                            status: "pending",
                            icon: FaCalendarAlt,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                item.status === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : item.status === "current"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {item.status === "completed" ? (
                                <FaCheckCircle className="w-5 h-5" />
                              ) : (
                                <item.icon className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-appleGray-800">
                                  Step {item.step}: {item.title}
                                </h5>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    item.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : item.status === "current"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {item.status === "completed"
                                    ? "Completed"
                                    : item.status === "current"
                                    ? "In Progress"
                                    : "Pending"}
                                </span>
                              </div>
                              <p className="text-sm text-appleGray-600 mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Application Options */}
                    <div className="space-y-8">
                      <ApplicationOptions
                        applicationId={id}
                        optionsToCheck={[
                          { name: "CREATED UA ACCOUNT", option: false },
                          { name: "VISA APPOINTMENT", option: false },
                          { name: "APPLIED UNIVERSITY", option: false },
                          { name: "DORMS (OPTIONAL)", option: false },
                        ]}
                        title="📋 Application Requirements"
                      />

                      <ApplicationOptions
                        applicationId={id}
                        optionsToCheck={[{ name: "ADMISSION/OFFER LETTER" }]}
                        title="🎓 Admission Process"
                      />

                      <ApplicationOptions
                        applicationId={id}
                        optionsToCheck={[
                          { name: "ENROLMENT LETTER", option: false },
                        ]}
                        title="🏛️ University Enrollment"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "support" && (
                <div className="p-6 sm:p-8 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-appleGray-800 mb-6 flex items-center">
                      <FaLifeRing className="w-5 h-5 text-sky-500 mr-3" />
                      Support & Communication
                    </h3>{" "}
                    {/* Communication Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className="group bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-3xl border border-sky-200 hover:shadow-medium transition-all duration-300 support-action-card"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center">
                            <FaComments className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-lg font-semibold text-appleGray-800">
                              Message Counselor
                            </h4>
                            <p className="text-sm text-appleGray-600">
                              Get instant help and guidance
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setShowCreateApointement(true)}
                        className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-3xl border border-green-200 hover:shadow-medium transition-all duration-300 support-action-card"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                            <FaCalendarAlt className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-lg font-semibold text-appleGray-800">
                              Book Appointment
                            </h4>
                            <p className="text-sm text-appleGray-600">
                              Schedule a consultation call
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                    {/* Personal Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
                        👤 Personal Information
                      </h4>
                      <div className="bg-appleGray-50 p-6 rounded-3xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Personal Details */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <FaCalendarAlt className="w-5 h-5 text-appleGray-400" />
                              <div>
                                <span className="text-sm font-medium text-appleGray-600">
                                  Date of Birth
                                </span>
                                <p className="text-appleGray-800">
                                  {applicant.date_of_birth || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <FaPassport className="w-5 h-5 text-appleGray-400" />
                              <div>
                                <span className="text-sm font-medium text-appleGray-600">
                                  Passport Number
                                </span>
                                <p className="text-appleGray-800">
                                  {applicant.passport_number || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <FaPhone className="w-5 h-5 text-appleGray-400" />
                              <div>
                                <span className="text-sm font-medium text-appleGray-600">
                                  Telephone
                                </span>
                                <p className="text-appleGray-800">
                                  {applicant.telephone || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <FaEnvelope className="w-5 h-5 text-appleGray-400" />
                              <div>
                                <span className="text-sm font-medium text-appleGray-600">
                                  Email
                                </span>
                                <p className="text-appleGray-800">
                                  {applicant.email || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Profile Picture */}
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                              <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-soft border-4 border-white">
                                <Image
                                  width={128}
                                  height={128}
                                  src={profilePicUrl || "/logo.png"}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            {!profilePicUrl && (
                              <div className="text-center">
                                <label className="cursor-pointer bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-2xl text-sm font-medium transition-colors duration-200 inline-flex items-center space-x-2">
                                  <FaUpload className="w-4 h-4" />
                                  <span>Upload Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileUpload}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>{" "}
        {/* Modal with Message component */}
        {showMessageModal && (
          <Modal onClose={() => setShowMessageModal(false)}>
            <Message />
          </Modal>
        )}
        {showCreateApointemen && (
          <Modal onClose={() => setShowCreateApointement(false)}>
            <AppointmentModal onClose={() => setShowCreateApointement(false)} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ApplicantDetail;
