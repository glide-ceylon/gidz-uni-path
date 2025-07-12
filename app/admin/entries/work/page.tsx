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
  const [staffMembers, setStaffMembers] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [workToAssign, setWorkToAssign] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user information
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/admin-auth/validate");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentUser(data.admin);
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Fetch work_visa data
  useEffect(() => {
    if (!currentUser) return;

    const fetchWorks = async () => {
      // First get the work visa data
      let query = supabase.from("work_visa").select("*");

      // If user is staff, only show assigned works
      if (currentUser.role === "staff") {
        query = query.eq("assigned_to", currentUser.id);
      }

      console.log("🔍 Fetching works with query:", query);
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      console.log("🔍 Raw work data from database:", data);

      // Get all unique assigned staff IDs
      const assignedStaffIds = data
        .filter((row) => row.assigned_to)
        .map((row) => row.assigned_to);

      console.log("🔍 Assigned staff IDs:", assignedStaffIds);

      // Fetch staff information for assigned works using API
      let staffData = [];
      if (assignedStaffIds.length > 0) {
        console.log("🔍 Fetching staff for IDs via API:", assignedStaffIds);
        try {
          const response = await fetch("/api/admin/staff/by-ids", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ staffIds: assignedStaffIds }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              staffData = result.staff;
              console.log("🔍 Fetched staff data via API:", staffData);
              console.log(
                "🔍 Staff IDs in fetched data:",
                staffData.map((s) => s.id)
              );
            } else {
              console.error("API error fetching staff:", result.error);
            }
          } else {
            console.error("HTTP error fetching staff:", response.status);
          }
        } catch (error) {
          console.error("Error fetching staff data via API:", error);
        }
      }

      // Process and combine the data
      const parsedData = [];

      for (const row of data) {
        const workData = JSON.parse(row.data); // Convert JSON string to object

        // Find assigned staff member
        let assignedStaff = staffData.find(
          (staff) => staff.id === row.assigned_to
        );

        // Debug staff lookup
        if (row.assigned_to) {
          console.log(`🔍 Looking for staff with ID: ${row.assigned_to}`);
          console.log(
            `🔍 Available staff IDs:`,
            staffData.map((s) => s.id)
          );
          console.log(`🔍 Staff match found:`, assignedStaff);

          // If not found in bulk fetch, try individual fetch via API
          if (!assignedStaff) {
            console.log(
              `🔍 Staff not found in bulk fetch, trying individual fetch for ${row.assigned_to}`
            );
            try {
              const response = await fetch("/api/admin/staff/by-ids", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ staffIds: [row.assigned_to] }),
              });

              if (response.ok) {
                const result = await response.json();
                if (result.success && result.staff.length > 0) {
                  assignedStaff = result.staff[0];
                  console.log(
                    `✅ Found staff via individual fetch:`,
                    assignedStaff
                  );
                } else {
                  console.log(`❌ No staff found for ID ${row.assigned_to}`);
                }
              } else {
                console.error(
                  `❌ HTTP error fetching individual staff ${row.assigned_to}:`,
                  response.status
                );
              }
            } catch (err) {
              console.error(`❌ Exception during individual staff fetch:`, err);
            }
          }
        }

        const processedWork = {
          id: row.id,
          assigned_to: row.assigned_to,
          assigned_staff: assignedStaff || null,
          assigned_at: row.assigned_at,
          assigned_by: row.assigned_by,
          ...workData,
          MarkasRead: workData.MarkasRead ?? false, // Default to false if missing
        };

        // Debug assignment info
        if (row.assigned_to) {
          console.log(`🔍 Work ${row.id} assignment info:`);
          console.log(`   assigned_to: ${row.assigned_to}`);
          console.log(`   assigned_staff:`, assignedStaff);
          console.log(`   assigned_at: ${row.assigned_at}`);
        }

        parsedData.push(processedWork);
      }

      console.log("🔍 Processed works:", parsedData);
      setWorks(parsedData);
      setFilteredWorks(parsedData);
    };

    fetchWorks();
  }, [currentUser]);

  // Fetch staff members for assignment (only for admin/super_admin)
  useEffect(() => {
    if (!currentUser || currentUser.role === "staff") return;

    const fetchStaffMembers = async () => {
      try {
        console.log("🔍 Fetching staff members...");
        const response = await fetch("/api/admin/staff");
        console.log("📡 Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("📊 Response data:", data);

          if (data.success) {
            console.log("✅ Setting staff members:", data.staff);
            setStaffMembers(data.staff);
          } else {
            console.error("❌ API returned success: false", data);
          }
        } else {
          console.error(
            "❌ Response not ok:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("❌ Error fetching staff members:", error);
      }
    };

    fetchStaffMembers();
  }, [currentUser]);

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

  // Open Assignment Modal
  const openAssignModal = (work) => {
    console.log("🔍 Opening assignment modal for work:", work);
    console.log("🔍 Current staff members:", staffMembers);
    console.log("🔍 Current user:", currentUser);
    setWorkToAssign(work);
    setSelectedStaffId(work.assigned_to || "");
    setIsAssignModalOpen(true);
  };

  // Assign Work to Staff
  const assignWork = async () => {
    if (!workToAssign || !selectedStaffId) return;

    try {
      const response = await fetch("/api/admin/assign-work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workId: workToAssign.id,
          staffId: selectedStaffId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the work in the local state
          setWorks((prevWorks) =>
            prevWorks.map((work) =>
              work.id === workToAssign.id
                ? {
                    ...work,
                    assigned_to: selectedStaffId,
                    assigned_staff: data.assignedStaff,
                    assigned_at: new Date().toISOString(),
                  }
                : work
            )
          );
          setIsAssignModalOpen(false);
          setWorkToAssign(null);
          setSelectedStaffId("");
        }
      }
    } catch (error) {
      console.error("Error assigning work:", error);
    }
  };

  // Unassign Work from Staff
  const unassignWork = async (workId) => {
    try {
      const response = await fetch("/api/admin/assign-work", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the work in the local state
          setWorks((prevWorks) =>
            prevWorks.map((work) =>
              work.id === workId
                ? {
                    ...work,
                    assigned_to: null,
                    assigned_staff: null,
                    assigned_at: null,
                  }
                : work
            )
          );
        }
      }
    } catch (error) {
      console.error("Error unassigning work:", error);
    }
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
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-appleGray-600">
              Loading work visa applications...
            </p>
          </div>
        </div>
      ) : (
        <>
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
                          <Icon
                            icon="material-symbols:work"
                            className="text-lg"
                          />
                          <span>Worker</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-appleGray-700">
                        <div className="flex items-center space-x-2">
                          <Icon
                            icon="material-symbols:mail"
                            className="text-lg"
                          />
                          <span>Email</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-appleGray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <Icon
                            icon="material-symbols:assignment-ind"
                            className="text-sm"
                          />
                          <span>Assignment</span>
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
                        <td className="px-4 py-3">
                          {(() => {
                            // Debug assignment display
                            console.log(
                              `🔍 Rendering assignment for work ${work.id}:`,
                              {
                                assigned_to: work.assigned_to,
                                assigned_staff: work.assigned_staff,
                                assigned_at: work.assigned_at,
                              }
                            );

                            if (work.assigned_staff) {
                              return (
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Icon
                                        icon="material-symbols:person-check"
                                        className="text-white text-xs"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-appleGray-800 text-sm truncate">
                                        {work.assigned_staff.first_name}{" "}
                                        {work.assigned_staff.last_name}
                                      </div>
                                      <div className="text-xs text-appleGray-500 truncate">
                                        {work.assigned_staff.role}
                                        {work.assigned_staff.department &&
                                          ` • ${work.assigned_staff.department}`}
                                      </div>
                                    </div>
                                    {currentUser?.role !== "staff" && (
                                      <button
                                        onClick={() => unassignWork(work.id)}
                                        className="text-red-400 hover:text-red-600 p-1 rounded transition-colors duration-200 flex-shrink-0"
                                        title="Unassign"
                                      >
                                        <Icon
                                          icon="material-symbols:close"
                                          className="text-sm"
                                        />
                                      </button>
                                    )}
                                  </div>
                                  {work.assigned_at && (
                                    <div className="text-xs text-appleGray-400">
                                      Assigned:{" "}
                                      {new Date(
                                        work.assigned_at
                                      ).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                currentUser?.role !== "staff" && (
                                  <button
                                    onClick={() => openAssignModal(work)}
                                    className="inline-flex items-center space-x-1 text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200"
                                  >
                                    <Icon
                                      icon="material-symbols:add"
                                      className="text-sm"
                                    />
                                    <span>Assign Staff</span>
                                  </button>
                                )
                              );
                            }
                          })()}
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
                            {currentUser?.role !== "staff" && (
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
                            )}
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
                      {searchTerm
                        ? "No workers found"
                        : currentUser?.role === "staff"
                        ? "No assigned applications"
                        : "No work applications yet"}
                    </h3>
                    <p className="text-appleGray-600">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : currentUser?.role === "staff"
                        ? "You haven't been assigned any work visa applications yet"
                        : "Work visa applications will appear here once submitted"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <>
          <ModalBackdrop onClick={() => setIsAssignModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
            <div className="bg-white rounded-3xl shadow-large border border-appleGray-200 w-full max-w-md">
              {/* Modal Header */}
              <div className="border-b border-appleGray-200 px-8 py-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-appleGray-800">
                    Assign Staff Member
                  </h2>
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
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
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Icon
                        icon="material-symbols:work"
                        className="text-white text-xl"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-appleGray-800">
                        {workToAssign?.firstName} {workToAssign?.lastName}
                      </div>
                      <div className="text-sm text-appleGray-600">
                        {workToAssign?.email}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-appleGray-700 mb-2">
                      Select Staff Member
                    </label>
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full px-4 py-3 bg-appleGray-100 border border-appleGray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Choose staff member...</option>
                      {(() => {
                        console.log(
                          "🔍 Rendering staff members:",
                          staffMembers
                        );
                        return staffMembers.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.first_name} {staff.last_name} - {staff.role}
                            {staff.department && ` (${staff.department})`}
                          </option>
                        ));
                      })()}
                    </select>
                    {staffMembers.length === 0 && (
                      <p className="text-sm text-red-500 mt-2">
                        No staff members available. Check console for errors.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={assignWork}
                    disabled={!selectedStaffId}
                    className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-appleGray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Assign Work
                  </button>
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
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
