import React, { useState, useEffect, useCallback } from "react";
import { FaUserFriends, FaCheckCircle, FaStar, FaPlay } from "react-icons/fa";

const SmartRecommendations = ({
  applicantData,
  applicationId,
  dashboardStats,
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateRecommendations = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch checklist items from the API
      const response = await fetch("/api/gidz-buddy-checklist");
      const result = await response.json();

      if (result.success && result.data) {
        setRecommendations(result.data);
      } else {
        console.error("Failed to fetch checklist:", result.error);
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching checklist:", error);
      setRecommendations([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const handleWatchVideo = (youtubeLink) => {
    if (youtubeLink) {
      window.open(youtubeLink, "_blank", "noopener,noreferrer");
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
            return (
              <div
                key={rec.id}
                className="p-6 rounded-3xl border transition-all duration-300 hover:shadow-medium bg-white border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sky-500">
                      <FaCheckCircle className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-appleGray-800">
                          {rec.title}
                        </h4>
                      </div>

                      <p className="text-appleGray-600 mb-4">
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4">
                    {rec.youtube_link && (
                      <button
                        onClick={() => handleWatchVideo(rec.youtube_link)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                      >
                        <FaPlay className="w-3 h-3" />
                        <span>Watch Video</span>
                      </button>
                    )}
                  </div>
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
