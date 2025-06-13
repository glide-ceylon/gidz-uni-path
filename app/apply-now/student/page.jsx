"use client";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";

const ApplicationForm = () => {
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
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Democratic Republic of the Congo",
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
    "Palestine",
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

  const resultsList = ["A", "B", "C", "S", "W", "AB"];
  const ieltsScores = [
    "0.5",
    "1.0",
    "1.5",
    "2.0",
    "2.5",
    "3.0",
    "3.5",
    "4.0",
    "4.5",
    "5.0",
    "5.5",
    "6.0",
    "6.5",
    "7.0",
    "7.5",
    "8.0",
    "8.5",
    "9.0",
  ];

  const ieltsScoreOptions = [
    "Have 5.5 or more",
    "No, But can score 5.5",
    "Can't score 5.5",
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
      CityPreferences: [""],
      UniversityPreferences: [""],
      OpenForOtherOptions: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleChange = (e, section, key, index = null, subIndex = null) => {
    const { name, value, type, files, checked } = e.target;

    setFormData((prevData) => {
      if (section === "IELTSResults") {
        return {
          ...prevData,
          IELTSResults: {
            ...prevData.IELTSResults,
            [name]:
              type === "file"
                ? files[0]
                : type === "checkbox"
                ? checked
                : value,
          },
        };
      }

      const updatedSection = { ...prevData[section] };

      if (section === "EducationalQualification" && key === "SubjectResults") {
        const updatedSubjectResults = [...updatedSection.ALevel.SubjectResults];
        updatedSubjectResults[subIndex][name] =
          type === "file" ? files[0] : value;
        updatedSection.ALevel.SubjectResults = updatedSubjectResults;
      } else if (section === "EducationalQualification" && key === "GPA") {
        updatedSection.ALevel.GPA = {
          ...updatedSection.ALevel.GPA,
          [name]: type === "checkbox" ? checked : value,
        };
      } else if (
        section === "AdditionalInformation" &&
        (key === "CoursePreferences" ||
          key === "CityPreferences" ||
          key === "UniversityPreferences")
      ) {
        updatedSection[key] = value;
      } else {
        updatedSection[key] =
          type === "file" ? files[0] : type === "checkbox" ? checked : value;
      }

      return { ...prevData, [section]: updatedSection };
    });
  };

  const handleCheckboxChange = (e, section, key) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedSection = { ...prevData[section] };
      const currentValues = updatedSection[key] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);
      updatedSection[key] = newValues;
      return { ...prevData, [section]: updatedSection };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.PersonalInformation.FirstName)
      newErrors.FirstName = "First Name is required.";
    if (!formData.PersonalInformation.LastName)
      newErrors.LastName = "Last name is required.";
    if (!formData.PersonalInformation.Gender)
      newErrors.Gender = "Gender is required.";
    if (!formData.PersonalInformation.DateOfBirth)
      newErrors.DateOfBirth = "Date of birth is required.";
    if (!formData.PersonalInformation.UniversityType)
      newErrors.UniversityType = "University type is required.";

    if (!formData.ContactInformation.Email)
      newErrors.Email = "Email is required.";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.ContactInformation.Email
      )
    )
      newErrors.Email = "Invalid email address.";
    if (!formData.ContactInformation.MobileNo)
      newErrors.MobileNo = "Mobile number is required.";
    if (!formData.ContactInformation.Address)
      newErrors.Address = "Address is required.";
    if (!formData.ContactInformation.Country)
      newErrors.Country = "Country is required.";

    // formData.EducationalQualification.ALevel.SubjectResults.forEach(
    //   (subjectResult, index) => {
    //     if (!subjectResult.Subject)
    //       newErrors[`Subject_${index}`] = `Subject ${index + 1} is required.`;
    //     if (!subjectResult.Result)
    //       newErrors[`Result_${index}`] = `Result for Subject ${
    //         index + 1
    //       } is required.`;
    //   }
    // );

    // if (formData.EducationalQualification.ALevel.GPA.RequiredForMasters) {
    //   if (!formData.EducationalQualification.ALevel.GPA.Value)
    //     newErrors.GPAValue = "GPA value is required when required for Masters.";
    //   else if (isNaN(formData.EducationalQualification.ALevel.GPA.Value))
    //     newErrors.GPAValue = "GPA must be a number.";
    //   else if (
    //     Number(formData.EducationalQualification.ALevel.GPA.Value) < 0 ||
    //     Number(formData.EducationalQualification.ALevel.GPA.Value) > 4
    //   )
    //     newErrors.GPAValue = "GPA must be between 0 and 4.";
    // }

    // if (!formData.IELTSResults.ScoreOption)
    //   newErrors.IELTS_ScoreOption = "IELTS Score Option is required.";

    // if (
    //   formData.IELTSResults.ScoreOption === "Have 5.5 or more" &&
    //   (!formData.IELTSResults.Reading ||
    //     !formData.IELTSResults.Writing ||
    //     !formData.IELTSResults.Listening ||
    //     !formData.IELTSResults.Speaking)
    // ) {
    //   newErrors.IELTS_AllScores =
    //     "All IELTS scores (Reading, Writing, Listening, Speaking) are required when you have 5.5 or more.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;

    const filePath = `${folder}/${Date.now()}_${file.name}`;

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("student_visa_files") // Replace with your bucket name
      .upload(filePath, file);

    if (uploadError) {
      console.error(`Error uploading file to ${folder}:`, uploadError);
      return null;
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = await supabase.storage
      .from("student_visa_files")
      .getPublicUrl(filePath);

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
  
    if (!validate()) {
      setModalMessage("Please fill the required field in the form.");
      setIsModalOpen(true);
      return;
    }
  
    setUploading(true);
  
    try {
      const cvUrl = await uploadFileToSupabase(formData.CVUpload.File, "cv");
      const ieltsUrl = await uploadFileToSupabase(
        formData.IELTSResults.Certificate,
        "ielts"
      );
      const transcriptUrl = await uploadFileToSupabase(
        formData.EducationalQualification.TranscriptOrAdditionalDocument,
        "transcript"
      );
      const bachelorsCertificateUrl = await uploadFileToSupabase(
        formData.WhenApplyingMaster.BachelorsCertificate,
        "bachelors"
      );
      const transcriptUrlForMaster = await uploadFileToSupabase(
        formData.WhenApplyingMaster.Transcript,
        "bachelors"
      );
  
      const updatedFormData = {
        ...formData,
        CVUpload: { File: cvUrl },
        IELTSResults: { ...formData.IELTSResults, Certificate: ieltsUrl },
        EducationalQualification: {
          ...formData.EducationalQualification,
          TranscriptOrAdditionalDocument: transcriptUrl,
        },
        WhenApplyingMaster: {
          ...formData.WhenApplyingMaster,
          BachelorsCertificate: bachelorsCertificateUrl,
          Transcript: transcriptUrlForMaster,
        },
      };
  
      const updatedFormDataWithMark = {
        ...updatedFormData,
        MarkasRead: false
      };
      
      const { error: supabaseError } = await supabase
        .from("student_visa")
        .insert([{ data: [updatedFormDataWithMark] }]);
  
      if (supabaseError) {
        console.error("Error inserting data into Supabase:", supabaseError);
        setModalMessage("Failed to submit form to Supabase.");
        setIsModalOpen(true);
        return;
      }
  
      setModalMessage("Form submitted successfully!");
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error during form submission:", err);
      setModalMessage("An error occurred: " + err.message);
      setIsModalOpen(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-8 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-lg p-3 md:p-8 w-full max-w-5xl overflow-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Application Form
        </h1>
        <div className="mx-auto p-6 my-8">
          <p className="text-center text-gray-600 mt-2">
            Welcome to{" "}
            <span className="font-bold text-blue-600">Gidz Uni Path!</span>
          </p>
          <p className="text-center text-gray-500 text-sm">
            Fill out this form if you want to study abroad. We will contact you
            via <span className="font-medium">Call, Email,</span> or{" "}
            <span className="font-medium">WhatsApp</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Personal Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Personal Information
            </h2>
            {[
              { name: "FirstName", label: "First Name", type: "text" },
              { name: "LastName", label: "Last Name", type: "text" },
              {
                name: "Gender",
                label: "Gender",
                type: "select",
                options: ["Male", "Female", "Other"],
              },
              {
                name: "DateOfBirth",
                label: "Date of Birth",
                type: "date",
              },
            ].map(({ name, label, type, options }) => (
              <div key={name} className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  {label}
                </label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData.PersonalInformation[name] || ""}
                    onChange={(e) =>
                      handleChange(e, "PersonalInformation", name)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select {label}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    placeholder={
                      type!='date'?
                      
                      `Enter your ${label.toLowerCase()}`
                      :'mm/dd/yyyy'
                    }
                    value={formData.PersonalInformation[name] || ""}
                    onChange={(e) =>
                      handleChange(e, "PersonalInformation", name)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                
                  />
                )}
                {!formData.PersonalInformation[name] && errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* University Type Checkboxes */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                University Type
              </label>
              <div className="flex space-x-4">
                {["Public University", "Private University"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="UniversityType"
                      value={option}
                      checked={formData.PersonalInformation.UniversityType.includes(
                        option
                      )}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          "PersonalInformation",
                          "UniversityType"
                        )
                      }
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.UniversityType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.UniversityType}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Contact Information
            </h2>
            {[
              { name: "Email", label: "Email", type: "email" },
              { name: "MobileNo", label: "Mobile Number", type: "text" },
              { name: "Address", label: "Address", type: "text" },
              { name: "Country", label: "Country", type: "select" },
            ].map(({ name, label, type }) => (
              <div key={name} className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  {label}
                </label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData.ContactInformation[name] || ""}
                    onChange={(e) =>
                      handleChange(e, "ContactInformation", name)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    value={formData.ContactInformation[name] || ""}
                    onChange={(e) =>
                      handleChange(e, "ContactInformation", name)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                
                  />
                )}
                {!formData.ContactInformation[name] && errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Educational Qualification */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              A/L Subjects and Results
            </h2>
            {formData.EducationalQualification.ALevel.SubjectResults.map(
              (subjectResult, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Subject {index + 1}
                    </label>
                    <select
                      name="Subject"
                      value={subjectResult.Subject}
                      onChange={(e) =>
                        handleChange(
                          e,
                          "EducationalQualification",
                          "SubjectResults",
                          null,
                          index
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Subject</option>
                      {subjectsList.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    {errors[`Subject_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`Subject_${index}`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Result
                    </label>
                    <select
                      name="Result"
                      value={subjectResult.Result}
                      onChange={(e) =>
                        handleChange(
                          e,
                          "EducationalQualification",
                          "SubjectResults",
                          null,
                          index
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Result</option>
                      {resultsList.map((result) => (
                        <option key={result} value={result}>
                          {result}
                        </option>
                      ))}
                    </select>
                    {errors[`Result_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`Result_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Transcript or Additional Document Upload */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Upload your Transcript/Additional Document
              </label>
              <div className="flex items-center gap-4">
                <label className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300">
                  Choose File
                  <input
                    type="file"
                    name="TranscriptOrAdditionalDocument"
                    onChange={(e) =>
                      handleChange(
                        e,
                        "EducationalQualification",
                        "TranscriptOrAdditionalDocument"
                      )
                    }
                    className="hidden"
                    accept=".pdf,.doc,.docx,image/*"
                  />
                </label>
                {formData.EducationalQualification
                  .TranscriptOrAdditionalDocument && (
                  <span className="text-sm font-medium">
                    {
                      formData.EducationalQualification
                        .TranscriptOrAdditionalDocument.name
                    }
                  </span>
                )}
              </div>
              {errors.TranscriptOrAdditionalDocument && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.TranscriptOrAdditionalDocument}
                </p>
              )}
            </div>
          </div>

          {/* IELTS Results */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              IELTS Results
            </h2>
            <div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Score Option
                </label>
                <select
                  name="ScoreOption"
                  value={formData.IELTSResults.ScoreOption || ""}
                  onChange={(e) =>
                    handleChange(e, "IELTSResults", "ScoreOption")
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select Score Option</option>
                  {ieltsScoreOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.IELTS_ScoreOption && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.IELTS_ScoreOption}
                  </p>
                )}
              </div>

              {formData.IELTSResults.ScoreOption === "Have 5.5 or more" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                      Reading
                    </label>
                    <select
                      name="Reading"
                      value={formData.IELTSResults.Reading || ""}
                      onChange={(e) =>
                        handleChange(e, "IELTSResults", "Reading")
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Score</option>
                      {ieltsScores.map((score) => (
                        <option key={score} value={score}>
                          {score}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                      Writing
                    </label>
                    <select
                      name="Writing"
                      value={formData.IELTSResults.Writing || ""}
                      onChange={(e) =>
                        handleChange(e, "IELTSResults", "Writing")
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Score</option>
                      {ieltsScores.map((score) => (
                        <option key={score} value={score}>
                          {score}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                      Listening
                    </label>
                    <select
                      name="Listening"
                      value={formData.IELTSResults.Listening || ""}
                      onChange={(e) =>
                        handleChange(e, "IELTSResults", "Listening")
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Score</option>
                      {ieltsScores.map((score) => (
                        <option key={score} value={score}>
                          {score}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                      Speaking
                    </label>
                    <select
                      name="Speaking"
                      value={formData.IELTSResults.Speaking || ""}
                      onChange={(e) =>
                        handleChange(e, "IELTSResults", "Speaking")
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Score</option>
                      {ieltsScores.map((score) => (
                        <option key={score} value={score}>
                          {score}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.IELTS_AllScores && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.IELTS_AllScores}
                    </p>
                  )}
                </>
              )}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Upload IELTS Certificate
                </label>
                <div className="flex items-center gap-4">
                  <label className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300">
                    Choose File
                    <input
                      type="file"
                      name="Certificate"
                      onChange={(e) =>
                        handleChange(e, "IELTSResults", "Certificate")
                      }
                      className="hidden"
                      accept=".pdf,.doc,.docx,image/*"
                    />
                  </label>
                  {formData.IELTSResults.Certificate && (
                    <span className="text-sm font-medium">
                      {formData.IELTSResults.Certificate.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CV Upload */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              CV Upload
            </h2>
            <label className="block mb-2 text-sm font-medium">
              Upload your CV
            </label>
            <div className="flex items-center gap-4">
              <label className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300">
                Choose File
                <input
                  type="file"
                  name="File"
                  onChange={(e) => handleChange(e, "CVUpload", "File")}
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                />
              </label>
              {formData.CVUpload.File && (
                <span className="text-sm font-medium">
                  {formData.CVUpload.File.name}
                </span>
              )}
            </div>
          </div>

          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              When Applying Master
            </h2>
            <label className="block mb-2 text-sm font-medium">
              Bachelors Certificate
            </label>
            <div className="flex items-center gap-4">
              <label className="bg-gray-200 p-2 rounded-lg cursor-pointerm hover:bg-gray-300">
                Choose File
                <input
                  type="file"
                  name="BachelorsCertificate"
                  onChange={(e) =>
                    handleChange(
                      e,
                      "WhenApplyingMaster",
                      "BachelorsCertificate"
                    )
                  }
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                />
              </label>
              {formData.WhenApplyingMaster.BachelorsCertificate && (
                <span className="text-sm font-medium">
                  {formData.WhenApplyingMaster.BachelorsCertificate.name}
                </span>
              )}
            </div>
            <label className="block mb-2 text-sm font-medium">Transcript</label>
            <div className="flex items-center gap-4">
              <label className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300">
                Choose File
                <input
                  type="file"
                  name="Transcript"
                  onChange={(e) =>
                    handleChange(e, "WhenApplyingMaster", "Transcript")
                  }
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                />
              </label>
              {formData.WhenApplyingMaster.Transcript && (
                <span className="text-sm font-medium">
                  {formData.WhenApplyingMaster.Transcript.name}
                </span>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Additional Information
            </h2>
            {[
              {
                name: "Course",
                label: "Course",
                type: "select",
                options: ["Bachelors", "Masters", "PhD"],
              },
              {
                name: "AcademicYear",
                label: "Academic Year",
                type: "select",
                options: ["2025", "2026", "2027"],
              },
              {
                name: "AcademicTerm",
                label: "Academic Term",
                type: "select",
                options: ["Summer", "Winter"],
              },
              {
                name: "CoursePreferences",
                label: "Course Preferences",
                type: "textarea",
              },
              {
                name: "CityPreferences",
                label: "City Preferences",
                type: "textarea",
              },
              {
                name: "UniversityPreferences",
                label: "University Preferences",
                type: "textarea",
              },
              {
                name: "ReferenceCode",
                label: "Reference Code",
                type: "textfield",
              },
            ].map(({ name, label, type, options }) => (
              <div key={name} className="mb-4">
                {type !== "checkbox" ? (
                  <>
                    <label className="block mb-2 text-sm font-medium">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        value={formData.AdditionalInformation[name] || ""}
                        onChange={(e) =>
                          handleChange(e, "AdditionalInformation", name)
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                      >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : type === "textarea" ? (
                      <textarea
                        name={name}
                        value={formData.AdditionalInformation[name] || ""}
                        onChange={(e) =>
                          handleChange(e, "AdditionalInformation", name)
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                        rows="3"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={formData.AdditionalInformation[name] || ""}
                        onChange={(e) =>
                          handleChange(e, "AdditionalInformation", name)
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center">
                    <input
                      type={type}
                      name={name}
                      checked={formData.AdditionalInformation[name] || false}
                      onChange={(e) =>
                        handleChange(e, "AdditionalInformation", name)
                      }
                      className="mr-2"
                    />
                    <span>{label}</span>
                  </div>
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

export default ApplicationForm;
