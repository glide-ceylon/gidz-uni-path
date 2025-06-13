"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const StudentDetails = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ieltsDocumentUrl, setIeltsDocumentUrl] = useState(null);
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [bachelorsUrl, setBachelorsUrl] = useState(null);
  const [transUrl, setTransUrl] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);

  useEffect(() => {
    const fetchWorkDetails = async () => {
      setLoading(true);
      const Id = sessionStorage.getItem("selectedStudentId");
  
      if (!Id) {
        setLoading(false);
        return;
      }
  
      try {
        const { data, error } = await supabase
          .from("student_visa")
          .select("*")
          .eq("id", Id)
          .single();
  
        if (error) throw new Error(error.message);
  
        // Parse JSON data column
        const parsedData = data.data ? JSON.parse(data.data) : {};
        setStudent({ id: data.id, ...parsedData });

        const fetchFileUrls = async (folder, fileName) => {
          if (!fileName) return null;
        
          // Extract the relative path if the fileName contains the full URL
          const baseUrl = "https://cpzkzyokznbrayxnyfin.supabase.co/storage/v1/object/public/student_visa_files/";
          let relativePath = fileName;
        
          if (fileName.startsWith(baseUrl)) {
            relativePath = fileName.replace(baseUrl, "");
          }
        
          // Ensure that filePath is correctly formatted
          const decodedFileName = decodeURIComponent(relativePath.split("/").pop());
          const filePath = `${folder}/${decodedFileName}`;
        
        
          // Get public URL from Supabase storage
          const { data } = supabase.storage
            .from("student_visa_files")
            .getPublicUrl(filePath);
        
          if (!data || !data.publicUrl) {
            console.error(`Error fetching public URL for: ${filePath}`);
            return null;
          }
        
          console.log(`Fetched file URL from`, data);
          return data.publicUrl;
        };
        // Fetch file URLs
        const [ieltsUrl, transcriptUrl, cvUrl, bachelorsUrl, transUrl] = await Promise.all([
          fetchFileUrls("ielts", parsedData.IELTSResults?.Certificate),
          fetchFileUrls("transcript", parsedData.EducationalQualification?.TranscriptOrAdditionalDocument),
          fetchFileUrls("cv", parsedData.CVUpload?.File),
          fetchFileUrls("bachelors", parsedData.WhenApplyingMaster?.BachelorsCertificate),
          fetchFileUrls("bachelors", parsedData.WhenApplyingMaster?.Transcript),
        ]);
        console.log("Ielts Url", ieltsUrl)
        
  
        setIeltsDocumentUrl(ieltsUrl);
        setTranscriptUrl(transcriptUrl);
        setCvUrl(cvUrl);
        setBachelorsUrl(bachelorsUrl);
        setTransUrl(transUrl);
      } catch (err) {
        console.error("Error fetching work details:", err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWorkDetails();
  }, []);
  
  

  // Function to open file in a new tab
  const openFileInNewTab = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      console.error("No file URL provided");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Student Details
        </h1>
        <form className="space-y-8">
          {/* Personal Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { name: "FirstName", label: "First Name" },
                { name: "LastName", label: "Last Name" },
                { name: "Gender", label: "Gender" },
                { name: "DateOfBirth", label: "Date of Birth" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={student.PersonalInformation?.[name] || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  University Type
                </label>
                <div className="mt-2 flex space-x-4">
                  {["Public University", "Private University"]
                    .filter((option) =>
                      student.PersonalInformation?.UniversityType?.includes(option)
                    )
                    .map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{option}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { name: "Email", label: "Email" },
                { name: "MobileNo", label: "Mobile No" },
                { name: "Address", label: "Address" },
                { name: "Country", label: "Country" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={student.ContactInformation?.[name] || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Educational Qualification */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Educational Qualification
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  A-Level Subjects
                </label>
                {student.EducationalQualification?.ALevel?.SubjectResults?.map(
                  (subject, index) => (
                    <div key={index} className="mt-2">
                      <input
                        type="text"
                        value={`${subject.Subject}: ${subject.Result}`}
                        readOnly
                        className="block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                      />
                    </div>
                  )
                )}
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-600">
                  GPA
                </label>
                <input
                  type="text"
                  value={
                    student.EducationalQualification?.ALevel?.GPA?.Value ||
                    "Not provided"
                  }
                  readOnly
                  className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Transcript/Additional Document
                </label>
                {transcriptUrl ? (
                  <button
                    onClick={() => openFileInNewTab(transcriptUrl)}
                    className="text-blue-500 hover:underline"
                  >
                    View Transcript
                  </button>
                ) : (
                  <p className="text-gray-500">No transcript uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* IELTS Results */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              IELTS Results
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { name: "Reading", label: "Reading" },
                { name: "Writing", label: "Writing" },
                { name: "Listening", label: "Listening" },
                { name: "Speaking", label: "Speaking" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={student.IELTSResults?.[name] || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  IELTS Certificate
                </label>
                {ieltsDocumentUrl ? (
                  <button
                    onClick={() => openFileInNewTab(ieltsDocumentUrl)}
                    className="text-blue-500 hover:underline"
                  >
                    View IELTS Certificate
                  </button>
                ) : (
                  <p className="text-gray-500">No IELTS certificate uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* CV Upload */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              CV Upload
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                CV File
              </label>
              {cvUrl ? (
                <button
                  onClick={() => openFileInNewTab(cvUrl)}
                  className="text-blue-500 hover:underline"
                >
                  View CV
                </button>
              ) : (
                <p className="text-gray-500">No CV uploaded</p>
              )}
            </div>
          </div>

          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              When Applying Master
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Bachelors Certificate
              </label>
              {bachelorsUrl ? (
                <button
                  onClick={() => openFileInNewTab(bachelorsUrl)}
                  className="text-blue-500 hover:underline"
                >
                  View Certificate
                </button>
              ) : (
                <p className="text-gray-500">No Certificate uploaded</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Transcript
              </label>
              {transUrl ? (
                <button
                  onClick={() => openFileInNewTab(transUrl)}
                  className="text-blue-500 hover:underline"
                >
                  View Transcript
                </button>
              ) : (
                <p className="text-gray-500">No Transcript uploaded</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { name: "ReferenceCode", label: "Reference Code" },
                { name: "Course", label: "Course" },
                { name: "AcademicYear", label: "Academic Year" },
                { name: "AcademicTerm", label: "Academic Term" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={student.AdditionalInformation?.[name] || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Course Preferences
                </label>
                {Array.isArray(student.AdditionalInformation?.CoursePreferences) ? (
                  student.AdditionalInformation.CoursePreferences.map((preference, index) => (
                    <input
                      key={index}
                      type="text"
                      value={preference}
                      readOnly
                      className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                    />
                  ))
                ) : (
                  <input
                    type="text"
                    value={student.AdditionalInformation?.CoursePreferences || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  City Preferences
                </label>
                {Array.isArray(student.AdditionalInformation?.CityPreferences) ? (
                  student.AdditionalInformation.CityPreferences.map((preference, index) => (
                    <input
                      key={index}
                      type="text"
                      value={preference}
                      readOnly
                      className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                    />
                  ))
                ) : (
                  <input
                    type="text"
                    value={student.AdditionalInformation?.CityPreferences || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Universities Preferences
                </label>
                {Array.isArray(student.AdditionalInformation?.UniversityPreferences) ? (
                  student.AdditionalInformation.UniversityPreferences.map((preference, index) => (
                    <input
                      key={index}
                      type="text"
                      value={preference}
                      readOnly
                      className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                    />
                  ))
                ) : (
                  <input
                    type="text"
                    value={student.AdditionalInformation?.UniversityPreferences || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Open for Other Options
                </label>
                <input
                  type="text"
                  value={
                    student.AdditionalInformation?.OpenForOtherOptions
                      ? "Yes"
                      : "No"
                  }
                  readOnly
                  className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                />
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => window.close()}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close Tab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDetails;