"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "../../../lib/supabase";
import StudentQuery from "./student/page";
import WorkQuery from "./work/page";

const EntriesPage = () => {
  const [currentStep, setCurrentStep] = useState("Student");
  const [applicationStats, setApplicationStats] = useState({
    student: { total: 0, read: 0, unread: 0 },
    work: { total: 0, read: 0, unread: 0 },
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const Steps = [
    {
      value: "Student",
      label: "Student Visa",
      icon: "material-symbols:school",
      color: "from-sky-400 to-blue-600",
      stats: applicationStats.student,
    },
    {
      value: "Work",
      label: "Work Visa",
      icon: "material-symbols:work",
      color: "from-purple-400 to-purple-600",
      stats: applicationStats.work,
    },
  ];

  // Get current user information
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/admin-auth/validate");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentUser(data.admin);
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Fetch application statistics
  useEffect(() => {
    if (!currentUser) return;

    const fetchApplicationStats = async () => {
      try {
        // Fetch student visa data
        let studentQuery = supabase.from("student_visa").select("*");
        if (currentUser.role === "staff") {
          studentQuery = studentQuery.eq("assigned_to", currentUser.id);
        }
        const { data: studentData, error: studentError } = await studentQuery;

        // Fetch work visa data
        let workQuery = supabase.from("work_visa").select("*");
        if (currentUser.role === "staff") {
          workQuery = workQuery.eq("assigned_to", currentUser.id);
        }
        const { data: workData, error: workError } = await workQuery;

        if (!studentError && !workError) {
          // Process student data
          const studentProcessed = studentData.map((row) => {
            const parsedData = JSON.parse(row.data);
            return {
              ...parsedData,
              MarkasRead: parsedData.MarkasRead ?? false,
            };
          });

          // Process work data
          const workProcessed = workData.map((row) => {
            const parsedData = JSON.parse(row.data);
            return {
              ...parsedData,
              MarkasRead: parsedData.MarkasRead ?? false,
            };
          });

          // Calculate stats
          const studentStats = {
            total: studentProcessed.length,
            read: studentProcessed.filter((s) => s.MarkasRead).length,
            unread: studentProcessed.filter((s) => !s.MarkasRead).length,
          };

          const workStats = {
            total: workProcessed.length,
            read: workProcessed.filter((w) => w.MarkasRead).length,
            unread: workProcessed.filter((w) => !w.MarkasRead).length,
          };

          setApplicationStats({
            student: studentStats,
            work: workStats,
          });
        }
      } catch (error) {
        console.error("Error fetching application stats:", error);
      }
    };

    fetchApplicationStats();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-appleGray-50">
      {/* Header Section with navbar gap */}
      <div className="pt-20">
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className={`bg-gradient-to-r ${
              Steps.find((s) => s.value === currentStep)?.color ||
              "from-sky-400 to-blue-600"
            } rounded-3xl shadow-large border border-white/20 p-6 mb-8 text-white`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">
                Application Types
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {Steps.map((step) => (
                  <button
                    key={step.value}
                    onClick={() => setCurrentStep(step.value)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 font-medium whitespace-nowrap ${
                      currentStep === step.value
                        ? `bg-white/20 backdrop-blur-sm text-white shadow-lg transform scale-105 border border-white/30`
                        : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/15 hover:text-white hover:shadow-md"
                    }`}
                  >
                    <Icon
                      icon={step.icon}
                      className={`text-xl ${
                        currentStep === step.value
                          ? "text-white"
                          : "text-white/70"
                      }`}
                    />
                    <span>{step.label}</span>
                    {currentStep === step.value && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Statistics Panel */}
              {!isLoading && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-full lg:w-auto lg:min-w-[280px] lg:max-w-[320px] flex-shrink-0 border border-white/20">
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-white">
                      {Steps.find((s) => s.value === currentStep)?.stats
                        .total || 0}
                    </div>
                    <div className="text-sm text-white/80 font-medium">
                      Total {currentStep} Applications
                    </div>
                  </div>
                  <div className="flex justify-center items-center space-x-4 lg:space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full flex-shrink-0"></div>
                      <span className="text-white/90 whitespace-nowrap">
                        <span className="font-semibold">
                          {Steps.find((s) => s.value === currentStep)?.stats
                            .read || 0}
                        </span>{" "}
                        Read
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0"></div>
                      <span className="text-white/90 whitespace-nowrap">
                        <span className="font-semibold">
                          {Steps.find((s) => s.value === currentStep)?.stats
                            .unread || 0}
                        </span>{" "}
                        Unread
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === "Student" ? <StudentQuery /> : <WorkQuery />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntriesPage;
