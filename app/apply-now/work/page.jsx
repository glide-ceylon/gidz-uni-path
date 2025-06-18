"use client";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  FaUserTie,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileUpload,
  FaCertificate,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaUsers,
  FaGlobe,
  FaBookOpen,
  FaAward,
  FaBriefcase,
  FaLanguage,
  FaGraduationCap,
  FaPassport,
  FaMoneyBillWave,
} from "react-icons/fa";

const WorkVisaApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [formData, setFormData] = useState({
    PersonalInformation: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
    },
    ContactInformation: {
      mobileNumber: "",
      email: "",
      currentAddress: "",
      country: "",
    },
    QualificationsAndExperience: {
      educationType: "",
      bachelorOrMasterDegreeCertificate: null,
      vocationalTrainingCertificates: null,
      cv: null,
      yearsOfProfessionalExperience: "",
      experienceTimeline: "",
      currentJobTitle: "",
      targetJobField: "",
    },
    LanguageSkills: {
      germanLanguageLevel: "",
      germanCertificate: null,
      englishLanguageLevel: "",
      englishCertificate: null,
      otherLanguages: [],
    },
    GermanyExperience: {
      previousStayInGermany: "",
      previousVisaType: "",
      stayDuration: "",
      reasonForPreviousStay: "",
    },
    ApplicationDetails: {
      applyingWithSpouse: false,
      spouseDetails: "",
      blockedAccount: false,
      aboutYouAndYourNeeds: "",
      preferredStartDate: "",
      targetSalaryRange: "",
    },
    FinancialProof: {
      CanEarnLivingInGermany: "",
      FinancialMeansType: "",
      BlockedAccountAmount: "",
      DeclarationOfCommitment: "",
      SponsorDetails: "",
      OtherFinancialMeans: "",
      FinancialDocuments: null,
    },
  });

  // Define form steps
  const steps = [
    {
      id: 0,
      title: "Personal Information",
      description: "Basic personal details",
      icon: FaUser,
      fields: ["PersonalInformation"],
    },
    {
      id: 1,
      title: "Contact Details",
      description: "How we can reach you",
      icon: FaPhone,
      fields: ["ContactInformation"],
    },
    {
      id: 2,
      title: "Qualifications & Experience",
      description: "Education and work background",
      icon: FaBriefcase,
      fields: ["QualificationsAndExperience"],
    },
    {
      id: 3,
      title: "Language Skills",
      description: "Language proficiency levels",
      icon: FaLanguage,
      fields: ["LanguageSkills"],
    },
    {
      id: 4,
      title: "Germany Experience",
      description: "Previous stays in Germany",
      icon: FaPassport,
      fields: ["GermanyExperience"],
    },
    {
      id: 5,
      title: "Financial Proof",
      description: "Financial independence documentation",
      icon: FaMoneyBillWave,
      fields: ["FinancialProof"],
    },
    {
      id: 6,
      title: "Application Details",
      description: "Additional information",
      icon: FaFileUpload,
      fields: ["ApplicationDetails"],
    },
  ];

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));

    // Clear error for this field
    const errorKey = section + "." + field;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Handle file upload
  const handleFileChange = (section, field, file) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: file,
      },
    }));
  };

  // Navigate between steps
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };
  // Validation
  const validate = () => {
    const newErrors = {};

    // Personal Information validation
    if (!formData.PersonalInformation.firstName) {
      newErrors["PersonalInformation.firstName"] = "First name is required.";
    }
    if (!formData.PersonalInformation.lastName) {
      newErrors["PersonalInformation.lastName"] = "Last name is required.";
    }
    if (!formData.PersonalInformation.dateOfBirth) {
      newErrors["PersonalInformation.dateOfBirth"] =
        "Date of birth is required.";
    }

    // Contact Information validation
    if (!formData.ContactInformation.mobileNumber) {
      newErrors["ContactInformation.mobileNumber"] =
        "Mobile number is required.";
    }
    if (!formData.ContactInformation.email) {
      newErrors["ContactInformation.email"] = "Email is required.";
    } else if (
      !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(formData.ContactInformation.email)
    ) {
      newErrors["ContactInformation.email"] = "Invalid email format.";
    }

    // Only validate other sections if they have been started/filled
    // This prevents validation errors for sections the user hasn't reached yet

    // Qualifications validation (only if education type is selected)
    if (
      formData.QualificationsAndExperience.educationType &&
      !formData.QualificationsAndExperience.yearsOfProfessionalExperience
    ) {
      newErrors["QualificationsAndExperience.yearsOfProfessionalExperience"] =
        "Years of professional experience is required.";
    }

    // Language Skills validation (only if German level is selected)
    if (
      formData.LanguageSkills.germanLanguageLevel &&
      formData.LanguageSkills.germanLanguageLevel !== "None" &&
      !formData.LanguageSkills.germanCertificate
    ) {
      // Optional: Only require certificate for certain levels
      // newErrors["LanguageSkills.germanCertificate"] = "German certificate is required.";
    }

    // Financial Proof validation (only if financial means type is selected)
    if (
      formData.FinancialProof.FinancialMeansType &&
      !formData.FinancialProof.CanEarnLivingInGermany
    ) {
      newErrors["FinancialProof.CanEarnLivingInGermany"] =
        "Please specify if you can earn living in Germany.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File upload helper
  const uploadFileToStorage = async (file, fileName) => {
    try {
      const { data, error } = await supabase.storage
        .from("work-applications")
        .upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("work-applications").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setModalMessage("Please fill the required fields in the form.");
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // Upload files to Supabase Storage
      const bachelorOrMasterDegreeCertificateUrl = formData
        .QualificationsAndExperience.bachelorOrMasterDegreeCertificate
        ? await uploadFileToStorage(
            formData.QualificationsAndExperience
              .bachelorOrMasterDegreeCertificate,
            `degree_${Date.now()}`
          )
        : null;

      const vocationalTrainingCertificatesUrl = formData
        .QualificationsAndExperience.vocationalTrainingCertificates
        ? await uploadFileToStorage(
            formData.QualificationsAndExperience.vocationalTrainingCertificates,
            `vocational_${Date.now()}`
          )
        : null;

      const cvUrl = formData.QualificationsAndExperience.cv
        ? await uploadFileToStorage(
            formData.QualificationsAndExperience.cv,
            `cv_${Date.now()}`
          )
        : null;

      const germanCertificateUrl = formData.LanguageSkills.germanCertificate
        ? await uploadFileToStorage(
            formData.LanguageSkills.germanCertificate,
            `german_cert_${Date.now()}`
          )
        : null;

      const englishCertificateUrl = formData.LanguageSkills.englishCertificate
        ? await uploadFileToStorage(
            formData.LanguageSkills.englishCertificate,
            `english_cert_${Date.now()}`
          )
        : null;

      // Prepare data for database
      const applicationData = {
        ...formData.PersonalInformation,
        ...formData.ContactInformation,
        ...formData.QualificationsAndExperience,
        ...formData.LanguageSkills,
        ...formData.GermanyExperience,
        ...formData.ApplicationDetails,
        bachelorOrMasterDegreeCertificateUrl,
        vocationalTrainingCertificatesUrl,
        cvUrl,
        germanCertificateUrl,
        englishCertificateUrl,
        applicationDate: new Date().toISOString(),
      };

      // Remove file objects from data
      delete applicationData.bachelorOrMasterDegreeCertificate;
      delete applicationData.vocationalTrainingCertificates;
      delete applicationData.cv;
      delete applicationData.germanCertificate;
      delete applicationData.englishCertificate;

      const { data, error } = await supabase
        .from("work_applications")
        .insert([applicationData]);

      if (error) throw error;

      setModalMessage(
        "Application submitted successfully! We will contact you soon."
      );
      setIsModalOpen(true);

      // Reset form
      setCurrentStep(0);
    } catch (error) {
      console.error("Error submitting application:", error);
      setModalMessage("Error submitting application. Please try again.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-appleGray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-sky-400/10 rounded-full animate-float"></div>
      <div
        className="absolute top-64 right-16 w-16 h-16 bg-sky-500/15 rounded-2xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-96 left-20 w-12 h-12 bg-sky-600/20 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-80 right-32 w-8 h-8 bg-sky-400/25 rounded-full animate-float"
        style={{ animationDelay: "3s" }}
      ></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-appleGray-50 via-white to-appleGray-100 pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-sky-600/5"></div>

        <div className="container-apple text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft">
            <FaUserTie className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-appleGray-900 mb-6">
            Work Visa
            <span className="block text-gradient bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Application
            </span>
          </h1>
          <p className="text-xl text-appleGray-600 max-w-2xl mx-auto mb-8">
            Start your career journey abroad. Complete your work visa
            application in simple steps.
          </p>{" "}
          {/* Progress indicator */}
          <div className="max-w-4xl mx-auto mb-2">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      index <= currentStep
                        ? "bg-sky-500 text-white shadow-lg"
                        : "bg-appleGray-200 text-appleGray-400"
                    }`}
                    onClick={() => goToStep(index)}
                    title={step.title}
                  >
                    {index < currentStep ? (
                      <FaCheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 w-16 lg:w-24 mx-2 transition-all duration-300 ${
                        index < currentStep ? "bg-sky-500" : "bg-appleGray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 relative">
        <div className="container-apple">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-large p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-sky-600/10 rounded-full -translate-y-16 translate-x-16"></div>

              <form onSubmit={handleSubmit}>
                {/* Step Content */}
                <div className="min-h-[500px]">{renderStepContent()}</div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-appleGray-100">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      currentStep === 0
                        ? "bg-appleGray-100 text-appleGray-400 cursor-not-allowed"
                        : "bg-appleGray-200 text-appleGray-700 hover:bg-appleGray-300 btn-apple-hover"
                    }`}
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="text-sm text-appleGray-500">
                    Step {currentStep + 1} of {steps.length}
                  </div>

                  {currentStep === steps.length - 1 ? (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 btn-apple-hover shadow-soft"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <FaCheckCircle className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 btn-apple-hover shadow-soft"
                    >
                      <span>Next</span>
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gradient-to-br from-sky-500/5 to-sky-600/5 relative">
        <div className="container-apple text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-appleGray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-appleGray-600 mb-8">
              Our team is here to assist you with your work visa application
              process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+94701234567"
                className="flex items-center justify-center space-x-2 bg-white text-sky-600 px-6 py-3 rounded-2xl font-semibold hover:bg-appleGray-50 transition-all duration-300 btn-apple-hover shadow-soft"
              >
                <FaPhone className="w-4 h-4" />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:info@gidzunipath.com"
                className="flex items-center justify-center space-x-2 bg-sky-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-sky-600 transition-all duration-300 btn-apple-hover shadow-soft"
              >
                <FaEnvelope className="w-4 h-4" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-large">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-sky-500" />
              </div>
              <p className="text-appleGray-800 mb-6">{modalMessage}</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render step content based on current step
  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return renderPersonalInformation();
      case 1:
        return renderContactInformation();
      case 2:
        return renderQualificationsAndExperience();
      case 3:
        return renderLanguageSkills();
      case 4:
        return renderGermanyExperience();
      case 5:
        return renderFinancialProof();
      case 6:
        return renderApplicationDetails();
      default:
        return null;
    }
  }

  function renderPersonalInformation() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaUser className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Personal Information
          </h3>
          <p className="text-appleGray-600">Tell us about yourself</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.PersonalInformation.firstName}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "firstName",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your first name"
              required
            />
            {errors["PersonalInformation.firstName"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["PersonalInformation.firstName"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.PersonalInformation.lastName}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "lastName",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your last name"
              required
            />
            {errors["PersonalInformation.lastName"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["PersonalInformation.lastName"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.PersonalInformation.dateOfBirth}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "dateOfBirth",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              max={new Date().toISOString().split("T")[0]}
              required
            />
            {errors["PersonalInformation.dateOfBirth"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["PersonalInformation.dateOfBirth"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Nationality
            </label>
            <input
              type="text"
              value={formData.PersonalInformation.nationality}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "nationality",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your nationality"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Passport Number
            </label>
            <input
              type="text"
              value={formData.PersonalInformation.passportNumber}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "passportNumber",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your passport number"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderContactInformation() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaPhone className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Contact Information
          </h3>
          <p className="text-appleGray-600">How can we reach you?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={formData.ContactInformation.mobileNumber}
              onChange={(e) =>
                handleInputChange(
                  "ContactInformation",
                  "mobileNumber",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your mobile number"
              required
            />
            {errors["ContactInformation.mobileNumber"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["ContactInformation.mobileNumber"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.ContactInformation.email}
              onChange={(e) =>
                handleInputChange("ContactInformation", "email", e.target.value)
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email address"
              required
            />
            {errors["ContactInformation.email"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["ContactInformation.email"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.ContactInformation.country}
              onChange={(e) =>
                handleInputChange(
                  "ContactInformation",
                  "country",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your country"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Current Address
            </label>
            <textarea
              value={formData.ContactInformation.currentAddress}
              onChange={(e) =>
                handleInputChange(
                  "ContactInformation",
                  "currentAddress",
                  e.target.value
                )
              }
              rows={3}
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your current address"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderQualificationsAndExperience() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaBriefcase className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Qualifications & Experience
          </h3>
          <p className="text-appleGray-600">
            Your education and work background
          </p>
        </div>{" "}
        {/* Document Uploads */}
        <div className="grid grid-cols-1 gap-6">
          {/* CV Upload - First */}
          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              1. CV (Resume) Upload
            </h4>

            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                CV/Resume *
              </label>
              <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-6 text-center hover:border-sky-500 transition-all duration-200">
                <FaFileUpload className="w-8 h-8 text-appleGray-400 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(
                      "QualificationsAndExperience",
                      "cv",
                      e.target.files[0]
                    )
                  }
                  className="hidden"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="cv-upload"
                  className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
                >
                  {formData.QualificationsAndExperience.cv?.name ||
                    "Upload CV/Resume"}
                </label>
                <p className="text-sm text-appleGray-500 mt-2">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Education Type Selection - Second */}
          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              2. Education Qualification Upload
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Select Your Education Type *
                </label>
                <select
                  value={formData.QualificationsAndExperience.educationType}
                  onChange={(e) =>
                    handleInputChange(
                      "QualificationsAndExperience",
                      "educationType",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Choose education type</option>
                  <option value="university">
                    University Bachelor or Masters
                  </option>
                  <option value="vocational">Vocational Training (NVQ)</option>
                </select>
              </div>

              {/* University Degree Upload */}
              {formData.QualificationsAndExperience.educationType ===
                "university" && (
                <div>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    Bachelor or Master Degree Certificate *
                  </label>
                  <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-6 text-center hover:border-sky-500 transition-all duration-200">
                    <FaFileUpload className="w-8 h-8 text-appleGray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          "QualificationsAndExperience",
                          "bachelorOrMasterDegreeCertificate",
                          e.target.files[0]
                        )
                      }
                      className="hidden"
                      id="degree-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="degree-upload"
                      className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
                    >
                      {formData.QualificationsAndExperience
                        .bachelorOrMasterDegreeCertificate?.name ||
                        "Upload Degree Certificate"}
                    </label>
                    <p className="text-sm text-appleGray-500 mt-2">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              )}

              {/* Vocational Training Upload */}
              {formData.QualificationsAndExperience.educationType ===
                "vocational" && (
                <div>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    Vocational Training (NVQ) Certificates *
                  </label>
                  <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-6 text-center hover:border-sky-500 transition-all duration-200">
                    <FaFileUpload className="w-8 h-8 text-appleGray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          "QualificationsAndExperience",
                          "vocationalTrainingCertificates",
                          e.target.files[0]
                        )
                      }
                      className="hidden"
                      id="vocational-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="vocational-upload"
                      className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
                    >
                      {formData.QualificationsAndExperience
                        .vocationalTrainingCertificates?.name ||
                        "Upload Vocational (NVQ) Certificates"}
                    </label>
                    <p className="text-sm text-appleGray-500 mt-2">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              Work Experience
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Years of Professional Experience
                </label>
                <select
                  value={
                    formData.QualificationsAndExperience
                      .yearsOfProfessionalExperience
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "QualificationsAndExperience",
                      "yearsOfProfessionalExperience",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Current Job Title
                </label>
                <input
                  type="text"
                  value={formData.QualificationsAndExperience.currentJobTitle}
                  onChange={(e) =>
                    handleInputChange(
                      "QualificationsAndExperience",
                      "currentJobTitle",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your current job title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Target Job Field in Germany
                </label>
                <input
                  type="text"
                  value={formData.QualificationsAndExperience.targetJobField}
                  onChange={(e) =>
                    handleInputChange(
                      "QualificationsAndExperience",
                      "targetJobField",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="What type of work do you want to do in Germany?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Experience Timeline
                </label>
                <textarea
                  value={
                    formData.QualificationsAndExperience.experienceTimeline
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "QualificationsAndExperience",
                      "experienceTimeline",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Briefly describe your work experience timeline..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderLanguageSkills() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaLanguage className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Language Skills
          </h3>
          <p className="text-appleGray-600">Your language proficiency levels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* German Language Skills */}
          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              German Language
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  German Language Level
                </label>
                <select
                  value={formData.LanguageSkills.germanLanguageLevel}
                  onChange={(e) =>
                    handleInputChange(
                      "LanguageSkills",
                      "germanLanguageLevel",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select level</option>
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                  <option value="Native">Native Speaker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  German Certificate (Optional)
                </label>
                <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-4 text-center hover:border-sky-500 transition-all duration-200">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(
                        "LanguageSkills",
                        "germanCertificate",
                        e.target.files[0]
                      )
                    }
                    className="hidden"
                    id="german-cert-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="german-cert-upload"
                    className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold text-sm"
                  >
                    {formData.LanguageSkills.germanCertificate?.name ||
                      "Upload German Certificate"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* English Language Skills */}
          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              English Language
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  English Language Level
                </label>
                <select
                  value={formData.LanguageSkills.englishLanguageLevel}
                  onChange={(e) =>
                    handleInputChange(
                      "LanguageSkills",
                      "englishLanguageLevel",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select level</option>
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                  <option value="Native">Native Speaker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  English Certificate (Optional)
                </label>
                <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-4 text-center hover:border-sky-500 transition-all duration-200">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(
                        "LanguageSkills",
                        "englishCertificate",
                        e.target.files[0]
                      )
                    }
                    className="hidden"
                    id="english-cert-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="english-cert-upload"
                    className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold text-sm"
                  >
                    {formData.LanguageSkills.englishCertificate?.name ||
                      "Upload English Certificate"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderGermanyExperience() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaPassport className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Germany Experience
          </h3>
          <p className="text-appleGray-600">
            Tell us about any previous stays in Germany
          </p>
        </div>

        <div className="bg-appleGray-50 p-6 rounded-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Have you been to Germany before?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 p-4 border border-appleGray-200 rounded-2xl hover:bg-appleGray-50 cursor-pointer transition-all duration-200"
                  >
                    <input
                      type="radio"
                      name="previousStayInGermany"
                      value={option}
                      checked={
                        formData.GermanyExperience.previousStayInGermany ===
                        option
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "GermanyExperience",
                          "previousStayInGermany",
                          e.target.value
                        )
                      }
                      className="w-4 h-4 text-sky-500 border-appleGray-300 focus:ring-sky-500"
                    />
                    <span className="text-appleGray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.GermanyExperience.previousStayInGermany === "Yes" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    Previous Visa Type
                  </label>
                  <select
                    value={formData.GermanyExperience.previousVisaType}
                    onChange={(e) =>
                      handleInputChange(
                        "GermanyExperience",
                        "previousVisaType",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select visa type</option>
                    <option value="Tourist">Tourist Visa</option>
                    <option value="Student">Student Visa</option>
                    <option value="Work">Work Visa</option>
                    <option value="Business">Business Visa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    Duration of Stay
                  </label>
                  <input
                    type="text"
                    value={formData.GermanyExperience.stayDuration}
                    onChange={(e) =>
                      handleInputChange(
                        "GermanyExperience",
                        "stayDuration",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 3 months, 1 year"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    Reason for Previous Stay
                  </label>
                  <textarea
                    value={formData.GermanyExperience.reasonForPreviousStay}
                    onChange={(e) =>
                      handleInputChange(
                        "GermanyExperience",
                        "reasonForPreviousStay",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    placeholder="Briefly describe the reason for your previous stay..."
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderApplicationDetails() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaFileUpload className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Application Details
          </h3>
          <p className="text-appleGray-600">
            Additional information for your application
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Preferred Start Date
              </label>
              <input
                type="date"
                value={formData.ApplicationDetails.preferredStartDate}
                onChange={(e) =>
                  handleInputChange(
                    "ApplicationDetails",
                    "preferredStartDate",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Target Salary Range (EUR per year)
              </label>
              <select
                value={formData.ApplicationDetails.targetSalaryRange}
                onChange={(e) =>
                  handleInputChange(
                    "ApplicationDetails",
                    "targetSalaryRange",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select salary range</option>
                <option value="30000-40000">€30,000 - €40,000</option>
                <option value="40000-50000">€40,000 - €50,000</option>
                <option value="50000-60000">€50,000 - €60,000</option>
                <option value="60000-70000">€60,000 - €70,000</option>
                <option value="70000+">€70,000+</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border border-appleGray-200 rounded-2xl hover:bg-appleGray-50 cursor-pointer transition-all duration-200">
              <input
                type="checkbox"
                id="applyingWithSpouse"
                checked={formData.ApplicationDetails.applyingWithSpouse}
                onChange={(e) =>
                  handleInputChange(
                    "ApplicationDetails",
                    "applyingWithSpouse",
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-sky-500 border-appleGray-300 rounded focus:ring-sky-500"
              />
              <label
                htmlFor="applyingWithSpouse"
                className="text-sm font-semibold text-appleGray-700"
              >
                I am applying with my spouse/partner
              </label>
            </div>

            {formData.ApplicationDetails.applyingWithSpouse && (
              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Spouse/Partner Details
                </label>
                <textarea
                  value={formData.ApplicationDetails.spouseDetails}
                  onChange={(e) =>
                    handleInputChange(
                      "ApplicationDetails",
                      "spouseDetails",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Please provide details about your spouse/partner..."
                />
              </div>
            )}

            <div className="flex items-center space-x-3 p-4 border border-appleGray-200 rounded-2xl hover:bg-appleGray-50 cursor-pointer transition-all duration-200">
              <input
                type="checkbox"
                id="blockedAccount"
                checked={formData.ApplicationDetails.blockedAccount}
                onChange={(e) =>
                  handleInputChange(
                    "ApplicationDetails",
                    "blockedAccount",
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-sky-500 border-appleGray-300 rounded focus:ring-sky-500"
              />
              <label
                htmlFor="blockedAccount"
                className="text-sm font-semibold text-appleGray-700"
              >
                I have or plan to open a blocked account (Sperrkonto)
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              About You and Your Needs
            </label>
            <textarea
              value={formData.ApplicationDetails.aboutYouAndYourNeeds}
              onChange={(e) =>
                handleInputChange(
                  "ApplicationDetails",
                  "aboutYouAndYourNeeds",
                  e.target.value
                )
              }
              rows={6}
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Tell us about yourself, your career goals, and what kind of support you need for your work visa application..."
            />
            <p className="text-sm text-appleGray-500 mt-2">
              This helps us provide you with the best possible assistance
            </p>
          </div>{" "}
        </div>
      </div>
    );
  }

  function renderFinancialProof() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaMoneyBillWave className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Financial Proof
          </h3>
          <p className="text-appleGray-600">
            Prove your financial independence for working in Germany
          </p>
        </div>

        {/* Can You Earn a Living in Germany */}
        <div className="bg-appleGray-50 p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
            Can you earn a living in Germany?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 p-4 border border-appleGray-200 rounded-2xl hover:bg-appleGray-50 cursor-pointer transition-all duration-200"
              >
                <input
                  type="radio"
                  name="canEarnLivingWork"
                  value={option}
                  checked={
                    formData.FinancialProof.CanEarnLivingInGermany === option
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "FinancialProof",
                      "CanEarnLivingInGermany",
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-sky-500 border-appleGray-300 focus:ring-sky-500"
                />
                <span className="text-appleGray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Financial Means Type */}
        <div className="bg-appleGray-50 p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
            Type of Financial Means
          </h4>
          <p className="text-sm text-appleGray-600 mb-4">
            Your financial independence is a basic prerequisite for receiving
            the work visa. You can prove your financial independence with the
            help of a blocked account, employment contract, or a Declaration of
            Commitment, among other things.
          </p>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Select your financial means type *
            </label>
            <select
              value={formData.FinancialProof.FinancialMeansType}
              onChange={(e) =>
                handleInputChange(
                  "FinancialProof",
                  "FinancialMeansType",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Choose financial means type</option>
              <option value="employment-contract">Employment Contract</option>
              <option value="blocked-account">Blocked Account</option>
              <option value="declaration-commitment">
                Declaration of Commitment
              </option>
              <option value="personal-savings">Personal Savings</option>
              <option value="sponsor">Family/Personal Sponsor</option>
              <option value="other">Other Financial Means</option>
            </select>
          </div>

          {/* Blocked Account Details */}
          {formData.FinancialProof.FinancialMeansType === "blocked-account" && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Blocked Account Amount (in EUR) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.FinancialProof.BlockedAccountAmount}
                onChange={(e) =>
                  handleInputChange(
                    "FinancialProof",
                    "BlockedAccountAmount",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 12,000 (recommended minimum for work visa)"
              />
              <p className="text-sm text-appleGray-500 mt-2">
                Recommended minimum €12,000 for work visa applications
              </p>
            </div>
          )}

          {/* Declaration of Commitment Details */}
          {formData.FinancialProof.FinancialMeansType ===
            "declaration-commitment" && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Declaration of Commitment Details *
              </label>
              <textarea
                value={formData.FinancialProof.DeclarationOfCommitment}
                onChange={(e) =>
                  handleInputChange(
                    "FinancialProof",
                    "DeclarationOfCommitment",
                    e.target.value
                  )
                }
                rows={3}
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Provide details about the declaration of commitment..."
              />
            </div>
          )}

          {/* Sponsor Details */}
          {formData.FinancialProof.FinancialMeansType === "sponsor" && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Sponsor Details *
              </label>
              <textarea
                value={formData.FinancialProof.SponsorDetails}
                onChange={(e) =>
                  handleInputChange(
                    "FinancialProof",
                    "SponsorDetails",
                    e.target.value
                  )
                }
                rows={3}
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Provide details about your sponsor (name, relationship, financial capacity)..."
              />
            </div>
          )}

          {/* Other Financial Means */}
          {formData.FinancialProof.FinancialMeansType === "other" && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Other Financial Means Details *
              </label>
              <textarea
                value={formData.FinancialProof.OtherFinancialMeans}
                onChange={(e) =>
                  handleInputChange(
                    "FinancialProof",
                    "OtherFinancialMeans",
                    e.target.value
                  )
                }
                rows={3}
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe your other financial means..."
              />
            </div>
          )}
        </div>

        {/* Financial Documents Upload */}
        <div className="bg-appleGray-50 p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
            Financial Documents Upload
          </h4>
          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Upload Financial Proof Documents *
            </label>
            <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-8 text-center hover:border-sky-500 transition-all duration-200">
              <FaFileUpload className="w-8 h-8 text-appleGray-400 mx-auto mb-4" />
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(
                    "FinancialProof",
                    "FinancialDocuments",
                    e.target.files[0]
                  )
                }
                className="hidden"
                id="financial-documents-work-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />
              <label
                htmlFor="financial-documents-work-upload"
                className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
              >
                {formData.FinancialProof.FinancialDocuments?.name ||
                  "Upload Financial Documents"}
              </label>
              <p className="text-sm text-appleGray-500 mt-2">
                PDF, JPG, PNG up to 10MB each
              </p>
              <p className="text-xs text-appleGray-400 mt-2">
                e.g., Bank statements, employment contract, blocked account
                confirmation, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default WorkVisaApplicationForm;
