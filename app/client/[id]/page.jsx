"use client";

import React, { useEffect, useState } from "react";
import { Icon} from "@iconify/react";
import { supabase } from "../../../lib/supabase";
import Universities from "./components/Universities";
import DocumentsToDownload from "./components/DocumentsToDownload";
import DocumentsToUpload from "./components/DocumentsToUpload";
import VerticalStepper from "./components/VerticalStepper";
import ApplicationOptions from "./components/ApplicationOptions";
import Message from "./components/Message";
import AppointmentModal from "./components/AppointmentModal";

const ApplicantDetail = () => {
  const [applicant, setApplicant] = useState(null);
  const [id, setId] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCreateApointemen, setShowCreateApointement] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      setId(lastPart);
    }
  }, []);

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

        // Find and set profile picture if available
        const profileDoc = data.documents?.find(
          (doc) => doc.name === "Profile Picture"
        );
        if (profileDoc) {
          setProfilePicUrl(profileDoc.url);
        }
      }
    } catch (error) {
      console.error("Error fetching applicant:", error.message);
    }
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
        <div className="relative bg-white p-6 rounded-lg shadow-lg  w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            &#x2715;
          </button>
          {children}
        </div>
      </div>
    );
  };

  if (!applicant) {
    return <div className="p-6 text-center">Loading applicant data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5   ">
      {/* Button to open the Message modal */}

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

      <div className="flex flex-row gap-3 max-w-5xl mx-auto bg-white p-3 rounded-lg shadow-md">
        <button
          onClick={() => setShowMessageModal(true)}
          className="w-full px-6  py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all "
        >
          📩 Open Messages
        </button>

        <button
          onClick={() => setShowCreateApointement(true)}
          className="w-full px-6 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all"
        >
          📅 Create Appointment
        </button>
      </div>
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Client Portal</h1>
        </div>
        <hr />
        <div className="py-3">
          <VerticalStepper currentStep={applicant.status.slice(-1)} />
        </div>
        <hr className="my-4" />

        <section className="mb-6">
          <h2 className="text-2xl font-normal mb-4">
            <strong>
              Hi {applicant.first_name || "N/A"} {applicant.last_name || "N/A"}
            </strong>
          </h2>
          <hr />
          <h1 className="text-2xl font-bold my-4">Personal Information</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong>Date of Birth:</strong> {applicant.date_of_birth || "N/A"}
            </div>
            <div>
              <strong>Passport Number:</strong>{" "}
              {applicant.passport_number || "N/A"}
            </div>
            <div>
              <strong>Telephone:</strong> {applicant.telephone || "N/A"}
            </div>
            <div>
              <strong>Address:</strong> {applicant.address || "N/A"}
            </div>
            <div>
              <strong>Email:</strong> {applicant.email || "N/A"}
            </div>
          </div>
          <hr className="my-3" />

          <div className="mt-4">
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-2xl font-semibold mb-4">Profile Picture</h2>
              <img
                src={profilePicUrl || "/logo.png"}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            {!profilePicUrl && (
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                />
              </div>
            )}

            {uploading && (
              <div className="mt-2">
                <p>Uploading... {progress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </section>
        <hr className="my-3" />

        {/* Educational Background */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Educational Background
          </h2>
          <div>
            <strong>Background:</strong>{" "}
            {applicant.educational_background || "N/A"}
          </div>
        </section>
        <hr className="my-3" />
        <DocumentsToUpload applicationId={id} />
        <hr className="my-3" />
        <DocumentsToDownload applicationId={id} />
        <hr className="my-3" />

        {/* Applicant Payments */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Applicant Payments</h2>
          <div>
            <strong>Payment 1 Status:</strong>{" "}
            {applicant.payment1 ? "Yes" : "No"}
          </div>
        </section>

        <Universities applicationId={id} />

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
        <ApplicationOptions
          applicationId={id}
          optionsToCheck={[{ name: "ADMISSION/OFFER LETTER" }]}
          title="IT TAKES 8 - 10 weeks to receive admission letter"
        />
        <ApplicationOptions
          applicationId={id}
          optionsToCheck={[{ name: "ENROLMENT LETTER", option: false }]}
          title="First Semester Fees for the University"
        />
        <section className="mb-6">

            <div className="flex items-center">
            <h2 className="text-2xl font-semibold mb-4">VISA APPLICATION</h2>
            <Icon
                    icon={applicant.lock_1 ? "solar:lock-bold" : "solar:lock-unlocked-bold"} // Render lock or unlock based on state
                    width="32"
                    color="#FF8A65"
                  />
          </div>
        {!applicant.lock_1 && <div>
          <div>
            <strong>Payment 2 Status:</strong>{" "}
            {applicant.payment2 ? "Yes" : "No"}
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
          </div>
          </div>}
        </section>
      </div>
    </div>
  );
};

export default ApplicantDetail;
