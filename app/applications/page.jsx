"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/");
    } else {
      // Fetch forms data
      setApplications([{ name: "john", id: 32 }]);
      console.log("here");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <div
      style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Applications</h1>
      <button
        onClick={handleLogout}
        style={{
          padding: "5px 10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Logout
      </button>

      {applications.length > 0 ? (
        <ul style={{ textAlign: "left" }}>
          {applications.map((app) => (
            <li key={app.id} style={{ marginBottom: "10px" }}>
              <a
                href={`/applications/${app._id}`}
                style={{ color: "#0070f3", textDecoration: "underline" }}
              >
                {app.name}&#39;s Application
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading applications...</p>
      )}
    </div>
  );
}
