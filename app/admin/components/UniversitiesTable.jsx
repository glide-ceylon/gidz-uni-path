"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "../../../lib/supabase";

const BATCH_OPTIONS = ["Summer", "Winter"];
const STATUS_OPTIONS = ["Yes", "No", "Progress"];

const UniversitiesTable = ({ applicationId }) => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUni, setCurrentUni] = useState(null);
  const [newUni, setNewUni] = useState({
    uni_name: "",
    course: "",
    place: "",
    language: "",
    deadline: "",
    status: "",
  });

  // Fetch universities when component mounts or applicationId changes
  useEffect(() => {
    if (applicationId) {
      fetchUniversities(applicationId);
    }
  }, [applicationId]);

  const fetchUniversities = async (appId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .eq("application_id", appId)
      .order("deadline", { ascending: false });

    if (error) {
      console.error("Error fetching universities:", error.message);
      // Optionally, set a notification state here
    } else {
      setUniversities(data);
    }
    setLoading(false);
  };

  const handleAddUniversity = async () => {
    const { uni_name, course, place, language, deadline, status } = newUni;

    // Basic validation
    if (!uni_name || !course || !place || !language || !deadline || !status) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("universities")
        .insert([
          {
            application_id: applicationId,
            uni_name,
            course,
            deadline,
            place,
            language,
            status,
          },
        ])
        .select("*"); // Ensure response includes inserted row

      if (error) throw error;

      if (data && data.length > 0) {
        setUniversities((prev) =>
          [...prev, data[0]].sort((a, b) => b.deadline - a.deadline)
        );
      } else {
        console.error("No data returned after insert.");
      }

      // Reset form and close modal
      setNewUni({
        uni_name: "",
        course: "",
        deadline: "",
        place: "",
        language: "",
        status: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding university:", err.message);
    }
  };

  // Handle Delete University
  const handleDeleteUniversity = async (uniId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this university?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("universities")
      .delete()
      .eq("id", uniId);

    if (error) {
      console.error("Error deleting university:", error.message);
      alert("Failed to delete university. Please try again.");
    } else {
      // Update local state
      setUniversities(universities.filter((uni) => uni.id !== uniId));
    }
  };

  // Handle Edit University
  const handleEditUniversity = async () => {
    const { uni_name, course, place, language, deadline, status } = currentUni;

    // Basic validation
    if (!uni_name || !course || !place || !language || !deadline || !status) {
      alert("Please fill in all fields.");
      return;
    }

    const { error } = await supabase
      .from("universities")
      .update({
        uni_name,
        course,
        deadline,
        place,
        language,
        status,
      })
      .eq("id", currentUni.id);

    if (error) {
      console.error("Error updating university:", error.message);
      alert("Failed to update university. Please try again.");
    } else {
      // Update local state
      setUniversities(
        universities.map((uni) => (uni.id === currentUni.id ? currentUni : uni))
      );
      setShowEditModal(false);
      setCurrentUni(null);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Universities</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowAddModal(true)}
        >
          <Icon icon="mdi:plus" className="mr-2" />
          Add University
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading universities...</div>
      ) : universities.length === 0 ? (
        <div className="text-center">No universities found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">University Name</th>
                <th className="py-2 px-4 border-b">Course</th>
                <th className="py-2 px-4 border-b">Place</th>
                <th className="py-2 px-4 border-b">Language</th>
                <th className="py-2 px-4 border-b">Deadline</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((uni) => (
                <tr key={uni.id}>
                  <td className="py-2 px-4 border-b">{uni.uni_name}</td>
                  <td className="py-2 px-4 border-b">{uni.course}</td>
                  <td className="py-2 px-4 border-b">{uni.place}</td>
                  <td className="py-2 px-4 border-b">{uni.language}</td>
                  <td className="py-2 px-4 border-b">{uni.deadline}</td>
                  <td className="py-2 px-4 border-b">{uni.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => {
                        setCurrentUni({ ...uni });
                        setShowEditModal(true);
                      }}
                    >
                      <Icon icon="mdi:pencil" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteUniversity(uni.id)}
                    >
                      <Icon icon="mdi:delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==============================
              ADD UNIVERSITY MODAL
      ============================== */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-md relative">
            <h2 className="text-xl font-semibold mb-4">Add New University</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">
                  University Name:
                </label>
                <input
                  type="text"
                  value={newUni.uni_name}
                  onChange={(e) =>
                    setNewUni({ ...newUni, uni_name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Harvard University"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Course:</label>
                <input
                  type="text"
                  value={newUni.course}
                  onChange={(e) =>
                    setNewUni({ ...newUni, course: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Software Engineering"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Place:</label>
                <input
                  type="text"
                  value={newUni.place}
                  onChange={(e) =>
                    setNewUni({ ...newUni, place: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Berlin"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Language:</label>
                <input
                  type="text"
                  value={newUni.language}
                  onChange={(e) =>
                    setNewUni({ ...newUni, language: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., English"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Deadline:</label>
                <input
                  type="date"
                  value={newUni.deadline}
                  onChange={(e) =>
                    setNewUni({ ...newUni, deadline: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 2025-04-30"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Status:</label>
                <select
                  value={newUni.status}
                  onChange={(e) =>
                    setNewUni({ ...newUni, status: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select status</option>
                  <option value="progress">Progress</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleAddUniversity}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================
              EDIT UNIVERSITY MODAL
      ============================== */}
      {showEditModal && currentUni && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-md relative">
            <h2 className="text-xl font-semibold mb-4">Edit University</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">
                  University Name:
                </label>
                <input
                  type="text"
                  value={currentUni.uni_name}
                  onChange={(e) =>
                    setCurrentUni({ ...currentUni, uni_name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Harvard University"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Course:</label>
                <input
                  type="text"
                  value={currentUni.course}
                  onChange={(e) =>
                    setCurrentUni({ ...currentUni, course: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., software engineering"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Place:</label>
                <input
                  type="text"
                  value={currentUni.place}
                  onChange={(e) =>
                    setCurrentUni({ ...currentUni, place: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Berlin"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Language:</label>
                <input
                  type="text"
                  value={currentUni.language}
                  onChange={(e) =>
                    setCurrentUni({ ...currentUni, language: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., German"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Deadline:</label>
                <input
                  type="date"
                  value={currentUni.deadline}
                  onChange={(e) =>
                    setCurrentUni({ ...currentUni, deadline: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 2025-04-30"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Status:</label>
                <select
                  value={currentUni.status}
                  onChange={(e) =>
                    setCurrentUni({ ...currentUni, status: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select status</option>
                  <option value="progress">Progress</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentUni(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleEditUniversity}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversitiesTable;
