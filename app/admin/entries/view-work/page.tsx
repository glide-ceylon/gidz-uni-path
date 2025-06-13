"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const WorkDetails = () => {
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvUrl, setCvUrl] = useState(null);
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [bachelorsUrl, setBachelorsUrl] = useState(null);

  useEffect(() => {
    const fetchWorkDetails = async () => {
      const workId = sessionStorage.getItem("selectedWorkId");

      if (!workId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("work_visa")
        .select("*")
        .eq("id", workId)
        .single();

      if (error) {
        console.error("Error fetching work details:", error.message);
      } else {
        const parsedData = data.data ? JSON.parse(data.data) : {};
        setWork({ id: data.id, ...parsedData });

        // Fetch file URL from Supabase Storage
        const fetchFileUrls = async (fileName) => {
          if (!fileName) return null;
        
          // Extract the relative path if the fileName contains the full URL
          const baseUrl = "https://cpzkzyokznbrayxnyfin.supabase.co/storage/v1/object/public/work_visa_files/";
          let relativePath = fileName;
        
          if (fileName.startsWith(baseUrl)) {
            relativePath = fileName.replace(baseUrl, "");
          }
        
          // Ensure that filePath is correctly formatted
          const filePath = `${relativePath.split("/").pop()}`;
        
          // Get public URL from Supabase storage
          const { data } = supabase.storage
            .from("work_visa_files")
            .getPublicUrl(filePath);
        
          if (!data || !data.publicUrl) {
            console.error(`Error fetching public URL for: ${filePath}`);
            return null;
          }
        
          console.log(`Fetched file URL from`, data);
          return data.publicUrl;
        }

        const [cvUrl, transcriptUrl, bachelorUrl] = await Promise.all([
          fetchFileUrls( parsedData.bachelorOrMasterDegreeCertificate),
          fetchFileUrls( parsedData.vocationalTrainingCertificates),
          fetchFileUrls( parsedData.cv),
        ]);
        
        setCvUrl(cvUrl);
        setTranscriptUrl(transcriptUrl);
        setBachelorsUrl(bachelorUrl);
      setLoading(false);
    };
  }

    fetchWorkDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">No data available</p>
      </div>
    );
  }

  const openFileInNewTab = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      console.error("No file URL provided");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Work Visa Details
        </h1>
        <form className="space-y-8">
          {/* Personal Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "dateOfBirth", label: "Date of Birth" },
                { name: "mobileNumber", label: "Mobile Number" },
                { name: "email", label: "Email" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={work[name] || "Not provided"}
                    readOnly
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          {/* <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Qualifications
            </h2>
            {[
              { name: "degreeCertificate", label: "Degree Certificate" },
              { name: "cv", label: "CV" },
            ].map(({ name, label }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-600">{label}</label>
                <div className="flex items-center space-x-4 mt-2">
                  {work[name] ? (
                    <a
                      href={work[name]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
            ))}
          </div> */}

          <div className="border border-gray-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Qualifications
            </h2>
            <div className="box-border flex items-center justify-between border-0 p-4">
              <label className="block text-m font-medium text-gray-600">
                Bachelors Degree Certificate
              </label>
              {bachelorsUrl ? (
                <button
                  onClick={() => openFileInNewTab(bachelorsUrl)}
                  className="text-blue-500 text-m hover:underline"
                >
                  View
                </button>
              ) : (
                <p className="text-gray-500">No Certificate uploaded</p>
              )}
            </div>
            <div className="box-border flex items-center justify-between border-0 p-4">
              <label className="block text-m font-medium text-gray-600">
                Vocational Training Certificate
              </label>
              {bachelorsUrl ? (
                <button
                  onClick={() => openFileInNewTab(transcriptUrl)}
                  className="text-blue-500 text-m hover:underline"
                >
                  View
                </button>
              ) : (
                <p className="text-gray-500">No Certificate uploaded</p>
              )}
            </div>
            <div className="box-border flex items-center justify-between border-0 p-4">
              <label className="block text-m font-medium text-gray-600">
                CV
              </label>
              {cvUrl ? (
                <button
                  onClick={() => openFileInNewTab(cvUrl)}
                  className="text-blue-500 text-m hover:underline"
                >
                  View
                </button>
              ) : (
                <p className="text-gray-500">No Transcript uploaded</p>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Additional Details
            </h2>
            {[
              { name: "germanLanguageLevel", label: "German Language Level" },
              { name: "englishLanguageLevel", label: "English Language Level" },
              { name: "yearsOfProfessionalExperience", label: "Years of Experience" },
              { name: "previousStayInGermany", label:"Previous Stay in Germany" }, 
              { name: "applyingWithSpouse", label:"Applying with Spouse" }, 
              { name: "blockedAccount", label:"Blocked Account" },
              { name: "aboutYouAndYourNeeds", label:"About You and Your Needs"},
            ].map(({ name, label }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-600">{label}</label>
                <input
                  type="text"
                  value={work[name] || "Not provided"}
                  readOnly
                  className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 p-2"
                />
              </div>
            ))}
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

export default WorkDetails;
