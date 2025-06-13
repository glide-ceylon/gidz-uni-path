import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "./../../../../lib/supabase";
import { Icon } from "@iconify/react";

const ApplicationOptions = ({
  applicationId,
  optionsToCheck,
  title = "Options",
}) => {
  const [options, setOptions] = useState(optionsToCheck || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for handling errors

  // Effect to update options when optionsToCheck prop changes
  useEffect(() => {
    if (optionsToCheck) {
      setOptions(optionsToCheck);
    }
  }, [optionsToCheck]);

  // Effect to fetch options from Supabase when applicationId changes
  useEffect(() => {
    if (!applicationId) return; // Guard clause if applicationId is not provided

    const fetchOptions = async () => {
      setLoading(true);
      setError(null); // Reset error state

      try {
        const { data, error } = await supabase
          .from("options")
          .select("name, option")
          .eq("application_id", applicationId);

        if (error) {
          console.error("Error fetching options:", error);
          setError("Failed to fetch options. Please try again.");
          return;
        }

        // Merge fetched data with existing options
        const updatedOptions = options.map((opt) => {
          const match = data.find((dbOption) => dbOption.name === opt.name);
          return match ? { ...opt, option: match.option } : opt;
        });

        setOptions(updatedOptions);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const handleCheckboxChange = async (name, checked) => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const { data, error } = await supabase
        .from("options")
        .select("id")
        .eq("application_id", applicationId)
        .eq("name", name);

      if (error) {
        console.error("Error checking existing option:", error);
        setError("Failed to update option. Please try again.");
        return;
      }

      if (data.length > 0) {
        // Update the existing option
        const { error: updateError } = await supabase
          .from("options")
          .update({ option: checked })
          .eq("id", data[0].id);

        if (updateError) {
          console.error("Error updating option:", updateError);
          setError("Failed to update option. Please try again.");
          return;
        }
      } else {
        // Insert a new option
        const { error: insertError } = await supabase.from("options").insert({
          application_id: applicationId,
          name,
          option: checked,
        });

        if (insertError) {
          console.error("Error inserting new option:", insertError);
          setError("Failed to insert new option. Please try again.");
          return;
        }
      }

      // Update the local state
      setOptions((prevOptions) =>
        prevOptions.map((opt) =>
          opt.name === name ? { ...opt, option: checked } : opt
        )
      );
    } catch (err) {
      console.error("Error handling checkbox change:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto mt-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 ">{title}</h3>

      {loading && <p className="text-center text-blue-500 mb-4">Loading...</p>}

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <ul className="space-y-4">
        {options.length > 0 ? (
          options.map((opt) => (
            <li
              key={opt.name}
              className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-sm"
            >
              <span className="text-gray-700 font-medium">{opt.name}</span>
              <label className="flex items-center space-x-2">
                {opt.option && (
                  <Icon icon="mdi:check" className="text-green-500" />
                )}
              </label>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No options available.</p>
        )}
      </ul>
    </div>
  );
};

ApplicationOptions.propTypes = {
  applicationId: PropTypes.string.isRequired,
  optionsToCheck: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      option: PropTypes.bool.isRequired,
    })
  ),
};

ApplicationOptions.defaultProps = {
  optionsToCheck: [],
};

export default ApplicationOptions;
