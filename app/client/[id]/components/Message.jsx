"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import useParams instead of relying on router.query
import { supabase } from "../../../../lib/supabase";

export default function Message() {
  const { id } = useParams(); // Extract the applicant's id from the URL parameters
  const [applicant, setApplicant] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!id) return; // Ensure id is available before fetching

    const fetchApplicant = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          id,
          first_name,
          status,
          messages(
            sent_by,
            application_id,
            message,
            created_at
          )
          `
        )
        .eq("id", id)
        .in("status", ["Step1", "Step2", "Step3"])
        .single(); // Expect a single record

      if (error) {
        console.error("Error fetching applicant:", error);
      } else {
        setApplicant(data);
      }
    };

    fetchApplicant();
  }, [id]);

  const sendMessage = async () => {
    if (applicant && newMessage.trim() !== "") {
      const { error } = await supabase.from("messages").insert([
        {
          sent_by: applicant.first_name, // Use the applicant's first name as the sender
          application_id: applicant.id,
          message: newMessage,
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
      } else {
        // Update local state by appending the new message
        applicant.messages.push({
          sent_by: applicant.first_name, // Use the applicant's first name here as well
          message: newMessage,
          created_at: new Date().toISOString(),
        });
        setNewMessage("");
        // Force a re-render with the updated messages array
        setApplicant({ ...applicant });
      }
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 h-[80vh] border border-gray-100">
      {applicant ? (
        <>
          <div className="p-4  bg-gray-500 text-white text-lg  font-semibold  ">
            Chat with Gidz Uni Path
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {applicant.messages?.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 max-w-xs rounded-lg ${
                  msg.sent_by === applicant.first_name
                    ? "bg-gray-500 text-white self-end ml-auto"
                    : "bg-white border border-gray-300"
                }`}
              >
                <strong>{msg.sent_by}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="p-4 bg-white flex items-center border-t border-gray-300">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          Loading...
        </div>
      )}
    </div>
  );
}
