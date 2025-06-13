"use client";
import React, { useState } from "react";
import StudentQuery from "./student/page";
import WorkQuery from "./work/page";

const EntriesPage = () => {
  const [currentStep, setCurrentStep] = useState("Student");

  const Steps = [
    { value: "Student", label: "Student Visa" },
    { value: "Work", label: "Work Visa" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold mb-8 text-center">Visa Application Entries</h1>

      {/* Step Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          {Steps.map((step) => (
            <button
              key={step.value}
              onClick={() => setCurrentStep(step.value)}
              className={`px-4 py-2 rounded transition duration-300 ${
                currentStep === step.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Show StudentQuery if "Student Visa" is selected */}
      <div className="max-w-6xl mx-auto">
        {currentStep === "Student" ? <StudentQuery /> : <WorkQuery />}
      </div>
    </div>
  );
};

export default EntriesPage;
