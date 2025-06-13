"use client";

import React, { useEffect, useState } from "react";
import { Icon} from "@iconify/react";
import { supabase } from "../../../../lib/supabase";
import UniversitiesTable from "../../components/UniversitiesTable";
import DocumentsTable from "../../components/DocumentsTable";
import DcoumentsFromUs from "../../components/DocumentsFromUs";
import ApplicationOptions from "../../components/ApplicationOptoins";
import ProfilePic from "../../components/ProfilePic";
import axios from "axios";

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
    <div className="flex space-x-2">
      <button
        type="button"
        className={`px-3 py-1 rounded ${
          value ? "bg-green-500 text-white" : "bg-gray-300"
        }`}
        onClick={() => onChange(true)}
      >
        Yes
      </button>
      <button
        type="button"
        className={`px-3 py-1 rounded ${
          !value ? "bg-red-500 text-white" : "bg-gray-300"
        }`}
        onClick={() => onChange(false)}
      >
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
    <div className="flex items-center justify-between">
      <div className="w-full">
        <label className="font-semibold">{label}:</label>{" "}
        {!isEditing ? (
          <span>{value || "N/A"}</span>
        ) : type === "select" ? (
          <select
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border rounded mt-1"
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
            className="w-full p-2 border rounded mt-1"
          />
        ) : (
          <input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        )}
      </div>
      <div className="flex items-center space-x-2 ml-4">
        {!isEditing ? (
          <Icon
            icon="mdi:pencil"
            className="cursor-pointer text-xl text-blue-500"
            onClick={() => setIsEditing(true)}
          />
        ) : (
          <>
            <Icon
              icon="mdi:content-save"
              className="cursor-pointer text-xl text-green-500"
              onClick={handleSave}
            />
            <Icon
              icon="mdi:cancel"
              className="cursor-pointer text-xl text-red-500"
              onClick={handleCancel}
            />
          </>
        )}
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
  const[lockstate,setlockstate]=useState(false);

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

  const handleLock =async() => {
    try{
      const { error } = await supabase
      .from("applications")
      .update({ lock_1: !lockstate })
      .eq("id", applicant.id);

      if(error) throw error;
      setlockstate(!lockstate);
    
    }
    catch(error){
      console.error("Error updating lock status:", error.message);
      setNotification({
        isOpen: true,
        title: "Error",
        message: error.message,
        type: "error",
      });
    } 


  }
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
    return <div className="p-6 text-center">Loading applicant data...</div>;
  }

  // -------------------------------------------
  //  RENDER
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Applicant Details</h1>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleOpenPasswordModal}
          >
            Create New Password
          </button>
        </div>

        {/* Personal Information */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
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

            {/* DOB */}
            <EditableField
              label="Date of Birth"
              value={applicant.date_of_birth}
              type="date"
              onSave={(value) => handleFieldSave("date_of_birth", value)}
            />

            {/* Passport Number */}
            <EditableField
              label="Passport Number"
              value={applicant.passport_number}
              onSave={(value) => handleFieldSave("passport_number", value)}
            />

            {/* Telephone */}
            <EditableField
              label="Telephone"
              value={applicant.telephone}
              onSave={(value) => handleFieldSave("telephone", value)}
            />
            {/* Address */}
            <EditableField
              label="Address"
              value={applicant.address}
              onSave={(value) => handleFieldSave("address", value)}
            />
            {/* Email */}
            <EditableField
              label="Email"
              value={applicant.email}
              type="email"
              onSave={(value) => handleFieldSave("email", value)}
            />

            {/* Password (Show/Hide) */}
            {applicant.password && (
              <div className="sm:col-span-2 flex items-center space-x-2">
                <label className="font-semibold">Password:</label>
                <span>{showPassword ? applicant.password : "••••••••"}</span>
                <Icon
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            )}
          </div>
        </section>
        <hr className="my-3" />
        <div className="flex flex-col items-start justify-center">
          <h4 className="text-2xl font-semibold mb-4">Profile Picture</h4>
          <img
            src={getDocumentUrl(applicant.documents, "Profile Picture")}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <ProfilePic applicationId={id} />
        <hr className="my-3" />

        {/* Educational Background */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Educational Background
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Education */}
            <EditableField
              label="Background"
              value={applicant.educational_background}
              type="select"
              options={EDUCATIONAL_BACKGROUNDS}
              onSave={(value) =>
                handleFieldSave("educational_background", value)
              }
            />
          </div>
        </section>
        <hr className="my-3" />

        {/* Applicant Payments */}
        <section className="mb-6">
          <DocumentsTable applicationId={id} />
          <hr className="my-3" />

          <DcoumentsFromUs applicationId={id} />
          <hr className="my-3" />

          <h2 className="text-2xl font-semibold mb-4">Applicant Payments</h2>
          <div className="space-y-4">
            {/* Payment 1 */}
            <div className="p-4 border rounded">
              <h3 className="text-xl font-semibold mb-2">Payment 1</h3>
              <div className="space-y-2">
                {/* Payment 1 Status */}
                <div className="flex items-center justify-between">
                  <label className="font-semibold">Payment 1 Status:</label>
                  <YesNoButtonGroup
                    value={applicant.payment1}
                    onChange={(value) => handlePaymentSave(1, value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr className="my-3" />

        <section className="mb-6">
          <UniversitiesTable applicationId={id} />
        </section>
        <hr className="my-3" />

        <section className="mb-6">
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
          <hr className="my-3" />

          <ApplicationOptions
            applicationId={id}
            optionsToCheck={[{ name: "ADMISSION/OFFER LETTER", option: false }]}
            title="IT TAKES 8 - 10 weeks to receive admission letter"
          />
          <hr className="my-3" />

          <ApplicationOptions
            applicationId={id}
            optionsToCheck={[{ name: "ENROLMENT LETTER", option: false }]}
            title="First Semester Fees for the University"
          />
        </section>
        <hr className="my-3" />

        <section className="mb-6">
        <div className="flex items-center gap-4">
  <h2 className="text-2xl font-semibold mb-4">VISA APPLICATION</h2>
  <button className="px-4 py-2  text-white rounded hover:bg-blue-600 transition" onClick={handleLock}>
  <Icon
          icon={lockstate ? "solar:lock-bold" : "solar:lock-unlocked-bold"} // Render lock or unlock based on state
          width="32"
          color="#FF8A65"
        />
  </button>
</div>
          
          <div className="space-y-4">
            {/* Payment 2 */}
            <div className="p-4 border rounded">
              <h3 className="text-xl font-semibold mb-2">Payment 2</h3>
              <div className="space-y-2">
                {/* Payment 2 Status */}
                <div className="flex items-center justify-between">
                  <label className="font-semibold">Payment 2 Status:</label>
                  <YesNoButtonGroup
                    value={applicant.payment2}
                    onChange={(value) => handlePaymentSave(2, value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <ApplicationOptions
            applicationId={id}
            optionsToCheck={[
              { name: "APPLICATION FORM", option: false },
              { name: "3 PASSPORT PHOTOS", option: false },
              { name: "PHOTOCOPY OF ALL PASSPORT PAGES", option: false },
              { name: "MOTIVATION LETTER", option: false },
              { name: "CV", option: false },
              { name: "O/L AND A/L CERTIFICATE", option: false },
              {
                name: "BACHELOR CERTIFICATE/ TRANSCRIPT ( MASTERS)",
                option: false,
              },
              { name: "ADMISSION LETTER", option: false },
              { name: "ENROLMENT LETTER", option: false },
              { name: "LANGUAGE CERTIFICATE ( IELTS) / GERMAN", option: false },
              { name: "BLOCKED ACCOUNT/ SPONSOR", option: false },
              { name: "PAYMENT OF SEMESTER FEES", option: false },
              { name: "HEALTH INSURANCE", option: false },
              { name: "TRAVEL HEALTH INSURANCE", option: false },
              { name: "BIRTH CERTIFICATE ( ENGLISH)", option: false },
              { name: "ACCOMMODATION", option: false },
            ]}
            title="DOCUMENTS FOR VISA APPLICATION"
          />

          <div className="pl-3">
            <ApplicationOptions
              applicationId={id}
              optionsToCheck={[
                { name: "TRAVEL INSURANCE", option: false },
                { name: "FLIGHT TICKET ( DUMMY)", option: false },
              ]}
              title=" "
            />
          </div>
          <hr className="my-3" />
          <ApplicationOptions
            applicationId={id}
            optionsToCheck={[
              {
                name: "INTERVIEW SECTION WITH GIDZ UNI PATH TEAM",
                option: false,
              },
            ]}
            title="FINALIZATION"
          />
        </section>
        <hr className="my-3" />
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-md relative">
            <h2 className="text-xl font-semibold mb-4">Create New Password</h2>
            <label className="block mb-2">Enter/Generate a Password:</label>
            <input
              type="text"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Type a password or generate"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-3 py-2 rounded"
                onClick={generateRandomPassword}
              >
                Suggest Password
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmNewPassword}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleClosePasswordModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================
          NOTIFICATION MODAL
         ============================== */}
      {notification.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-md relative">
            <div
              className={`w-4 h-4 rounded-full ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              } mb-4`}
            ></div>
            <h2 className="text-xl font-semibold mb-2">{notification.title}</h2>
            <p className="mb-4">{notification.message}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                fetchApplicant(applicant.id);
                setNotification({ ...notification, isOpen: false });
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ==============================
          CONFIRMATION MODAL
         ============================== */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-md relative">
            <h2 className="text-xl font-semibold mb-4">{confirmation.title}</h2>
            <p className="mb-6">{confirmation.message}</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() =>
                  setConfirmation({ ...confirmation, isOpen: false })
                }
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={confirmation.onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDetail;
