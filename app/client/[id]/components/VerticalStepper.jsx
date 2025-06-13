import React from "react";
import { Icon } from "@iconify/react";

export default function HorizontalStepper({ currentStep = 1 }) {
  // Define your four steps:
  const steps = [
    { id: 1, title: "Documents" },
    { id: 2, title: "University" },
    { id: 3, title: "Visa" },
    { id: 4, title: "Successful" },
  ];

  // Determine if step is completed, current, or pending
  const getStatus = (stepId) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "inProgress";
    return "pending";
  };

  // Render the Iconify icon depending on status
  const renderIcon = (status) => {
    if (status === "completed") {
      return (
        <div className="flex items-center justify-center lg:w-8 lg:h-8 rounded-full ring-4 ring-white  bg-green-200">
          <Icon icon="mdi:check" className="text-green-600 text-base" />
        </div>
      );
    }

    if (status === "inProgress") {
      return (
        <div className="flex items-center justify-center lg:w-8 lg:h-8 rounded-full ring-4 ring-white  bg-blue-100">
          <Icon icon="mdi:circle-slice-8" className="text-blue-600 text-base" />
        </div>
      );
    }

    // "pending"
    return (
      <div className="flex items-center justify-center lg:w-8 lg:h-8 rounded-full ring-4 ring-white  bg-gray-100">
        <Icon icon="mdi:dots-horizontal" className="text-gray-500 text-base" />
      </div>
    );
  };

  return (
    <ol className="flex items-center w-full lg:space-x-2 space-x-1 text-gray-500 ">
      {steps.map((step, index) => {
        const status = getStatus(step.id);
        const isLastStep = index === steps.length - 1;

        return (
          <li key={step.id} className="relative flex items-center">
            {/* Step Icon */}
            {renderIcon(status)}

            {/* Step Title */}
            <div className="lg:ml-2 lg:mr-4   flex flex-col">
              <h3 className="lg:font-medium leading-tight">
                {step.title}{" "}
                <span className="text-xs   text-gray-400">(Step {step.id})</span>
              </h3>
            </div>

            {/* Connecting line for all but the last step */}
            {!isLastStep && (
              <div className="flex-auto border-t-2 border-gray-300  lg:mx-2 mx-1" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
