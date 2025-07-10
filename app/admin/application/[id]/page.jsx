"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "../../../../lib/supabase";
import UniversitiesTable from "../../components/UniversitiesTable";
import DocumentsTable from "../../components/DocumentsTable";
import DcoumentsFromUs from "../../components/DocumentsFromUs";
import ApplicationOptions from "../../components/ApplicationOptoins";
import ProfilePic from "../../components/ProfilePic";
import axios from "axios";
import Image from "next/image";

const EDUCATIONAL_BACKGROUNDS = [
  "Bachelors",
  "Masters",
  "Language Course",
  "Foundation Course",
];

// ----------------------
// Yes/No Button Group
// ----------------------
const YesNoButtonGroup = ({ value, onChange }) => {
  return (
    <div className="flex space-x-3">
      <button
        type="button"
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
          value
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => onChange(true)}
      >
        <Icon icon="mdi:check" className="inline mr-1" />
        Yes
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
          !value
            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => onChange(false)}
      >
        <Icon icon="mdi:close" className="inline mr-1" />
        No
      </button>
    </div>
  );
};

// ----------------------
// Editable Field Component
// ----------------------
const EditableField = ({
  label,
  value,
  type = "text",
  onSave,
  options, // For select inputs
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            {label}
          </label>
          {!isEditing ? (
            <span className="text-gray-900 font-medium">{value || "N/A"}</span>
          ) : type === "select" ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="" disabled>
                Select {label}
              </option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : type === "date" ? (
            <input
              type="date"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <Icon icon="mdi:pencil" className="text-lg" />
            </button>
          ) : (
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              >
                <Icon icon="mdi:content-save" className="text-lg" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <Icon icon="mdi:cancel" className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ----------------------
// Applicant Detail Component
// ----------------------
const ApplicantDetail = () => {
  const [applicant, setApplicant] = useState(null);

  // For toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // For the "Create New Password" modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [lockstate, setlockstate] = useState(false);

  // Notification Modal State
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success", // or 'error'
  });

  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // --------------------------------
  //  Grab the applicant ID (from URL)
  // --------------------------------
  const [id, setId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      setId(lastPart);
    }
  }, []);

  // --------------------------------
  //  Fetch applicant data
  // --------------------------------
  useEffect(() => {
    if (id) {
      fetchApplicant(id);
    }
  }, [id]);

  const fetchApplicant = async (applicantId) => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*, documents(*)")
        .eq("id", applicantId)
        .single();

      if (error) throw error;
      if (data) {
        setApplicant(data);
        setlockstate(data.lock_1);
        // Hide password by default
        setShowPassword(false);
      }
    } catch (error) {
      console.error("Error fetching applicant:", error.message);
      setNotification({
        isOpen: true,
        title: "Error",
        message: error.message,
        type: "error",
      });
    }
  };

  // -------------------------------------------------
  //  Show/Hide Modal for "Create New Password"
  // -------------------------------------------------
  const handleOpenPasswordModal = () => {
    // Clear any previously typed password
    setTempPassword("");
    setShowPasswordModal(true);
  };
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  // -------------------------------------------------
  //  Generate a random password (simple example)
  // -------------------------------------------------
  const generateRandomPassword = () => {
    // In reality, you'd want a better generation strategy
    const randomStr = Math.random().toString(36).slice(-8); // e.g. 8 random chars
    setTempPassword(`${randomStr}`);
  };

  // -------------------------------------------------
  //  Confirm creation of new password
  //    1) Save to 'applications.password'
  //    2) (Optional) create user in Supabase Auth
  // -------------------------------------------------
  const handleConfirmNewPassword = () => {
    if (!applicant?.email) {
      setShowPasswordModal(false);
      setNotification({
        isOpen: true,
        title: "Error",
        message:
          "Cannot create a new password: no email found for this applicant.",
        type: "error",
      });
      return;
    }
    if (!tempPassword) {
      setShowPasswordModal(false);
      setNotification({
        isOpen: true,
        title: "Error",
        message: "Please enter or generate a password.",
        type: "error",
      });
      return;
    }

    // Confirmation before proceeding
    setConfirmation({
      isOpen: true,
      title: "Confirm Password Creation",
      message:
        "Are you sure you want to create a new password for this applicant?",
      onConfirm: async () => {
        try {
          // 1) Update the 'applications' table with the new password
          const { data: updatedData, error: updateError } = await supabase
            .from("applications")
            .update({ password: tempPassword })
            .eq("id", applicant.id)
            .single();

          if (updateError) throw updateError;

          // 2) (Optional) Create or update user in Supabase Auth
          // Uncomment and modify the following if you want to create/update the user in Auth
          /*
          const { user, error: authError } = await supabase.auth.admin.createUser({
            email: applicant.email,
            password: tempPassword,
            // Add other user details if needed
          });

          if (authError) throw authError;
          */
          const emailTemp = `
           <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Gidz Uni Path</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
                    <!-- Header with Logo -->
                   <div style="display: flex; align-items: center; justify-content: center; padding: 20px 0; background-color: #003366; margin-bottom: 30px;">
                    <img src="https://www.gidzunipath.com/logo.png" style="height: 70px; width: auto; margin-right: 10px;" /> 
                    <h1 style="color: #ffffff; margin-left: 10px; font-size: 28px;">Gidz Uni Path</h1>
                </div>
                    <!-- Main Content -->
                    <div style="padding: 0 20px;">
                        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${applicant.first_name},</p>
                        
                        <p style="font-size: 16px; margin-bottom: 20px;">Welcome to Gidz Uni Path! We're thrilled to support you in achieving your dream of studying in Germany.</p>

                        <!-- Login Details Box -->
                        <div style="background-color: #f8f9fa; border-left: 4px solid #003366; padding: 20px; margin-bottom: 30px;">
                            <h2 style="color: #003366; margin: 0 0 15px 0; font-size: 20px;">Your Login Details</h2>
                            <p style="margin: 5px 0;">Username: <strong>${applicant.email}</strong></p>
                            <p style="margin: 5px 0;">Password: <strong>${tempPassword}</strong></p>
                            <a href="https://www.gidzunipath.com/login" style="display: inline-block; background-color: #003366; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; margin-top: 15px;">Login Here</a>
                        </div>

                        <!-- Contact Information -->
                        <div style="margin-bottom: 30px;">
                            <h2 style="color: #003366; font-size: 20px;">Need Assistance?</h2>
                            <p style="margin-bottom: 15px;">Our team is here to help! Contact us at:</p>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 10px;">
                                    <span style="color: #003366;">📞</span> 
                                    <strong>Phone:</strong> +49 155 66389194
                                    <div style="margin-left: 25px; color: #666666; font-size: 14px;">(Monday to Friday, 9:30 am to 5:00 pm)</div>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <span style="color: #003366;">✉</span>
                                    <strong>Email:</strong> 
                                    <a href="mailto:gidzunipath@gmail.com" style="color: #003366; text-decoration: none;">gidzunipath@gmail.com</a>
                                </li>
                            </ul>
                        </div>

                        <p style="margin-bottom: 20px;">For quick answers, visit our <a href="#" style="color: #003366; text-decoration: none; font-weight: bold;">Help Center</a>.</p>

                        <p style="margin-bottom: 30px;">We're excited to be part of your educational journey and look forward to assisting you every step of the way!</p>

                        <!-- Footer -->
                        <div style="border-top: 2px solid #f4f4f4; padding-top: 20px; text-align: center;">
                            <p style="color: #666666; font-size: 14px;">Best regards,<br>The Gidz Uni Path Team</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
          `;
          await axios.post("/api/send_email", {
            senderEmail: "gidzunipath@gmail.com",
            recipientEmail: applicant.email,
            subject: "Greetings from Gidz Uni Path",
            template: emailTemp,
          });

          // Update local state with the newly updated applicant
          setApplicant(updatedData);
          setShowPasswordModal(false);
          await fetchApplicant(applicant.id);
          setConfirmation({ ...confirmation, isOpen: false });
          setNotification({
            isOpen: true,
            title: "Success",
            message: "User created with a new password!",
            type: "success",
          });
        } catch (error) {
          console.error(error);

          setNotification({
            isOpen: true,
            title: "Error",
            message: "Error creating user in Supabase Auth or saving to DB.",
            type: "error",
          });
        }
      },
    });
  };

  // -------------------------------------------
  //  Save individual field changes
  // -------------------------------------------
  const handleFieldSave = async (field, value) => {
    // Confirmation before saving
    setConfirmation({
      isOpen: true,
      title: `Confirm Update`,
      message: `Are you sure you want to update ${field.replace(/_/g, " ")}?`,
      onConfirm: async () => {
        try {
          const updateData = { [field]: value };
          const { data: updatedData, error } = await supabase
            .from("applications")
            .update(updateData)
            .eq("id", applicant.id)
            .single();

          if (error) throw error;

          await fetchApplicant(applicant.id);
          setConfirmation({ ...confirmation, isOpen: false });
          setNotification({
            isOpen: true,
            title: "Success",
            message: `${field.replace(/_/g, " ")} updated successfully!`,
            type: "success",
          });
        } catch (error) {
          console.error(error);
          setConfirmation({ ...confirmation, isOpen: false });
          setNotification({
            isOpen: true,
            title: "Error",
            message: `Error updating ${field.replace(/_/g, " ")}.`,
            type: "error",
          });
        }
      },
    });
  };

  // -------------------------------------------
  //  Handle Lock
  // -------------------------------------------

  const handleLock = async () => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ lock_1: !lockstate })
        .eq("id", applicant.id);

      if (error) throw error;
      setlockstate(!lockstate);
    } catch (error) {
      console.error("Error updating lock status:", error.message);
      setNotification({
        isOpen: true,
        title: "Error",
        message: error.message,
        type: "error",
      });
    }
  };
  // -------------------------------------------
  //  Applicant Payments Handlers
  // -------------------------------------------

  const handlePaymentSave = (paymentNumber, value) => {
    // Determine the correct field based on payment number
    const field = paymentNumber === 1 ? "payment1" : `payment${paymentNumber}`;

    // Confirmation before saving
    setConfirmation({
      isOpen: true,
      title: `Confirm Update`,
      message: `Are you sure you want to update Payment ${paymentNumber} Status?`,
      onConfirm: async () => {
        try {
          const updateData = { [field]: value };

          const { data: updatedData, error } = await supabase
            .from("applications")
            .update(updateData)
            .eq("id", applicant.id)
            .single();

          if (error) throw error;

          setApplicant(updatedData);
          await fetchApplicant(applicant.id);
          setConfirmation({ ...confirmation, isOpen: false });
          setNotification({
            isOpen: true,
            title: "Success",
            message: `Payment ${paymentNumber} Status updated successfully!`,
            type: "success",
          });
        } catch (error) {
          console.error(error);
          setConfirmation({ ...confirmation, isOpen: false });
          setNotification({
            isOpen: true,
            title: "Error",
            message: `Error updating Payment ${paymentNumber} Status.`,
            type: "error",
          });
        }
      },
    });
  };

  // -------------------------------------------
  //  Helper function to get document URL
  // -------------------------------------------
  function getDocumentUrl(documents, documentName) {
    // Find the document with the matching name
    const document = documents.find((doc) => doc.name === documentName);

    // Return the URL if the document is found, otherwise return the default image URL
    return document?.url || "/logo.png"; // Replace with your default image path
  }

  // -------------------------------------------
  //  Return early if data is not loaded
  // -------------------------------------------
  if (!applicant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading applicant data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------
  //  RENDER
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Top spacing for navbar */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section - More compact and organized */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="mdi:account-details"
                      className="text-2xl text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                      {applicant.first_name} {applicant.last_name}
                    </h1>
                    <p className="text-gray-600 text-sm mb-3">
                      Application ID: {applicant.id}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <Icon icon="mdi:email" className="inline mr-1" />
                        {applicant.email}
                      </div>
                      <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <Icon icon="mdi:phone" className="inline mr-1" />
                        {applicant.telephone || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm font-medium"
                  onClick={handleOpenPasswordModal}
                >
                  <Icon icon="mdi:key-plus" className="text-lg" />
                  Create Password
                </button>
                <button
                  className={`px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm font-medium ${
                    lockstate
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  }`}
                  onClick={handleLock}
                >
                  <Icon
                    icon={
                      lockstate ? "solar:lock-bold" : "solar:lock-unlocked-bold"
                    }
                    className="text-lg"
                  />
                  {lockstate ? "Visa Locked" : "Visa Unlocked"}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:account" className="text-lg text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <EditableField
                      label="First Name"
                      value={applicant.first_name}
                      onSave={(value) => handleFieldSave("first_name", value)}
                    />
                    <EditableField
                      label="Last Name"
                      value={applicant.last_name}
                      onSave={(value) => handleFieldSave("last_name", value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <EditableField
                      label="Date of Birth"
                      value={applicant.date_of_birth}
                      type="date"
                      onSave={(value) =>
                        handleFieldSave("date_of_birth", value)
                      }
                    />
                    <EditableField
                      label="Passport Number"
                      value={applicant.passport_number}
                      onSave={(value) =>
                        handleFieldSave("passport_number", value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <EditableField
                      label="Telephone"
                      value={applicant.telephone}
                      onSave={(value) => handleFieldSave("telephone", value)}
                    />
                    <EditableField
                      label="Email"
                      value={applicant.email}
                      type="email"
                      onSave={(value) => handleFieldSave("email", value)}
                    />
                  </div>
                  <EditableField
                    label="Address"
                    value={applicant.address}
                    onSave={(value) => handleFieldSave("address", value)}
                  />
                  {applicant.password && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Password
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 font-medium flex-1">
                          {showPassword ? applicant.password : "••••••••"}
                        </span>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <Icon
                            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                            className="text-lg"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Picture Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:camera" className="text-lg text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Profile Picture
                  </h2>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Image
                      src={getDocumentUrl(
                        applicant.documents,
                        "Profile Picture"
                      )}
                      alt="profile"
                      width={120}
                      height={120}
                      className="w-30 h-30 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Icon icon="mdi:camera" className="text-white text-xs" />
                    </div>
                  </div>
                  <ProfilePic applicationId={id} />
                </div>
              </div>

              {/* Educational Background Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:school" className="text-lg text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Educational Background
                  </h2>
                </div>
                <EditableField
                  label="Educational Background"
                  value={applicant.educational_background}
                  type="select"
                  options={EDUCATIONAL_BACKGROUNDS}
                  onSave={(value) =>
                    handleFieldSave("educational_background", value)
                  }
                />
              </div>

              {/* Payments Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="mdi:credit-card"
                      className="text-lg text-white"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payments</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          Payment 1
                        </h3>
                        <p className="text-sm text-gray-600">
                          Initial application payment
                        </p>
                      </div>
                      <YesNoButtonGroup
                        value={applicant.payment1}
                        onChange={(value) => handlePaymentSave(1, value)}
                      />
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          Payment 2
                        </h3>
                        <p className="text-sm text-gray-600">
                          Visa application payment
                        </p>
                      </div>
                      <YesNoButtonGroup
                        value={applicant.payment2}
                        onChange={(value) => handlePaymentSave(2, value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Documents Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="mdi:file-document-multiple"
                      className="text-lg text-white"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                </div>
                <div className="space-y-6">
                  <DocumentsTable applicationId={id} />
                  <div className="border-t border-gray-200 pt-6">
                    <DcoumentsFromUs applicationId={id} />
                  </div>
                </div>
              </div>

              {/* Universities Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="mdi:university"
                      className="text-lg text-white"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Universities
                  </h2>
                </div>
                <UniversitiesTable applicationId={id} />
              </div>
            </div>
          </div>

          {/* Bottom Section - Application Progress & Visa */}
          <div className="space-y-6">
            {/* Application Progress Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Icon icon="mdi:checklist" className="text-lg text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Application Progress
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <ApplicationOptions
                    applicationId={id}
                    optionsToCheck={[
                      { name: "CREATED UA ACCOUNT", option: false },
                      { name: "VISA APPOINTMENT", option: false },
                      { name: "APPLIED UNIVERSITY", option: false },
                      { name: "DORMS (OPTIONAL)", option: false },
                    ]}
                    title="Application Options"
                  />
                </div>
                <div>
                  <ApplicationOptions
                    applicationId={id}
                    optionsToCheck={[
                      { name: "ADMISSION/OFFER LETTER", option: false },
                    ]}
                    title="Admission Letter (8-10 weeks)"
                  />
                </div>
                <div>
                  <ApplicationOptions
                    applicationId={id}
                    optionsToCheck={[
                      { name: "ENROLMENT LETTER", option: false },
                    ]}
                    title="Semester Fees"
                  />
                </div>
              </div>
            </div>

            {/* Visa Application Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Icon icon="mdi:passport" className="text-lg text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Visa Application
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ApplicationOptions
                    applicationId={id}
                    optionsToCheck={[
                      { name: "APPLICATION FORM", option: false },
                      { name: "3 PASSPORT PHOTOS", option: false },
                      {
                        name: "PHOTOCOPY OF ALL PASSPORT PAGES",
                        option: false,
                      },
                      { name: "MOTIVATION LETTER", option: false },
                      { name: "CV", option: false },
                      { name: "O/L AND A/L CERTIFICATE", option: false },
                      {
                        name: "BACHELOR CERTIFICATE/ TRANSCRIPT ( MASTERS)",
                        option: false,
                      },
                      { name: "ADMISSION LETTER", option: false },
                    ]}
                    title="Required Documents (Part 1)"
                  />
                </div>
                <div>
                  <ApplicationOptions
                    applicationId={id}
                    optionsToCheck={[
                      { name: "ENROLMENT LETTER", option: false },
                      {
                        name: "LANGUAGE CERTIFICATE ( IELTS) / GERMAN",
                        option: false,
                      },
                      { name: "BLOCKED ACCOUNT/ SPONSOR", option: false },
                      { name: "PAYMENT OF SEMESTER FEES", option: false },
                      { name: "HEALTH INSURANCE", option: false },
                      { name: "TRAVEL HEALTH INSURANCE", option: false },
                      { name: "BIRTH CERTIFICATE ( ENGLISH)", option: false },
                      { name: "ACCOMMODATION", option: false },
                    ]}
                    title="Required Documents (Part 2)"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ApplicationOptions
                    applicationId={id}
                    optionsToCheck={[
                      { name: "TRAVEL INSURANCE", option: false },
                      { name: "FLIGHT TICKET ( DUMMY)", option: false },
                    ]}
                    title="Additional Requirements"
                  />
                  <ApplicationOptions
                    applicationId={id}
                    optionsToCheck={[
                      {
                        name: "INTERVIEW SECTION WITH GIDZ UNI PATH TEAM",
                        option: false,
                      },
                    ]}
                    title="Finalization"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Creation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon icon="mdi:key-plus" className="text-xl" />
                </div>
                <h2 className="text-xl font-semibold">Create New Password</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter or Generate Password
                </label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Type a password or generate one"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  onClick={generateRandomPassword}
                >
                  <Icon icon="mdi:auto-fix" className="inline mr-2" />
                  Generate
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                  onClick={handleConfirmNewPassword}
                >
                  <Icon icon="mdi:check" className="inline mr-2" />
                  Confirm
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
                  onClick={handleClosePasswordModal}
                >
                  <Icon icon="mdi:close" className="inline mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md mx-4 overflow-hidden">
            <div
              className={`p-6 text-white ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon
                    icon={
                      notification.type === "success"
                        ? "mdi:check-circle"
                        : "mdi:alert-circle"
                    }
                    className="text-xl"
                  />
                </div>
                <h2 className="text-xl font-semibold">{notification.title}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">{notification.message}</p>
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                onClick={() => {
                  fetchApplicant(applicant.id);
                  setNotification({ ...notification, isOpen: false });
                }}
              >
                <Icon icon="mdi:close" className="inline mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon icon="mdi:help-circle" className="text-xl" />
                </div>
                <h2 className="text-xl font-semibold">{confirmation.title}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">{confirmation.message}</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  onClick={() =>
                    setConfirmation({ ...confirmation, isOpen: false })
                  }
                >
                  <Icon icon="mdi:close" className="inline mr-2" />
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                  onClick={confirmation.onConfirm}
                >
                  <Icon icon="mdi:check" className="inline mr-2" />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDetail;
