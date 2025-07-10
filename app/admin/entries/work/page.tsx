"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Icon } from "@iconify/react";

// A reusable backdrop for modals
const ModalBackdrop = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
    onClick={onClick}
  />
);

const WorkQuery = () => {
  const [works, setWorks] = useState([]);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorks, setFilteredWorks] = useState([]);

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
        setFilteredWorks(parsedData);
      }
    };

    fetchWorks();
  }, []);

  // Filter works based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredWorks(works);
    } else {
      const filtered = works.filter(
        (work) =>
          work.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWorks(filtered);
    }
  }, [searchTerm, works]);

  // Toggle MarkasRead status
  const toggleMarkasRead = async (workId, currentStatus) => {
    // Find the work in the list
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
      .update({ data: JSON.stringify(updatedData) }) // Store JSON inside an array
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

    const { error } = await supabase
      .from("work_visa")
      .delete()
      .eq("id", workerToDelete);

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
    <div className="min-h-screen bg-appleGray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl font-bold mb-3 animate-fade-in">
                Work Visa Applications
              </h1>
              <p className="text-sky-100 text-lg animate-fade-in-up">
                Manage and track work visa application entries
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold">{works.length}</div>
                <div className="text-sky-100 text-sm">Total Applications</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {works.filter((w) => w.MarkasRead).length}
                </div>
                <div className="text-sky-100 text-sm">Read</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {works.filter((w) => !w.MarkasRead).length}
                </div>
                <div className="text-sky-100 text-sm">Unread</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icon
                  icon="material-symbols:search"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-appleGray-400 text-xl"
                />
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="text-sm text-appleGray-600">
              Showing {filteredWorks.length} of {works.length} applications
            </div>
          </div>
        </div>

        {/* Workers Table */}
        <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-appleGray-50 border-b border-appleGray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-appleGray-700">
                    <div className="flex items-center space-x-2">
                      <Icon icon="material-symbols:work" className="text-lg" />
                      <span>Worker</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-appleGray-700">
                    <div className="flex items-center space-x-2">
                      <Icon icon="material-symbols:mail" className="text-lg" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-appleGray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon
                        icon="material-symbols:mark-email-read"
                        className="text-lg"
                      />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-appleGray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-appleGray-200">
                {filteredWorks.map((work) => (
                  <tr
                    key={work.id}
                    className="hover:bg-appleGray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                          <Icon
                            icon="material-symbols:work"
                            className="text-white text-lg"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-appleGray-800">
                            {work.firstName} {work.lastName}
                          </div>
                          <div className="text-sm text-appleGray-600">
                            ID: {work.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-appleGray-800">{work.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!work.MarkasRead}
                          onChange={() =>
                            toggleMarkasRead(work.id, work.MarkasRead)
                          }
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-appleGray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                        <span className="ml-3 text-sm text-appleGray-700">
                          {work.MarkasRead ? "Read" : "Unread"}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => openNewTab(work)}
                          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-2xl transition-colors duration-200 flex items-center space-x-2 text-sm font-medium shadow-md hover:shadow-lg"
                        >
                          <Icon
                            icon="material-symbols:visibility"
                            className="text-lg"
                          />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => confirmDelete(work.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl transition-colors duration-200 flex items-center space-x-2 text-sm font-medium shadow-md hover:shadow-lg"
                        >
                          <Icon
                            icon="material-symbols:delete"
                            className="text-lg"
                          />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredWorks.length === 0 && (
              <div className="text-center py-12">
                <Icon
                  icon="material-symbols:search-off"
                  className="text-6xl text-appleGray-400 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-appleGray-700 mb-2">
                  {searchTerm ? "No workers found" : "No work applications yet"}
                </h3>
                <p className="text-appleGray-600">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Work visa applications will appear here once submitted"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <>
          <ModalBackdrop onClick={() => setIsDeleteModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
            <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 w-full max-w-md">
              {/* Modal Header */}
              <div className="border-b border-appleGray-200 px-8 py-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-appleGray-800">
                    Confirm Deletion
                  </h2>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-10 h-10 bg-appleGray-100 hover:bg-appleGray-200 rounded-2xl flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon
                      icon="material-symbols:close"
                      className="text-xl text-appleGray-600"
                    />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon
                      icon="material-symbols:warning"
                      className="text-2xl text-red-600"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-appleGray-800 mb-2">
                    Are you sure you want to delete this work application?
                  </h3>
                  <p className="text-appleGray-600">
                    This action cannot be undone. All worker data will be
                    permanently removed.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={deleteWorker}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 bg-appleGray-200 hover:bg-appleGray-300 text-appleGray-800 px-6 py-3 rounded-2xl font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkQuery;
