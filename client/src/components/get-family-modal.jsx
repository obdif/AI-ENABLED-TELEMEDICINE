import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";



const FamilyMedicalModal = ({ isOpen, setIsOpen, username }) => {
  const [medicalInfo, setMedicalInfo] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("doctorAuthToken");
      if (!token) throw new Error("No authentication token found");

      const apiResponse = await axios.post(
        "https://ilarocare-backend-production.up.railway.app/api/pack/summarize-history",
        { username, medicalInfo },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setResponse(apiResponse.data);

      setMedicalInfo("");
    } catch (error) {
      console.error("Error fetching family medical records:", error);
      setError(error.response?.data?.error?.message || error.message || "Failed to fetch family medical records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMedicalInfo("");
    setResponse(null);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-modal-title"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg transform transition-transform duration-300 scale-100">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 id="family-modal-title" className="text-xl font-semibold text-gray-800 mb-4 font-poppins">
          Family Medical Records
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={medicalInfo}
              onChange={(e) => setMedicalInfo(e.target.value)}
              placeholder="Enter medical issue (e.g., hypertension)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 py-2 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Get Records"
            )}
          </Button>
        </form>

        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Family Medical Summary:</h3>
            <div className="text-gray-600 mt-2">
              <ReactMarkdown>{response.data?.summary || "No data found"}</ReactMarkdown>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-700">Error:</h3>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMedicalModal;