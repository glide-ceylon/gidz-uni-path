import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const GidzBuddyChecklistAdmin = () => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    item_id: "",
    title: "",
    description: "",
    priority: 1,
    category: "",
    icon: "FaLightbulb",
    action_text: "",
    estimated_time: "",
    impact: "Medium",
    youtube_link: "",
    youtube_title: "",
    next_steps: [],
    display_order: 0,
    is_active: true,
  });

  const iconOptions = [
    "FaBank",
    "FaEnvelope",
    "FaHome",
    "FaLanguage",
    "FaPlane",
    "FaHeartbeat",
    "FaGraduationCap",
    "FaFileAlt",
    "FaUniversity",
    "FaPassport",
    "FaCalendarAlt",
    "FaChartLine",
    "FaBolt",
    "FaUserFriends",
    "FaLightbulb",
  ];

  const categoryOptions = [
    "finance",
    "documents",
    "housing",
    "preparation",
    "travel",
    "insurance",
    "education",
    "legal",
    "health",
  ];

  const impactOptions = ["Critical", "High", "Medium", "Low"];

  useEffect(() => {
    fetchChecklistItems();
  }, []);

  const fetchChecklistItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gidz-buddy-checklist");
      const result = await response.json();

      if (result.success) {
        setChecklistItems(result.data);
      }
    } catch (error) {
      console.error("Error fetching checklist items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/gidz-buddy-checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchChecklistItems();
        resetForm();
        setShowAddForm(false);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error creating checklist item:", error);
      alert("Error creating checklist item");
    }
  };

  const resetForm = () => {
    setFormData({
      item_id: "",
      title: "",
      description: "",
      priority: 1,
      category: "",
      icon: "FaLightbulb",
      action_text: "",
      estimated_time: "",
      impact: "Medium",
      youtube_link: "",
      youtube_title: "",
      next_steps: [],
      display_order: 0,
      is_active: true,
    });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNextStepsChange = (value) => {
    const steps = value.split("\n").filter((step) => step.trim() !== "");
    setFormData((prev) => ({
      ...prev,
      next_steps: steps,
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gidz Buddy Checklist Management
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingItem ? "Edit Checklist Item" : "Add New Checklist Item"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Item ID
                </label>
                <input
                  type="text"
                  name="item_id"
                  value={formData.item_id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value={1}>High (1)</option>
                  <option value={2}>Medium (2)</option>
                  <option value={3}>Low (3)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Impact</label>
                <select
                  name="impact"
                  value={formData.impact}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {impactOptions.map((impact) => (
                    <option key={impact} value={impact}>
                      {impact}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Action Text
                </label>
                <input
                  type="text"
                  name="action_text"
                  value={formData.action_text}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Estimated Time
                </label>
                <input
                  type="text"
                  name="estimated_time"
                  value={formData.estimated_time}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 minutes, 2 hours"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  YouTube Link
                </label>
                <input
                  type="url"
                  name="youtube_link"
                  value={formData.youtube_link}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  YouTube Video Title
                </label>
                <input
                  type="text"
                  name="youtube_title"
                  value={formData.youtube_title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Next Steps (one per line)
              </label>
              <textarea
                value={formData.next_steps.join("\n")}
                onChange={(e) => handleNextStepsChange(e.target.value)}
                rows={4}
                placeholder="Step 1&#10;Step 2&#10;Step 3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <FaSave className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddForm(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <FaTimes className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Checklist Items List */}
      <div className="space-y-4">
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 1
                        ? "bg-red-100 text-red-800"
                        : item.priority === 2
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    Priority {item.priority}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                  {!item.is_active && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-3">{item.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                  <div>
                    <strong>Time:</strong> {item.estimatedTime}
                  </div>
                  <div>
                    <strong>Impact:</strong> {item.impact}
                  </div>
                  <div>
                    <strong>Icon:</strong> {item.icon}
                  </div>
                  <div>
                    <strong>Order:</strong> {item.displayOrder}
                  </div>
                </div>

                {item.youtubeLink && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 mb-3">
                    <FaExternalLinkAlt className="w-3 h-3" />
                    <a
                      href={item.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.youtubeTitle || "YouTube Guide"}
                    </a>
                  </div>
                )}

                {item.nextSteps.length > 0 && (
                  <div>
                    <strong className="text-sm">Next Steps:</strong>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {item.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setFormData({
                      item_id: item.id,
                      title: item.title,
                      description: item.description,
                      priority: item.priority,
                      category: item.category,
                      icon: item.icon,
                      action_text: item.action,
                      estimated_time: item.estimatedTime,
                      impact: item.impact,
                      youtube_link: item.youtubeLink || "",
                      youtube_title: item.youtubeTitle || "",
                      next_steps: item.nextSteps,
                      display_order: item.displayOrder,
                      is_active: true, // Since we're only showing active items
                    });
                    setShowAddForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GidzBuddyChecklistAdmin;
