import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function EmergencyAlertModal({ isOpen, setIsOpen }) {
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchMode, setSearchMode] = useState("text");
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(
          "You are not authorized to access this feature. Redirecting to sign-in..."
        );
        setTimeout(() => {
          setLocation("/signin");
          setIsOpen(false);
        }, 2000);
      }
    }
  }, [isOpen, setLocation, setIsOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/png", "image/jpeg", "image/jpg"];
      if (!validFormats.includes(file.type)) {
        setError("Unsupported file format. Please upload PNG, JPG, or JPEG.");
        setFilePreview(null);
        setSelectedFile(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setSelectedFile(file);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please upload an image to search.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://127.0.0.1:8000/api/compare", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Compare API Response:", data);

      const patients = Array.isArray(data)
        ? data
        : data && data.data
          ? [data.data]
          : [];

      if (patients.length > 0) {
        const patient = patients[0];
        // console.log("Patient Details:", patient);
        if (patient.user && patient.user.username) {
          setLocation(`/patient-details/${patient.user.username}`);
          setIsOpen(false);
        } else {
          setError("Patient found, but username is missing.");
        }
      } else if (patients.length <= 0) {
        setError("No patient found with this image.");
      }
    } catch (err) {
      console.error("Error searching image:", err);

      if (
        (err.message && err.message.includes("NetworkError")) ||
        err.name === "TypeError"
      ) {
        setError(
          "Network error: Please check your internet connection or the server might be down."
        );
      } else if (
        (err.message && err.message.includes("Authorization")) ||
        err.message.includes("401")
      ) {
        setError("Unauthorized access. Please sign in again.");
        setTimeout(() => {
          setLocation("/signin");
          setIsOpen(false);
        }, 2000);
      } else if (err.message && err.message.includes("Failed to fetch")) {
        setError(
          "CORS error: The server is not configured to accept requests from this origin. Please contact the server administrator."
        );
      } else if (err.message && err.message.includes("502")) {
        setError(
          "Server error (502 Bad Gateway): The server is currently unavailable. Please try again later."
        );
      } else {
        setError(err.message || "Failed to search image. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a name, username, or email to search.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token missing. Please sign in.");
      }

      // Fetch all patients using the /api/users/all endpoint
      const url = "http://localhost:8080/api/users/all";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("All Patients API Response:", data);

      let patients = [];
      if (data && data.data && Array.isArray(data.data)) {
        patients = data.data
          .map((item) => {
            const userData = item.user || {};
            return {
              _id: userData._id || item._id,
              username: userData.username || item.username || "N/A",
              email: userData.email || item.email || "N/A",
              fullname: userData.fullname || item.fullname || "N/A",
              user: userData, // Preserve nested user object for username access
            };
          })
          .filter(Boolean);
      } else {
        throw new Error(
          "Unexpected response format: Expected an array of user objects in data."
        );
      }

      // Filter patients based on partial matches in fullname, username, or email
      const filteredPatients = patients.filter((patient) => {
        const queryLower = searchQuery.trim().toLowerCase();
        const fullnameMatch = patient.fullname
          ? patient.fullname.toLowerCase().includes(queryLower)
          : false;
        const usernameMatch = patient.username
          ? patient.username.toLowerCase().includes(queryLower)
          : false;
        const emailMatch = patient.email
          ? patient.email.toLowerCase().includes(queryLower)
          : false;
        return fullnameMatch || usernameMatch || emailMatch;
      });

      if (filteredPatients.length === 1) {
        const patient = filteredPatients[0];
        // console.log("Single Patient Match:", patient);
        if (patient.user && patient.user.username) {
          setLocation(`/patient-details/${patient.user.username}`);
          setIsOpen(false);
        } else {
          setError("Patient found, but username is missing.");
        }
      } else if (filteredPatients.length > 1) {
        // console.log("Multiple Patient Matches:", filteredPatients);
        // Store filtered patients in localStorage before redirecting
        localStorage.setItem(
          "filteredPatients",
          JSON.stringify(filteredPatients)
        );
        setLocation("/patient-table");
        setIsOpen(false);
      } else {
        setError("No patient found with this name, username, or email.");
      }
    } catch (err) {
      // console.error("Error searching by text:", err);

      if (
        (err.message && err.message.includes("NetworkError")) ||
        err.name === "TypeError"
      ) {
        setError(
          "Network error: Please check your internet connection or the server might be down."
        );
      } else if (
        (err.message && err.message.includes("Authorization")) ||
        err.message.includes("401")
      ) {
        setError("Unauthorized access. Please sign in again.");
        setTimeout(() => {
          setLocation("/signin");
          setIsOpen(false);
        }, 2000);
      } else if (err.message && err.message.includes("Failed to fetch")) {
        setError(
          "CORS error: The server is not configured to accept requests from this origin. Please contact the server administrator."
        );
      } else {
        setError(err.message || "Failed to search patient. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="bg-red-600 -m-6 mb-0 px-4 py-4 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-white">
            Emergency Alert
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {/* <div className="bg-red-600 flex justify-center -mt-6 p-1 text-white rounded">
            <button className="font-bold" onClick={() => setIsOpen(false)}>Close</button>
          </div> */}

          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogDescription className="text-base text-neutral-800 leading-6 text-center">
            Search for a patient to retrieve their health-related data.
            <br />
            <span className="text-sm text-neutral-600 block">
              Search by name, username, email, or upload a clear headshot of the
              patient.
            </span>
          </DialogDescription>
          {error && error.includes("Unauthorized") ? (
            <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          ) : (
            <div className="w-full">
              {/* Search Mode Toggle */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => {
                    setSearchMode("text");
                    setFilePreview(null);
                    setSelectedFile(null);
                    setError("");
                  }}
                  className={`px-4 py-2 rounded-l-md ${searchMode === "text"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  Search by Text
                </button>
                <button
                  onClick={() => {
                    setSearchMode("image");
                    setSearchQuery("");
                    setError("");
                  }}
                  className={`px-4 py-2 rounded-r-md ${searchMode === "image"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  Search by Image
                </button>
              </div>

              {searchMode === "text" ? (
                <form onSubmit={handleTextSearch} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search by name, username, or email"
                    className="w-full p-2 mb-1 lowercase border-2 border-red-500 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !searchQuery.trim()}
                    className={`w-full bg-blue-600 text-white py-3 rounded-lg ${isLoading || !searchQuery.trim()
                        ? "cursor-not-allowed bg-gray-400"
                        : "hover:bg-blue-900"
                      }`}
                  >
                    {isLoading ? "Searching..." : "Search by Text"}
                  </button>
                  {error && !error.includes("Unauthorized") && (
                    <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                </form>
              ) : (
                <form onSubmit={handleImageSearch} className="space-y-4">
                  <label
                    htmlFor="file-upload"
                    className="w-full h-60 flex items-center justify-center border-2 border-dashed border-red-500 rounded-xl cursor-pointer text-red-600 hover:bg-red-50 transition-all"
                  >
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <span className="text-6xl font-bold">+</span>
                        <span className="text-sm">
                          Search patient by uploading a clear headshot
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  {filePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilePreview(null);
                        setSelectedFile(null);
                      }}
                      className="w-full text-white bg-red-600 hover:bg-red-800 py-2 rounded-md transition-all"
                    >
                      Clear Image
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || !filePreview}
                    className={`w-full bg-blue-600 text-white py-3 rounded-lg ${isLoading || !filePreview
                        ? "cursor-not-allowed bg-gray-400"
                        : "hover:bg-blue-900"
                      }`}
                  >
                    {isLoading ? "Searching..." : "Search by Image"}
                  </button>
                  {error && !error.includes("Unauthorized") && (
                    <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                  <p className="text-sm flex mt-1 text-gray-600">
                    Supported formats: PNG, JPG & JPEG
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
