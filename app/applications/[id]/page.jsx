"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicationDetails() {
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingPassword, setCreatingPassword] = useState(false);

  useEffect(() => {
    const queryId = window.location.pathname.split("/").pop();

    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/");
    } else if (queryId) {
      fetchData(queryId);
    }
  }, [router]);

  const fetchData = (id) => {
    setLoading(true);
    setError("");

    setApplication({
      _id: {
        $oid: "67616af473a09e3efa6424aa",
      },
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1999-05-15",
      mobileNumber: "+1234567890",
      email: "john.doe@example.com",
      bachelorOrMasterDegreeCertificate: "bachelor_degree.pdf",
      vocationalTrainingCertificates: "vocational_certificates.pdf",
      regulatedProfessionAuthorization: "regulated_profession.pdf",
      cv: "john_doe_cv.pdf",
      germanLanguageLevel: "B1",
      englishLanguageLevel: "C1 or higher/Native",
      yearsOfProfessionalExperience: "2-5 years",
      experienceTimeline: "In last 5 years",
      previousStayInGermany: "6+ months in last 5 years",
      applyingWithSpouse: true,
      aboutYouAndYourNeeds:
        "I am seeking opportunities to work in Germany as a skilled professional in the healthcare field. I require assistance in understanding the visa and relocation process.",
      password: "qwnzcenm",
    });
  };

  const handleAddPassword = async () => {
    setCreatingPassword(true);
    setError("");

    try {
      fetchData(queryId); // Refresh the data
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setCreatingPassword(false);
    }
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") {
      return Array.isArray(value) ? (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      ) : (
        <table>
          <tbody>
            {Object.entries(value).map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{renderValue(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return value;
  };

  return (
    <div>
      <h1>Application Details</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {application && (
        <div>
          <table>
            <tbody>
              {Object.entries(application).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{renderValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Show "Add Password" button if no password */}
          {!application.password && (
            <button
              onClick={handleAddPassword}
              disabled={creatingPassword}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {creatingPassword ? "Creating..." : "Add Password"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
