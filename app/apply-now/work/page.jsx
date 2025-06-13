"use client";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    bachelorOrMasterDegreeCertificate: null,
    vocationalTrainingCertificates: null,
    cv: null,
    germanLanguageLevel: "",
    englishLanguageLevel: "",
    yearsOfProfessionalExperience: "",
    previousStayInGermany: "",
    applyingWithSpouse: false,
    blockedAccount: false,
    aboutYouAndYourNeeds: "",
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required.";
    if (!formData.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    // if (!formData.germanLanguageLevel)
    //   newErrors.germanLanguageLevel = "Select your German language level.";
    // if (!formData.englishLanguageLevel)
    //   newErrors.englishLanguageLevel = "Select your English language level.";
    // if (!formData.yearsOfProfessionalExperience) {
    //   newErrors.yearsOfProfessionalExperience =
    //     "Enter your professional experience.";
    // }
    // if (!formData.previousStayInGermany)
    //   newErrors.previousStayInGermany = "This field is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const handleFileOpen = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const uploadFileToStorage = async (file, fileName) => {
    const { data, error } = await supabase.storage
      .from("work_visa_files")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("work_visa_files")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const MessageModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
          <p className="text-lg font-semibold mb-4">{message}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    );
  };
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) 
    {
      
      setModalMessage("Please fill the required field in the form.");
      setIsModalOpen(true);
      return;
    }
      setUploading(true);
      try {
        // Upload files to Supabase Storage and get public URLs
        const bachelorOrMasterDegreeCertificateUrl =
          formData.bachelorOrMasterDegreeCertificate
            ? await uploadFileToStorage(
                formData.bachelorOrMasterDegreeCertificate,
                `bachelorOrMasterDegreeCertificate_${Date.now()}`
              )
            : null;

        const vocationalTrainingCertificatesUrl =
          formData.vocationalTrainingCertificates
            ? await uploadFileToStorage(
                formData.vocationalTrainingCertificates,
                `vocationalTrainingCertificates_${Date.now()}`
              )
            : null;

        const cvUrl = formData.cv
          ? await uploadFileToStorage(formData.cv, `cv_${Date.now()}`)
          : null;

        // Convert form data to JSON
        const formDataToStore = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          germanLanguageLevel: formData.germanLanguageLevel,
          englishLanguageLevel: formData.englishLanguageLevel,
          yearsOfProfessionalExperience: formData.yearsOfProfessionalExperience,
          experienceTimeline: formData.experienceTimeline,
          previousStayInGermany: formData.previousStayInGermany,
          applyingWithSpouse: formData.applyingWithSpouse,
          blockedAccount: formData.blockedAccount,
          aboutYouAndYourNeeds: formData.aboutYouAndYourNeeds,
          bachelorOrMasterDegreeCertificate:
            bachelorOrMasterDegreeCertificateUrl,
          vocationalTrainingCertificates: vocationalTrainingCertificatesUrl,
          cv: cvUrl,
        };

        // Insert into Supabase
        const formDataToStoreWithMark = {
          ...formDataToStore,
          MarkasRead: false, // Add the MarkasRead field
        };
        
        const { data, error } = await supabase
          .from("work_visa")
          .insert([{ data: JSON.stringify(formDataToStoreWithMark) }]);

        if (error) {
          console.error("Error inserting into Supabase:", error);
         
          setModalMessage("Error submitting form. Please try again.");
          setIsModalOpen(true);
          return;
        }

        console.log("Form Data Stored in Supabase:", data);
        
        setModalMessage("Form submitted successfully!");
          setIsModalOpen(true);
        
      } catch (error) {
        console.error("Unexpected Error:", error);
        setModalMessage("Unexpected Error occur");
          setIsModalOpen(true);
      } finally {
        setUploading(false);
      }
    
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-8 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-xl p-3 md:p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Application Form
        </h1>
        <div className="mx-auto p-6 my-8">
          <p className="text-center text-gray-600 mt-2">
            Welcome to{" "}
            <span className="font-bold text-blue-600">Gidz Uni Path!</span>
          </p>
          <p className="text-center text-gray-500 text-sm">
            Fill out this form if you want to work abroad. We will contact you
            via <span className="font-medium">Call, Email,</span> or{" "}
            <span className="font-medium">WhatsApp</span>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { name: "firstName", label: "First Name *" },
                { name: "lastName", label: "Last Name *" },
                { name: "dateOfBirth", label: "Date of Birth *" },
                { name: "mobileNumber", label: "Mobile Number *" },
                { name: "email", label: "Email *" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label
                    className="block text-sm font-medium text-gray-600"
                    htmlFor={name}
                  >
                    {label}
                  </label>
                  <input
                    type={
                      name === "dateOfBirth"
                        ? "date"
                        : name === "mobileNumber"
                        ? "tel"
                        : "text"
                    }
                    name={name}
                    placeholder={
                      name !== "dateOfBirth"
                        ? `Enter your ${label.replace(/\*/g, "").toLowerCase()}`
                        : 'mm/dd/yyyy'
                    }
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 p-2"
                    min={name === "dateOfBirth" ? "1800-01-01" : undefined}
                    max={
                      name === "dateOfBirth"
                        ? new Date().toISOString().split("T")[0]
                        : undefined
                    }
                  
                  />
                  {!formData[name] && errors[name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Qualifications
            </h2>
            {[
              {
                name: "bachelorOrMasterDegreeCertificate",
                label: "Bachelor or Master Degree Certificate *",
              },
              {
                name: "vocationalTrainingCertificates",
                label: "Vocational Training Certificates",
              },
              { name: "cv", label: "CV *" },
            ].map(({ name, label }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  {label}
                </label>
                <div className="flex items-center space-x-4 mt-2">
                  <input
                    type="file"
                    name={name}
                    onChange={handleChange}
                    accept=".pdf"
                    className="hidden"
                    id={name}
                  />
                  <label
                    htmlFor={name}
                    className="flex-grow bg-gray-100 text-gray-600 border border-gray-300 rounded-lg shadow-sm py-2 px-4 text-center cursor-pointer hover:bg-gray-200"
                  >
                    {formData[name]?.name || "Upload PDF"}
                  </label>
                  {formData[name] && (
                    <button
                      type="button"
                      onClick={() => handleFileOpen(formData[name])}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Details */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Additional Details
            </h2>
            {[
              { name: "germanLanguageLevel", label: "German Language Level *" },
              {
                name: "englishLanguageLevel",
                label: "English Language Level *",
              },
              {
                name: "yearsOfProfessionalExperience",
                label: "Years of Professional Experience *",
              },
              {
                name: "previousStayInGermany",
                label: "Previous Stay in Germany *",
              },
              {
                name: "applyingWithSpouse",
                label:
                  "Applying together with spouse who has same qualification?",
              },
              {
                name: "blockedAccount",
                label: "Do you financially support ( Blocked Account ) ?",
              },
              {
                name: "aboutYouAndYourNeeds",
                label: "About You and Your Needs",
              },
            ].map(({ name, label }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  {label}
                </label>
                {name === "germanLanguageLevel" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 p-2"
                  >
                    <option value="">Select</option>
                    {["No German", "A1", "A2", "B1", "B2 or higher"].map(
                      (option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                ) : name === "englishLanguageLevel" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 p-2"
                  >
                    <option value="">Select</option>
                    {["Below C1", "C1 or higher/Native"].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : name === "yearsOfProfessionalExperience" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 p-2"
                  >
                    <option value="">Select</option>
                    {["Less than 2 years", "2-5 years", "5+ years"].map(
                      (option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                ) : name === "previousStayInGermany" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 p-2"
                  >
                    <option value="">Select</option>
                    {["None", "6+ months in last 5 years"].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : name === "applyingWithSpouse" ||
                  name === "blockedAccount" ? (
                  <div className="flex items-center">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={name}
                          value="Yes"
                          checked={formData[name] === "Yes"}
                          onChange={(e) => handleChange(e)}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={name}
                          value="No"
                          checked={formData[name] === "No"}
                          onChange={(e) => handleChange(e)}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">No</span>
                      </label>
                    </div>
                  </div>
                ) : name === "aboutYouAndYourNeeds" ? (
                  <textarea
                    name={name}
                    placeholder="Tell us about you and your needs"
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={`Enter ${label
                      .replace(/\*/g, "")
                      .toLowerCase()}`}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 p-2"
                  />
                )}
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white p-3 rounded-lg ${
              uploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
            disabled={uploading}
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
        <MessageModal
  isOpen={isModalOpen}
  message={modalMessage}
  onClose={() => setIsModalOpen(false)}
/>
      </div>
    </div>
  );
};

export default FormComponent;
