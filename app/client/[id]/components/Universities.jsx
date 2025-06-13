"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const Universities = ({ applicationId }) => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } else {
      setUniversities(data);
    }
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Universities</h2>

      {loading ? (
        <div className="text-center">Loading universities...</div>
      ) : universities.length === 0 ? (
        <div className="text-center">No universities found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">University Name</th>
                <th className="py-2 px-4 border-b text-left">Course</th>
                <th className="py-2 px-4 border-b text-left">Place</th>
                <th className="py-2 px-4 border-b text-left">Language</th>
                <th className="py-2 px-4 border-b text-left">Deadline</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Universities;
