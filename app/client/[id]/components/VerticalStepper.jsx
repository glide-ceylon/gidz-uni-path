import React from "react";
import {
  FaCheck,
  FaClock,
  FaEllipsisH,
  FaFileAlt,
  FaUniversity,
  FaPassport,
  FaTrophy,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";

export default function HorizontalStepper({ currentStep = 1 }) {
  // Define your six steps with icons:
  const steps = [
    {
      id: 1,
      title: "University Documents",
      subtitle: "Upload academic documents",
      icon: FaGraduationCap,
    },
    {
      id: 2,
      title: "University",
      subtitle: "Apply to universities",
      icon: FaUniversity,
    },
    {
      id: 3,
      title: "Visa Documents",
      subtitle: "Upload visa documents",
      icon: FaFileAlt,
    },
    {
      id: 4,
      title: "Visa",
      subtitle: "Visa application",
      icon: FaPassport,
    },
    {
      id: 5,
      title: "Visa Appointment",
      subtitle: "Schedule appointment",
      icon: FaCalendarAlt,
    },
    {
      id: 6,
      title: "Successful",
      subtitle: "Journey complete",
      icon: FaTrophy,
    },
  ];

  // Determine if step is completed, current, or pending
  const getStatus = (stepId) => {
    if (stepId <= currentStep) return "completed";
    if (stepId === currentStep) return "inProgress";
    return "pending";
  };

  // Render the icon depending on status
  const renderIcon = (status, StepIcon) => {
    if (status === "completed") {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500 shadow-soft">
          <FaCheck className="text-white text-lg" />
        </div>
      );
    }

    if (status === "inProgress") {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-500 shadow-soft">
          <StepIcon className="text-white text-lg" />
        </div>
      );
    }

    // "pending"
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-appleGray-200 shadow-soft">
        <StepIcon className="text-appleGray-400 text-lg" />
      </div>
    );
  };

  return (
    <div className="w-full">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const status = getStatus(step.id);
          const isLastStep = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className="relative flex flex-col items-center flex-1"
            >
              {/* Step Icon */}
              <div className="flex flex-col items-center">
                {renderIcon(status, step.icon)}

                {/* Step Details */}
                <div className="mt-3 text-center">
                  <h3
                    className={`font-semibold text-sm ${
                      status === "completed"
                        ? "text-green-600"
                        : status === "inProgress"
                        ? "text-sky-600"
                        : "text-appleGray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-appleGray-500 mt-1">
                    {step.subtitle}
                  </p>
                  <span className="text-xs text-appleGray-400 mt-1 block">
                    Step {step.id}
                  </span>
                </div>
              </div>

              {/* Connecting line for all but the last step */}
              {!isLastStep && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 translate-x-6 ${
                    status === "completed"
                      ? "bg-green-500"
                      : status === "inProgress"
                      ? "bg-sky-500"
                      : "bg-appleGray-300"
                  }`}
                  style={{ zIndex: -1 }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
