"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { Icon } from "@iconify/react";

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
          const baseUrl =
            "https://cpzkzyokznbrayxnyfin.supabase.co/storage/v1/object/public/work_visa_files/";
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
        };

        const [cvUrl, transcriptUrl, bachelorUrl] = await Promise.all([
          fetchFileUrls(parsedData.bachelorOrMasterDegreeCertificate),
          fetchFileUrls(parsedData.vocationalTrainingCertificates),
          fetchFileUrls(parsedData.cv),
        ]);

        setCvUrl(cvUrl);
        setTranscriptUrl(transcriptUrl);
        setBachelorsUrl(bachelorUrl);
        setLoading(false);
      }
    };

    fetchWorkDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-appleGray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto"></div>
          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-semibold text-appleGray-800">
              Loading Work Details
            </h3>
            <p className="text-appleGray-600">
              Please wait while we fetch the information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-appleGray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon
              icon="material-symbols:error"
              className="text-2xl text-red-600"
            />
          </div>
          <h3 className="text-xl font-semibold text-appleGray-800 mb-2">
            No Work Data Found
          </h3>
          <p className="text-appleGray-600 mb-6">
            The requested work visa information could not be found or has been
            removed.
          </p>
          <button
            onClick={() => window.close()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors duration-200"
          >
            Close Tab
          </button>
        </div>
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
    <div className="min-h-screen bg-appleGray-50">
      {/* Header Section with navbar gap */}
      <div className="relative pt-20 admin-header-separator">
        {/* Subtle divider line for navbar separation */}
        <div className="absolute top-[80px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-10"></div>

        {/* Additional visual separation with subtle shadow */}
        <div className="absolute top-[81px] left-0 right-0 h-2 bg-gradient-to-b from-white/20 to-transparent z-10"></div>

        <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 text-white shadow-lg relative admin-dashboard-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Work Visa Details</h1>
                <p className="text-purple-100">
                  Detailed view of work visa application
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Icon
                    icon="material-symbols:work"
                    className="text-2xl text-white"
                  />
                </div>
                <div>
                  <div className="font-semibold">
                    {work.firstName} {work.lastName}
                  </div>
                  <div className="text-purple-100 text-sm">ID: {work.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 overflow-hidden">
            <div className="bg-appleGray-50 px-6 py-4 border-b border-appleGray-200">
              <h2 className="text-xl font-semibold text-appleGray-800 flex items-center space-x-2">
                <Icon
                  icon="material-symbols:person"
                  className="text-xl text-purple-500"
                />
                <span>Personal Information</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "firstName",
                    label: "First Name",
                    icon: "material-symbols:badge",
                  },
                  {
                    name: "lastName",
                    label: "Last Name",
                    icon: "material-symbols:badge",
                  },
                  {
                    name: "dateOfBirth",
                    label: "Date of Birth",
                    icon: "material-symbols:calendar-today",
                  },
                  {
                    name: "mobileNumber",
                    label: "Mobile Number",
                    icon: "material-symbols:phone",
                  },
                  {
                    name: "email",
                    label: "Email",
                    icon: "material-symbols:mail",
                  },
                ].map(({ name, label, icon }) => (
                  <div key={name}>
                    <label className="text-sm font-medium text-appleGray-700 mb-2 flex items-center space-x-2">
                      <Icon
                        icon={icon}
                        className="text-lg text-appleGray-500"
                      />
                      <span>{label}</span>
                    </label>
                    <div className="bg-appleGray-100 border border-appleGray-200 rounded-2xl px-4 py-3 text-appleGray-800">
                      {work[name] || "Not provided"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 overflow-hidden">
            <div className="bg-appleGray-50 px-6 py-4 border-b border-appleGray-200">
              <h2 className="text-xl font-semibold text-appleGray-800 flex items-center space-x-2">
                <Icon
                  icon="material-symbols:workspace-premium"
                  className="text-xl text-purple-500"
                />
                <span>Qualifications</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-appleGray-700 mb-3 flex items-center space-x-2">
                  <Icon
                    icon="material-symbols:school"
                    className="text-lg text-appleGray-500"
                  />
                  <span>Bachelor's Degree Certificate</span>
                </label>
                {bachelorsUrl ? (
                  <button
                    onClick={() => openFileInNewTab(bachelorsUrl)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
                  >
                    <Icon
                      icon="material-symbols:visibility"
                      className="text-lg"
                    />
                    <span>View Certificate</span>
                  </button>
                ) : (
                  <div className="bg-appleGray-100 border border-appleGray-200 rounded-2xl px-4 py-3 text-appleGray-600 flex items-center space-x-2">
                    <Icon
                      icon="material-symbols:description-off"
                      className="text-lg"
                    />
                    <span>No certificate uploaded</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-appleGray-700 mb-3 flex items-center space-x-2">
                  <Icon
                    icon="material-symbols:work"
                    className="text-lg text-appleGray-500"
                  />
                  <span>Vocational Training Certificate</span>
                </label>
                {transcriptUrl ? (
                  <button
                    onClick={() => openFileInNewTab(transcriptUrl)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
                  >
                    <Icon
                      icon="material-symbols:visibility"
                      className="text-lg"
                    />
                    <span>View Certificate</span>
                  </button>
                ) : (
                  <div className="bg-appleGray-100 border border-appleGray-200 rounded-2xl px-4 py-3 text-appleGray-600 flex items-center space-x-2">
                    <Icon
                      icon="material-symbols:description-off"
                      className="text-lg"
                    />
                    <span>No certificate uploaded</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-appleGray-700 mb-3 flex items-center space-x-2">
                  <Icon
                    icon="material-symbols:description"
                    className="text-lg text-appleGray-500"
                  />
                  <span>CV</span>
                </label>
                {cvUrl ? (
                  <button
                    onClick={() => openFileInNewTab(cvUrl)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
                  >
                    <Icon
                      icon="material-symbols:visibility"
                      className="text-lg"
                    />
                    <span>View CV</span>
                  </button>
                ) : (
                  <div className="bg-appleGray-100 border border-appleGray-200 rounded-2xl px-4 py-3 text-appleGray-600 flex items-center space-x-2">
                    <Icon
                      icon="material-symbols:description-off"
                      className="text-lg"
                    />
                    <span>No CV uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 overflow-hidden">
            <div className="bg-appleGray-50 px-6 py-4 border-b border-appleGray-200">
              <h2 className="text-xl font-semibold text-appleGray-800 flex items-center space-x-2">
                <Icon
                  icon="material-symbols:info"
                  className="text-xl text-purple-500"
                />
                <span>Additional Details</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "germanLanguageLevel",
                    label: "German Language Level",
                    icon: "material-symbols:language",
                  },
                  {
                    name: "englishLanguageLevel",
                    label: "English Language Level",
                    icon: "material-symbols:language",
                  },
                  {
                    name: "yearsOfProfessionalExperience",
                    label: "Years of Experience",
                    icon: "material-symbols:work-history",
                  },
                  {
                    name: "previousStayInGermany",
                    label: "Previous Stay in Germany",
                    icon: "material-symbols:location-on",
                  },
                  {
                    name: "applyingWithSpouse",
                    label: "Applying with Spouse",
                    icon: "material-symbols:people",
                  },
                  {
                    name: "blockedAccount",
                    label: "Blocked Account",
                    icon: "material-symbols:account-balance",
                  },
                ].map(({ name, label, icon }) => (
                  <div key={name}>
                    <label className="text-sm font-medium text-appleGray-700 mb-2 flex items-center space-x-2">
                      <Icon
                        icon={icon}
                        className="text-lg text-appleGray-500"
                      />
                      <span>{label}</span>
                    </label>
                    <div className="bg-appleGray-100 border border-appleGray-200 rounded-2xl px-4 py-3 text-appleGray-800">
                      {work[name] || "Not provided"}
                    </div>
                  </div>
                ))}
              </div>

              {/* About You and Your Needs - Full Width */}
              <div className="mt-6">
                <label className="text-sm font-medium text-appleGray-700 mb-3 flex items-center space-x-2">
                  <Icon
                    icon="material-symbols:person-book"
                    className="text-lg text-appleGray-500"
                  />
                  <span>About You and Your Needs</span>
                </label>
                <div className="bg-appleGray-100 border border-appleGray-200 rounded-2xl px-4 py-3 text-appleGray-800 min-h-[100px]">
                  {work.aboutYouAndYourNeeds || "Not provided"}
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => window.close()}
              className="bg-appleGray-600 hover:bg-appleGray-700 text-white px-8 py-4 rounded-2xl font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Icon icon="material-symbols:close" className="text-lg" />
              <span>Close Tab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;
