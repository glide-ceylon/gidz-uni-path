"use client";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  FaGraduationCap,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaFileUpload,
  FaCertificate,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaMoneyBillWave,
} from "react-icons/fa";

const StudentApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState({});
  const subjectsList = [
    "Biology",
    "Physics",
    "Chemistry",
    "Combined Mathematics (Pure Mathematics and Applied Mathematics)",
    "Agricultural Science",
    "Economics",
    "Business Studies",
    "Accounting",
    "Political Science",
    "Geography",
    "History",
    "Logic and Scientific Method",
    "Literature (Sinhala, Tamil, English)",
    "Drama and Theatre",
    "Media Studies",
    "Information Technology",
    "Engineering Technology",
    "Biosystems Technology",
    "Science for Technology",
  ];

  // O-Level subjects list
  const oLevelSubjects = [
    // Compulsory Subjects
    "Sinhala Language",
    "Tamil Language",
    "English Language",
    "Mathematics",
    "Science",
    "Buddhism",
    "Hinduism",
    "Islam",
    "Christianity",
    "History",
    // Optional Subjects
    "Business & Accounting Studies",
    "Geography",
    "Civic Education",
    "Health & Physical Education",
    "Information & Communication Technology (ICT)",
    "Agricultural Science",
    "Eastern Music",
    "Western Music",
    "Carnatic Music",
    "Art",
    "Kandyan Dancing",
    "Bharatha Dancing",
    "Low Country Dancing",
    "Drama and Theatre (Sinhala)",
    "Drama and Theatre (Tamil)",
    "Drama and Theatre (English)",
    "Second Language (Tamil)",
    "Second Language (Sinhala)",
    "Apparel and Textiles",
    "Home Science",
    "Food & Nutrition",
    "Design & Technology",
    "Woodwork",
    "Metalwork",
    "Technical Drawing",
    "Arabic",
    "Pali",
    "Sanskrit",
    "French",
    "Japanese",
    "German",
    "Hindi",
    "Korean",
    "Chinese",
  ];

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const [formData, setFormData] = useState({
    PersonalInformation: {
      FirstName: "",
      LastName: "",
      Gender: "",
      DateOfBirth: "",
      UniversityType: [],
    },
    ContactInformation: {
      Email: "",
      MobileNo: "",
      Address: "",
      Country: "",
    },
    EducationalQualification: {
      OLevel: {
        IndexNumber: "",
        MediumOfExam: "",
        YearOfExam: "",
        SchoolName: "",
        SubjectResults: [
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
          { Subject: "", Grade: "" },
        ],
      },
      ALevel: {
        SubjectResults: [
          { Subject: "", Result: "" },
          { Subject: "", Result: "" },
          { Subject: "", Result: "" },
        ],
        GPA: {
          RequiredForMasters: false,
          Value: "",
        },
      },
      TranscriptOrAdditionalDocument: null,
    },
    IELTSResults: {
      ScoreOption: "",
      Reading: "",
      Writing: "",
      Listening: "",
      Speaking: "",
      Certificate: null,
    },
    CVUpload: {
      File: null,
    },
    WhenApplyingMaster: {
      BachelorsCertificate: "",
      Transcript: "",
    },
    AdditionalInformation: {
      ReferenceCode: "",
      Course: "",
      AcademicYear: "",
      AcademicTerm: "",
      CoursePreferences: [""],
      UniversityPreferences: [""],
      PersonalStatement: "",
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
      title: "Education",
      description: "Academic qualifications",
      icon: FaGraduationCap,
      fields: ["EducationalQualification"],
    },
    {
      id: 3,
      title: "English Proficiency",
      description: "IELTS scores and certificates",
      icon: FaCertificate,
      fields: ["IELTSResults"],
    },
    {
      id: 4,
      title: "Documents",
      description: "Upload required documents",
      icon: FaFileUpload,
      fields: ["CVUpload", "WhenApplyingMaster"],
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
      title: "Preferences",
      description: "Course and university choices",
      icon: FaBookOpen,
      fields: ["AdditionalInformation"],
    },
  ];

  // Handle input changes
  const handleInputChange = (section, field, value, index = null) => {
    setFormData((prevData) => {
      const newData = { ...prevData };

      if (index !== null) {
        // Handle array fields
        if (!newData[section][field]) {
          newData[section][field] = [];
        }
        newData[section][field][index] = value;
      } else if (field.includes(".")) {
        // Handle nested fields
        const fieldParts = field.split(".");
        let current = newData[section];
        for (let i = 0; i < fieldParts.length - 1; i++) {
          if (!current[fieldParts[i]]) {
            current[fieldParts[i]] = {};
          }
          current = current[fieldParts[i]];
        }
        current[fieldParts[fieldParts.length - 1]] = value;
      } else {
        // Handle regular fields
        newData[section][field] = value;
      }

      return newData;
    });

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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("student_applications")
        .insert([formData]);

      if (error) throw error;

      alert("Application submitted successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
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
      <section className="relative overflow-hidden bg-gradient-to-br from-appleGray-50 via-white to-appleGray-100 pt-24 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-sky-600/5"></div>

        <div className="container-apple text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft">
            <FaGraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-appleGray-900 mb-6">
            Student Visa
            <span className="block text-gradient bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Application
            </span>
          </h1>
          <p className="text-xl text-appleGray-600 max-w-2xl mx-auto mb-8">
            Start your journey to study abroad. Complete your application in
            simple steps.
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
              Our team is here to assist you with your application process.
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
      </section>{" "}
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
        return renderEducationalQualification();
      case 3:
        return renderIELTSResults();
      case 4:
        return renderDocuments();
      case 5:
        return renderFinancialProof();
      case 6:
        return renderAdditionalInformation();
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
              value={formData.PersonalInformation.FirstName}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "FirstName",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.PersonalInformation.LastName}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "LastName",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Gender *
            </label>
            <select
              value={formData.PersonalInformation.Gender}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "Gender",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.PersonalInformation.DateOfBirth}
              onChange={(e) =>
                handleInputChange(
                  "PersonalInformation",
                  "DateOfBirth",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-appleGray-700 mb-2">
            University Type Preference
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Public Universities",
              "Private Universities",
              "Research Universities",
              "Technical Universities",
            ].map((type) => (
              <label
                key={type}
                className="flex items-center space-x-3 p-4 border border-appleGray-200 rounded-2xl hover:bg-appleGray-50 cursor-pointer transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={formData.PersonalInformation.UniversityType.includes(
                    type
                  )}
                  onChange={(e) => {
                    const currentTypes =
                      formData.PersonalInformation.UniversityType;
                    if (e.target.checked) {
                      handleInputChange(
                        "PersonalInformation",
                        "UniversityType",
                        [...currentTypes, type]
                      );
                    } else {
                      handleInputChange(
                        "PersonalInformation",
                        "UniversityType",
                        currentTypes.filter((t) => t !== type)
                      );
                    }
                  }}
                  className="w-4 h-4 text-sky-500 border-appleGray-300 rounded focus:ring-sky-500"
                />
                <span className="text-appleGray-700">{type}</span>
              </label>
            ))}
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
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.ContactInformation.Email}
              onChange={(e) =>
                handleInputChange("ContactInformation", "Email", e.target.value)
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={formData.ContactInformation.MobileNo}
              onChange={(e) =>
                handleInputChange(
                  "ContactInformation",
                  "MobileNo",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Country *
            </label>
            <select
              value={formData.ContactInformation.Country}
              onChange={(e) =>
                handleInputChange(
                  "ContactInformation",
                  "Country",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Address *
            </label>
            <textarea
              value={formData.ContactInformation.Address}
              onChange={(e) =>
                handleInputChange(
                  "ContactInformation",
                  "Address",
                  e.target.value
                )
              }
              rows={3}
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full address"
              required
            />
          </div>
        </div>
      </div>
    );
  }
  function renderEducationalQualification() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaGraduationCap className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Educational Qualification
          </h3>
          <p className="text-appleGray-600">Your academic background</p>
        </div>

        {/* O-Level Results Section */}
        <div className="bg-appleGray-50 p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
            G.C.E. Ordinary Level (O/L) Results
          </h4>{" "}
          {/* Basic O-Level Information */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Index Number *
              </label>
              <input
                type="text"
                value={formData.EducationalQualification.OLevel.IndexNumber}
                onChange={(e) =>
                  handleInputChange(
                    "EducationalQualification",
                    "OLevel.IndexNumber",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your O/L index number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Medium of Exam *
              </label>
              <select
                value={formData.EducationalQualification.OLevel.MediumOfExam}
                onChange={(e) =>
                  handleInputChange(
                    "EducationalQualification",
                    "OLevel.MediumOfExam",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select medium</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Tamil">Tamil</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                Year of Exam *
              </label>
              <input
                type="number"
                min="1990"
                max="2030"
                value={formData.EducationalQualification.OLevel.YearOfExam}
                onChange={(e) =>
                  handleInputChange(
                    "EducationalQualification",
                    "OLevel.YearOfExam",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 2023"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                School Name *
              </label>
              <input
                type="text"
                value={formData.EducationalQualification.OLevel.SchoolName}
                onChange={(e) =>
                  handleInputChange(
                    "EducationalQualification",
                    "OLevel.SchoolName",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your school name"
              />
            </div>
          </div> */}
          {/* O-Level Subject Results */}
          <div>
            <h5 className="text-md font-semibold text-appleGray-700 mb-4">
              Subject Results (Select up to 9 subjects) *
            </h5>
            <div className="space-y-3">
              {formData.EducationalQualification.OLevel.SubjectResults.map(
                (subject, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-medium text-appleGray-600 mb-1">
                        Subject {index + 1}
                      </label>
                      <select
                        value={subject.Subject}
                        onChange={(e) => {
                          const newSubjects = [
                            ...formData.EducationalQualification.OLevel
                              .SubjectResults,
                          ];
                          newSubjects[index].Subject = e.target.value;
                          handleInputChange(
                            "EducationalQualification",
                            "OLevel.SubjectResults",
                            newSubjects
                          );
                        }}
                        className="w-full px-4 py-3 border border-appleGray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 text-sm"
                      >
                        <option value="">Select subject</option>
                        {oLevelSubjects.map((subj) => (
                          <option key={subj} value={subj}>
                            {subj}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-appleGray-600 mb-1">
                        Grade
                      </label>
                      <select
                        value={subject.Grade}
                        onChange={(e) => {
                          const newSubjects = [
                            ...formData.EducationalQualification.OLevel
                              .SubjectResults,
                          ];
                          newSubjects[index].Grade = e.target.value;
                          handleInputChange(
                            "EducationalQualification",
                            "OLevel.SubjectResults",
                            newSubjects
                          );
                        }}
                        className="w-full px-4 py-3 border border-appleGray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 text-sm"
                      >
                        <option value="">Select grade</option>
                        <option value="A">A - Distinction</option>
                        <option value="B">B - Very Good</option>
                        <option value="C">C - Credit Pass</option>
                        <option value="S">S - Ordinary Pass</option>
                        <option value="W">W - Fail</option>
                      </select>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* A-Level Results Section */}
        <div className="bg-appleGray-50 p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
            G.C.E. Advanced Level (A/L) Results
          </h4>

          {formData.EducationalQualification.ALevel.SubjectResults.map(
            (subject, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    Subject {index + 1}
                  </label>
                  <select
                    value={subject.Subject}
                    onChange={(e) => {
                      const newSubjects = [
                        ...formData.EducationalQualification.ALevel
                          .SubjectResults,
                      ];
                      newSubjects[index].Subject = e.target.value;
                      handleInputChange(
                        "EducationalQualification",
                        "ALevel.SubjectResults",
                        newSubjects
                      );
                    }}
                    className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select subject</option>
                    {subjectsList.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    Grade
                  </label>
                  <select
                    value={subject.Result}
                    onChange={(e) => {
                      const newSubjects = [
                        ...formData.EducationalQualification.ALevel
                          .SubjectResults,
                      ];
                      newSubjects[index].Result = e.target.value;
                      handleInputChange(
                        "EducationalQualification",
                        "ALevel.SubjectResults",
                        newSubjects
                      );
                    }}
                    className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="S">S</option>
                  </select>
                </div>
              </div>
            )
          )}
        </div>

        <div className="bg-appleGray-50 p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="gpaRequired"
              checked={
                formData.EducationalQualification.ALevel.GPA.RequiredForMasters
              }
              onChange={(e) =>
                handleInputChange(
                  "EducationalQualification",
                  "ALevel.GPA.RequiredForMasters",
                  e.target.checked
                )
              }
              className="w-4 h-4 text-sky-500 border-appleGray-300 rounded focus:ring-sky-500"
            />
            <label
              htmlFor="gpaRequired"
              className="text-sm font-semibold text-appleGray-700"
            >
              Applying for Master&apos;s Degree (GPA Required)
            </label>
          </div>

          {formData.EducationalQualification.ALevel.GPA.RequiredForMasters && (
            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                GPA Value
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={formData.EducationalQualification.ALevel.GPA.Value}
                onChange={(e) =>
                  handleInputChange(
                    "EducationalQualification",
                    "ALevel.GPA.Value",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your GPA (e.g., 3.75)"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-appleGray-700 mb-2">
            Transcript or Additional Documents
          </label>
          <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-8 text-center hover:border-sky-500 transition-all duration-200">
            <FaFileUpload className="w-8 h-8 text-appleGray-400 mx-auto mb-4" />
            <input
              type="file"
              onChange={(e) =>
                handleInputChange(
                  "EducationalQualification",
                  "TranscriptOrAdditionalDocument",
                  e.target.files[0]
                )
              }
              className="hidden"
              id="transcript-upload"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="transcript-upload"
              className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
            >
              Click to upload transcript
            </label>
            <p className="text-sm text-appleGray-500 mt-2">
              PDF, JPG, PNG up to 10MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  function renderIELTSResults() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaCertificate className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            English Proficiency
          </h3>
          <p className="text-appleGray-600">IELTS scores and certificates</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-appleGray-700 mb-2">
            Do you have IELTS scores? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Yes", "No", "Planning to take"].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 p-4 border border-appleGray-200 rounded-2xl hover:bg-appleGray-50 cursor-pointer transition-all duration-200"
              >
                <input
                  type="radio"
                  name="ieltsOption"
                  value={option}
                  checked={formData.IELTSResults.ScoreOption === option}
                  onChange={(e) =>
                    handleInputChange(
                      "IELTSResults",
                      "ScoreOption",
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

        {formData.IELTSResults.ScoreOption === "Yes" && (
          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              IELTS Scores
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {["Reading", "Writing", "Listening", "Speaking"].map((skill) => (
                <div key={skill}>
                  <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                    {skill}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    value={formData.IELTSResults[skill]}
                    onChange={(e) =>
                      handleInputChange("IELTSResults", skill, e.target.value)
                    }
                    className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                IELTS Certificate
              </label>
              <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-8 text-center hover:border-sky-500 transition-all duration-200">
                <FaFileUpload className="w-8 h-8 text-appleGray-400 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={(e) =>
                    handleInputChange(
                      "IELTSResults",
                      "Certificate",
                      e.target.files[0]
                    )
                  }
                  className="hidden"
                  id="ielts-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="ielts-upload"
                  className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
                >
                  Upload IELTS certificate
                </label>
                <p className="text-sm text-appleGray-500 mt-2">
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderDocuments() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaFileUpload className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Documents Upload
          </h3>
          <p className="text-appleGray-600">Upload your required documents</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              CV/Resume *
            </h4>
            <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-8 text-center hover:border-sky-500 transition-all duration-200">
              <FaFileUpload className="w-8 h-8 text-appleGray-400 mx-auto mb-4" />
              <input
                type="file"
                onChange={(e) =>
                  handleInputChange("CVUpload", "File", e.target.files[0])
                }
                className="hidden"
                id="cv-upload"
                accept=".pdf,.doc,.docx"
                required
              />
              <label
                htmlFor="cv-upload"
                className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
              >
                Upload your CV/Resume
              </label>
              <p className="text-sm text-appleGray-500 mt-2">
                PDF, DOC, DOCX up to 10MB
              </p>
            </div>
          </div>

          <div className="bg-appleGray-50 p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-appleGray-800 mb-4">
              For Master&apos;s Degree Applications
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Bachelor&apos;s Certificate
                </label>
                <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-6 text-center hover:border-sky-500 transition-all duration-200">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleInputChange(
                        "WhenApplyingMaster",
                        "BachelorsCertificate",
                        e.target.files[0]
                      )
                    }
                    className="hidden"
                    id="bachelors-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />{" "}
                  <label
                    htmlFor="bachelors-upload"
                    className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
                  >
                    Upload Bachelor&apos;s Certificate
                  </label>
                  <p className="text-sm text-appleGray-500 mt-2">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                  Academic Transcript
                </label>
                <div className="border-2 border-dashed border-appleGray-300 rounded-2xl p-6 text-center hover:border-sky-500 transition-all duration-200">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleInputChange(
                        "WhenApplyingMaster",
                        "Transcript",
                        e.target.files[0]
                      )
                    }
                    className="hidden"
                    id="masters-transcript-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="masters-transcript-upload"
                    className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
                  >
                    Upload Academic Transcript
                  </label>
                  <p className="text-sm text-appleGray-500 mt-2">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderAdditionalInformation() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <FaBookOpen className="w-12 h-12 text-sky-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
            Course Preferences
          </h3>
          <p className="text-appleGray-600">
            Tell us about your study preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Reference Code (Optional)
            </label>
            <input
              type="text"
              value={formData.AdditionalInformation.ReferenceCode}
              onChange={(e) =>
                handleInputChange(
                  "AdditionalInformation",
                  "ReferenceCode",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter reference code if any"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Preferred Course *
            </label>
            <input
              type="text"
              value={formData.AdditionalInformation.Course}
              onChange={(e) =>
                handleInputChange(
                  "AdditionalInformation",
                  "Course",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your preferred course"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Academic Year *
            </label>
            <select
              value={formData.AdditionalInformation.AcademicYear}
              onChange={(e) =>
                handleInputChange(
                  "AdditionalInformation",
                  "AcademicYear",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select academic year</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-appleGray-700 mb-2">
              Academic Term *
            </label>
            <select
              value={formData.AdditionalInformation.AcademicTerm}
              onChange={(e) =>
                handleInputChange(
                  "AdditionalInformation",
                  "AcademicTerm",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select academic term</option>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-appleGray-700 mb-2">
            Course Preferences (Top 3)
          </label>
          {formData.AdditionalInformation.CoursePreferences.map(
            (course, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  value={course}
                  onChange={(e) => {
                    const newCourses = [
                      ...formData.AdditionalInformation.CoursePreferences,
                    ];
                    newCourses[index] = e.target.value;
                    handleInputChange(
                      "AdditionalInformation",
                      "CoursePreferences",
                      newCourses
                    );
                  }}
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Course preference ${index + 1}`}
                />
              </div>
            )
          )}
          <button
            type="button"
            onClick={() => {
              if (formData.AdditionalInformation.CoursePreferences.length < 3) {
                handleInputChange(
                  "AdditionalInformation",
                  "CoursePreferences",
                  [...formData.AdditionalInformation.CoursePreferences, ""]
                );
              }
            }}
            className="text-sky-500 hover:text-sky-600 font-semibold text-sm"
          >
            + Add another course preference
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-appleGray-700 mb-2">
            University Preferences (Top 3)
          </label>
          {formData.AdditionalInformation.UniversityPreferences.map(
            (university, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  value={university}
                  onChange={(e) => {
                    const newUniversities = [
                      ...formData.AdditionalInformation.UniversityPreferences,
                    ];
                    newUniversities[index] = e.target.value;
                    handleInputChange(
                      "AdditionalInformation",
                      "UniversityPreferences",
                      newUniversities
                    );
                  }}
                  className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder={`University preference ${index + 1}`}
                />
              </div>
            )
          )}
          <button
            type="button"
            onClick={() => {
              if (
                formData.AdditionalInformation.UniversityPreferences.length < 3
              ) {
                handleInputChange(
                  "AdditionalInformation",
                  "UniversityPreferences",
                  [...formData.AdditionalInformation.UniversityPreferences, ""]
                );
              }
            }}
            className="text-sky-500 hover:text-sky-600 font-semibold text-sm"
          >
            + Add another university preference
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-appleGray-700 mb-2">
            Personal Statement
          </label>
          <textarea
            value={formData.AdditionalInformation.PersonalStatement}
            onChange={(e) =>
              handleInputChange(
                "AdditionalInformation",
                "PersonalStatement",
                e.target.value
              )
            }
            rows={6}
            className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            placeholder="Tell us why you want to study abroad and what makes you a good candidate..."
          />
          <p className="text-sm text-appleGray-500 mt-2">
            Optional but recommended - helps us understand your motivation
          </p>
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
            Prove your financial independence for studying in Germany
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
                  name="canEarnLiving"
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
            the Opportunity Card. You can prove your financial independence with
            the help of a blocked account or a Declaration of Commitment, among
            other things.
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
              <option value="blocked-account">Blocked Account</option>
              <option value="declaration-commitment">
                Declaration of Commitment
              </option>
              <option value="scholarship">Scholarship</option>
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
                placeholder="e.g., 11,208 (minimum required for students)"
              />
              <p className="text-sm text-appleGray-500 mt-2">
                Minimum €11,208 per year for students in Germany
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
                  handleInputChange(
                    "FinancialProof",
                    "FinancialDocuments",
                    e.target.files[0]
                  )
                }
                className="hidden"
                id="financial-documents-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />
              <label
                htmlFor="financial-documents-upload"
                className="cursor-pointer text-sky-500 hover:text-sky-600 font-semibold"
              >
                {formData.FinancialProof.FinancialDocuments?.name ||
                  "Upload Financial Documents"}
              </label>
              <p className="text-sm text-appleGray-500 mt-2">
                PDF, JPG, PNG up to 10MB each
              </p>
              <p className="text-xs text-appleGray-400 mt-2">
                e.g., Bank statements, blocked account confirmation, scholarship
                letter, etc.
              </p>{" "}
            </div>
          </div>
        </div>{" "}
      </div>
    );
  }
};

export default StudentApplicationForm;
