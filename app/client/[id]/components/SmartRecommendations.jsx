import React, { useState, useEffect, useCallback } from "react";
import {
  FaLightbulb,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaGraduationCap,
  FaFileAlt,
  FaUniversity,
  FaPassport,
  FaCalendarAlt,
  FaChartLine,
  FaBolt,
  FaUserFriends,
  FaUniversity as FaBank,
  FaEnvelope,
  FaHome,
  FaLanguage,
  FaPlane,
  FaHeartbeat,
} from "react-icons/fa";

const SmartRecommendations = ({
  applicantData,
  applicationId,
  dashboardStats,
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [completedActions, setCompletedActions] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const generateRecommendations = useCallback(() => {
    setLoading(true);

    // Gidz Buddy Checklist - Fixed items that students should complete
    const gidzBuddyChecklist = [
      {
        id: "blocked-account",
        title: "Blocked Account - Expatrio",
        description:
          "Open a blocked account to show financial proof for your visa application",
        priority: 1,
        category: "finance",
        icon: FaBank,
        action: "Open Account",
        estimatedTime: "30 minutes",
        impact: "Critical",
        nextSteps: [
          "Visit Expatrio website",
          "Create account and verify identity",
          "Deposit required amount (approx. €11,208)",
          "Download account confirmation",
        ],
      },
      {
        id: "motivation-letter",
        title: "Motivation Letter",
        description:
          "Write a compelling motivation letter for your university applications",
        priority: 1,
        category: "documents",
        icon: FaEnvelope,
        action: "Write Letter",
        estimatedTime: "2 hours",
        impact: "High",
        nextSteps: [
          "Research the university and program",
          "Outline your academic and career goals",
          "Draft your motivation letter",
          "Review and get feedback",
        ],
      },
      {
        id: "find-accommodation",
        title: "Find Accommodation",
        description: "Secure housing for your stay in Germany before arrival",
        priority: 2,
        category: "housing",
        icon: FaHome,
        action: "Search Housing",
        estimatedTime: "1 hour",
        impact: "High",
        nextSteps: [
          "Check university dormitories",
          "Browse private housing platforms",
          "Contact landlords or housing services",
          "Submit accommodation applications",
        ],
      },
      {
        id: "german-language",
        title: "Tips for Learning German",
        description:
          "Start learning German to help with daily life and studies",
        priority: 3,
        category: "preparation",
        icon: FaLanguage,
        action: "Start Learning",
        estimatedTime: "Ongoing",
        impact: "Medium",
        nextSteps: [
          "Download language learning apps (Duolingo, Babbel)",
          "Find German language courses online or locally",
          "Practice with German media (movies, podcasts)",
          "Join German conversation groups",
        ],
      },
      {
        id: "book-flight",
        title: "Book Flight",
        description: "Book your flight to Germany after visa approval",
        priority: 2,
        category: "travel",
        icon: FaPlane,
        action: "Book Now",
        estimatedTime: "45 minutes",
        impact: "High",
        nextSteps: [
          "Compare flight prices on booking sites",
          "Check baggage allowances",
          "Book flight tickets",
          "Arrange airport pickup or transport",
        ],
      },
      {
        id: "health-insurance",
        title: "Health Insurance",
        description: "Get mandatory health insurance coverage for Germany",
        priority: 1,
        category: "insurance",
        icon: FaHeartbeat,
        action: "Get Insurance",
        estimatedTime: "1 hour",
        impact: "Critical",
        nextSteps: [
          "Research public vs private insurance options",
          "Compare insurance providers",
          "Apply for health insurance",
          "Get insurance confirmation letter",
        ],
      },
    ];

    setRecommendations(gidzBuddyChecklist);
    setLoading(false);
  }, [applicantData, dashboardStats]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const handleActionClick = (recId) => {
    setCompletedActions((prev) => new Set([...prev, recId]));
    // Here you would typically navigate to the relevant section or trigger an action
  };

  const getPriorityColor = (priority, urgent = false) => {
    if (urgent) return "bg-red-50 border-red-200";
    switch (priority) {
      case 1:
        return "bg-orange-50 border-orange-200";
      case 2:
        return "bg-yellow-50 border-yellow-200";
      case 3:
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityLabel = (priority, urgent = false) => {
    if (urgent) return { label: "URGENT", color: "text-red-600 bg-red-100" };
    switch (priority) {
      case 1:
        return { label: "HIGH", color: "text-orange-600 bg-orange-100" };
      case 2:
        return { label: "MEDIUM", color: "text-yellow-600 bg-yellow-100" };
      case 3:
        return { label: "LOW", color: "text-blue-600 bg-blue-100" };
      default:
        return { label: "INFO", color: "text-gray-600 bg-gray-100" };
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "Critical":
        return "text-red-600";
      case "High":
        return "text-orange-600";
      case "Medium":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
          <FaUserFriends className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-appleGray-800">
          Gidz Buddy Checklist
        </h3>
        <span className="text-sm text-appleGray-600">
          Essential steps for your journey
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl border border-green-200">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-green-800 mb-2">
            Checklist Complete!
          </h4>
          <p className="text-green-600">
            You&apos;ve completed all essential steps. Great job!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isCompleted = completedActions.has(rec.id);
            const priorityInfo = getPriorityLabel(rec.priority, rec.urgent);

            return (
              <div
                key={rec.id}
                className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-medium ${
                  isCompleted
                    ? "bg-green-50 border-green-200 opacity-75"
                    : getPriorityColor(rec.priority, rec.urgent)
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isCompleted ? "bg-green-500" : "bg-sky-500"
                      }`}
                    >
                      {isCompleted ? (
                        <FaCheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <FaCheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4
                          className={`text-lg font-semibold ${
                            isCompleted
                              ? "text-green-800"
                              : "text-appleGray-800"
                          }`}
                        >
                          {rec.title}
                        </h4>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${priorityInfo.color}`}
                        >
                          {priorityInfo.label}
                        </span>
                      </div>

                      <p className="text-appleGray-600 mb-4">
                        {rec.description}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-appleGray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <FaClock className="w-3 h-3" />
                          <span>{rec.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaChartLine className="w-3 h-3" />
                          <span className={getImpactColor(rec.impact)}>
                            {rec.impact} Impact
                          </span>
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-appleGray-700">
                          Next Steps:
                        </h5>
                        <ul className="space-y-1">
                          {rec.nextSteps.map((step, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2 text-sm text-appleGray-600"
                            >
                              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => handleActionClick(rec.id)}
                      className="ml-4 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>{rec.action}</span>
                      <FaArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
