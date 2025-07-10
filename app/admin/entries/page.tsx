"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import StudentQuery from "./student/page";
import WorkQuery from "./work/page";

const EntriesPage = () => {
  const [currentStep, setCurrentStep] = useState("Student");

  const Steps = [
    {
      value: "Student",
      label: "Student Visa",
      icon: "material-symbols:school",
      color: "from-sky-400 to-blue-600",
    },
    {
      value: "Work",
      label: "Work Visa",
      icon: "material-symbols:work",
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-appleGray-50">
      {/* Header Section with navbar gap */}
      <div className="relative pt-20 admin-header-separator">
        {/* Subtle divider line for navbar separation */}
        <div className="absolute top-[80px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-10"></div>

        {/* Additional visual separation with subtle shadow */}
        <div className="absolute top-[81px] left-0 right-0 h-2 bg-gradient-to-b from-white/20 to-transparent z-10"></div>

        <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white shadow-lg relative admin-dashboard-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-3 animate-fade-in">
                Visa Application Entries
              </h1>
              <p className="text-sky-100 text-lg animate-fade-in-up">
                Manage student and work visa applications from one central
                location
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-appleGray-800">
              Application Types
            </h2>
            <div className="text-sm text-appleGray-600">
              Switch between different visa application types
            </div>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {Steps.map((step) => (
              <button
                key={step.value}
                onClick={() => setCurrentStep(step.value)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 font-medium whitespace-nowrap ${
                  currentStep === step.value
                    ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-105`
                    : "bg-appleGray-100 text-appleGray-700 hover:bg-appleGray-200 hover:shadow-md"
                }`}
              >
                <Icon
                  icon={step.icon}
                  className={`text-xl ${
                    currentStep === step.value
                      ? "text-white"
                      : "text-appleGray-500"
                  }`}
                />
                <span>{step.label}</span>
                {currentStep === step.value && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          {currentStep === "Student" ? <StudentQuery /> : <WorkQuery />}
        </div>
      </div>
    </div>
  );
};

export default EntriesPage;
