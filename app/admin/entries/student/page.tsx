"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

const StudentQuery = () => {
  const [students, setStudents] = useState([]);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch student_visa data
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("student_visa").select("*");
  
      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        const parsedData = data.map((row) => {
          const studentData = JSON.parse(row.data); // Convert JSON string to object
          return {
            id: row.id,
            ...studentData,
            MarkasRead: studentData.MarkasRead ?? false, // Default to false if missing
          };
        });
        setStudents(parsedData);
      }
    };
  
    fetchStudents();
  }, []);
  

  // Toggle MarkasRead status
  const toggleMarkasRead = async (studentId, currentStatus) => {
    // Find the student in the list
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
  
    // Update MarkasRead value
    const updatedData = {
      ...student,
      MarkasRead: !currentStatus, // Toggle true/false
    };
  
    // Remove `id` before storing (since it's a separate column)
    delete updatedData.id;
  
    // ✅ Ensure JSON is properly stored as an array of a single string
    const { error } = await supabase
      .from("student_visa")
      .update({ data: [`${JSON.stringify(updatedData)}`] }) // Store JSON inside an array
      .eq("id", studentId);
  
    if (error) {
      console.error("Error updating MarkasRead:", error.message);
    } else {
      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s.id === studentId ? { ...s, MarkasRead: !currentStatus } : s
        )
      );
    }
  };
  
  

  // Open Delete Confirmation Modal
  const confirmDelete = (studentId) => {
    setStudentToDelete(studentId);
    setIsDeleteModalOpen(true);
  };

  // Delete Student
  const deleteStudent = async () => {
    if (!studentToDelete) return;

    const { error } = await supabase.from("student_visa").delete().eq("id", studentToDelete);

    if (error) {
      console.error("Error deleting student:", error.message);
    } else {
      setStudents(students.filter((student) => student.id !== studentToDelete));
    }

    // Close Modal
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  // Open New Tab with Student Details
  const openNewTab = (student) => {
    sessionStorage.setItem("selectedStudentId", student.id);
    window.open("/admin/entries/view-student", "_blank");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Visa Applications</h2>

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
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="p-3 border">{student.PersonalInformation?.FirstName}</td>
                <td className="p-3 border">{student.PersonalInformation?.LastName}</td>
                <td className="p-3 border">{student.ContactInformation?.Email}</td>
                {/* Mark as Read Checkbox */}
                <td className="p-3 border text-center">
                <input
                    title="Mark as Read"
                    type="checkbox"
                    checked={!!student.MarkasRead} // Ensure boolean value
                    onChange={() => toggleMarkasRead(student.id, student.MarkasRead)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-4">
                    {/* View Details Button */}
                    <button
                      onClick={() => openNewTab(student)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      View Details
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => confirmDelete(student.id)}
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
                onClick={deleteStudent}
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

export default StudentQuery;
