"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

const WorkQuery = () => {
  const [works, setWorks] = useState([]);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch work_visa data
  useEffect(() => {
    const fetchWorks = async () => {
      const { data, error } = await supabase.from("work_visa").select("*");

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        const parsedData = data.map((row) => {
          const workData = JSON.parse(row.data); // Convert JSON string to object
          return {
            id: row.id,
            ...workData,
            MarkasRead: workData.MarkasRead ?? false, // Default to false if missing
          };
        });
        setWorks(parsedData);
      }
    };

    fetchWorks();
  }, []);

   // Toggle MarkasRead status
    const toggleMarkasRead = async (workId, currentStatus) => {
      // Find the student in the list
      const work = works.find((s) => s.id === workId);
      if (!work) return;
    
      // Update MarkasRead value
      const updatedData = {
        ...work,
        MarkasRead: !currentStatus, // Toggle true/false
      };
    
      // Remove `id` before storing (since it's a separate column)
      delete updatedData.id;
    
      // ✅ Ensure JSON is properly stored as an array of a single string
      const { error } = await supabase
        .from("work_visa")
        .update({ data:JSON.stringify(updatedData) }) // Store JSON inside an array
        .eq("id", workId);
    
      if (error) {
        console.error("Error updating MarkasRead:", error.message);
      } else {
        setWorks((prevWorks) =>
          prevWorks.map((s) =>
            s.id === workId ? { ...s, MarkasRead: !currentStatus } : s
          )
        );
      }
    };

  // Open Delete Confirmation Modal
  const confirmDelete = (workerId) => {
    setWorkerToDelete(workerId);
    setIsDeleteModalOpen(true);
  };

  // Delete Worker
  const deleteWorker = async () => {
    if (!workerToDelete) return;

    const { error } = await supabase.from("work_visa").delete().eq("id", workerToDelete);

    if (error) {
      console.error("Error deleting worker:", error.message);
    } else {
      setWorks(works.filter((work) => work.id !== workerToDelete));
    }

    // Close Modal
    setIsDeleteModalOpen(false);
    setWorkerToDelete(null);
  };

  // Open WorkDetails in a new tab
  const openNewTab = (work) => {
    sessionStorage.setItem("selectedWorkId", work.id);
    window.open("/admin/entries/view-work", "_blank");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Work Visa Applications</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">First Name</th>
              <th className="p-3 border">Last Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Mark as Read</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id} className="hover:bg-gray-100">
                <td className="p-3 border">{work.firstName}</td>
                <td className="p-3 border">{work.lastName}</td>
                <td className="p-3 border">{work.email}</td>
                <td className="p-3 border text-center">
                <input
                    title="Mark as Read"
                    type="checkbox"
                    checked={!!work.MarkasRead} // Ensure boolean value
                    onChange={() => toggleMarkasRead(work.id, work.MarkasRead)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-8">
                    {/* View Details Button */}
                    <button
                      onClick={() => openNewTab(work)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      View Details
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => confirmDelete(work.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 w-24"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteWorker}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkQuery;
