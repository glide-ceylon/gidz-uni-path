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
    const recs = [];
    const currentStep = parseInt(applicantData?.status?.slice(-1)) || 1;
    const currentDate = new Date();

    // Priority Level: 1 = High, 2 = Medium, 3 = Low

    // Document-related recommendations
    if (dashboardStats.documentsUploaded < 5) {
      recs.push({
        id: "upload-documents",
        title: "Complete Document Upload",
        description:
          "Upload remaining required documents to progress your application",
        priority: 1,
        category: "documents",
        icon: FaFileAlt,
        action: "Upload Now",
        estimatedTime: "15 minutes",
        impact: "High",
        nextSteps: [
          "Check document requirements list",
          "Scan or photograph documents",
          "Upload through document portal",
        ],
      });
    }

    // Payment recommendations
    if (!applicantData?.payment1 || !applicantData?.payment2) {
      recs.push({
        id: "complete-payments",
        title: "Complete Required Payments",
        description: "Process outstanding payments to avoid application delays",
        priority: 1,
        category: "payments",
        icon: FaCheckCircle,
        action: "Pay Now",
        estimatedTime: "10 minutes",
        impact: "Critical",
        nextSteps: [
          "Review payment requirements",
          "Choose payment method",
          "Process payment securely",
        ],
      });
    }

    // University application recommendations
    if (dashboardStats.universitiesApplied < 3 && currentStep >= 2) {
      recs.push({
        id: "apply-universities",
        title: "Apply to More Universities",
        description: "Increase your chances by applying to 3-5 universities",
        priority: 2,
        category: "universities",
        icon: FaUniversity,
        action: "Browse Universities",
        estimatedTime: "30 minutes",
        impact: "High",
        nextSteps: [
          "Research university rankings",
          "Check admission requirements",
          "Submit applications",
        ],
      });
    }

    // Progress-based recommendations
    if (currentStep === 1) {
      recs.push({
        id: "start-documents",
        title: "Begin Document Collection",
        description: "Start gathering required documents for your application",
        priority: 1,
        category: "getting-started",
        icon: FaGraduationCap,
        action: "Get Started",
        estimatedTime: "1 hour",
        impact: "High",
        nextSteps: [
          "Download document checklist",
          "Organize physical documents",
          "Begin scanning process",
        ],
      });
    }

    if (currentStep >= 3) {
      recs.push({
        id: "visa-preparation",
        title: "Prepare for Visa Interview",
        description: "Book visa appointment and prepare required documents",
        priority: 2,
        category: "visa",
        icon: FaPassport,
        action: "Schedule Interview",
        estimatedTime: "45 minutes",
        impact: "Critical",
        nextSteps: [
          "Check visa requirements",
          "Book appointment slot",
          "Prepare interview documents",
        ],
      });
    }

    // Time-sensitive recommendations
    const daysFromNow = (days) =>
      new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

    if (dashboardStats.nextDeadline) {
      const deadline = new Date(dashboardStats.nextDeadline);
      const daysUntilDeadline = Math.ceil(
        (deadline - currentDate) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilDeadline <= 30 && daysUntilDeadline > 0) {
        recs.push({
          id: "deadline-reminder",
          title: "Upcoming Deadline Alert",
          description: `University deadline in ${daysUntilDeadline} days`,
          priority: 1,
          category: "deadlines",
          icon: FaClock,
          action: "Review Requirements",
          estimatedTime: "20 minutes",
          impact: "Critical",
          nextSteps: [
            "Review application status",
            "Complete missing requirements",
            "Submit before deadline",
          ],
          urgent: true,
        });
      }
    }

    // Smart suggestions based on patterns
    if (dashboardStats.progressPercentage >= 75) {
      recs.push({
        id: "accommodation-planning",
        title: "Plan Your Accommodation",
        description: "Start looking for student housing options in Germany",
        priority: 3,
        category: "planning",
        icon: FaCalendarAlt,
        action: "Explore Options",
        estimatedTime: "1 hour",
        impact: "Medium",
        nextSteps: [
          "Research student dormitories",
          "Check private accommodation",
          "Apply for housing",
        ],
      });
    }

    // Personalized recommendations based on user behavior
    const lastLoginDays = 3; // This would come from real analytics
    if (lastLoginDays > 7) {
      recs.push({
        id: "catch-up",
        title: "Catch Up on Recent Updates",
        description: "Review recent messages and application updates",
        priority: 2,
        category: "updates",
        icon: FaBolt,
        action: "Review Updates",
        estimatedTime: "10 minutes",
        impact: "Medium",
        nextSteps: [
          "Check new messages",
          "Review status changes",
          "Update pending actions",
        ],
      });
    } // Sort by priority (1 = highest)
    recs.sort((a, b) => a.priority - b.priority);

    setRecommendations(recs);
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
          <FaLightbulb className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-appleGray-800">
          Smart Recommendations
        </h3>
        <span className="text-sm text-appleGray-600">
          AI-powered next steps
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl border border-green-200">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-green-800 mb-2">
            All Caught Up!
          </h4>
          <p className="text-green-600">
            You&apos;re on track. Keep up the great work!
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
                        <rec.icon className="w-6 h-6 text-white" />
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
