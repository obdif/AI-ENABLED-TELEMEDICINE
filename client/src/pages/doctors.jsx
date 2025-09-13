import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { ArrowRight, Search, Eye, Edit, Plus } from "lucide-react";
import axios from "axios";

// Function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date("2025-06-03"); // Updated to current date
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1;
  }
  return age;
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(10);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setLocation] = useLocation();

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      const url = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/hospitals/get-doctors`
        : "https://ilarocare-backend-production.up.railway.app/api/hospitals/get-doctors";
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Redirecting to sign-in...");
        }

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let fetchedDoctors = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          fetchedDoctors = response.data.data.map((doctor) => ({
            _id: doctor._id || "N/A",
            fullName: doctor.fullName || "N/A",
            username: doctor.username || "N/A",
            email: doctor.email || "N/A",
            speciality: doctor.speciality || "N/A",
            gender: doctor.gender || "N/A",
            phoneNumber: doctor.phoneNumber || "Not provided",
            dateOfBirth: doctor.dateOfBirth || null,
            bio: doctor.bio || "N/A",
            image: doctor.image || null,
            updatedAt: doctor.updatedAt || null,
          })).filter(Boolean);

          // Sort doctors by updatedAt in descending order (most recent first)
          fetchedDoctors.sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
            return dateB - dateA;
          });
        } else {
          throw new Error("Unexpected response format: Expected an array of doctor objects in data.");
        }

        if (fetchedDoctors.length === 0) {
          console.warn("No doctors found in response.");
        }
        setDoctors(fetchedDoctors);
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        setError(errorMsg || "Failed to fetch doctors. Please try again.");
        if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
          setTimeout(() => setLocation("/signin"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [setLocation]);

  // Search doctors by full name, email, and speciality
  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameMatch = doctor.fullName
      ? doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const emailMatch = doctor.email
      ? doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const specialityMatch = doctor.speciality
      ? doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return fullNameMatch || emailMatch || specialityMatch;
  });

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onEmergencyClick={handleEmergencyClick} />

      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Doctor List</h1>
            <p className="text-gray-600">Total Doctors: {doctors.length}</p>
          </div>
          <Link href="/hospital/create-doctor">
            <Button className="bg-blue-600 rounded-xl hover:bg-blue-700 text-white px-4 py-2">
              <Plus className="mr-2 h-5 w-5" />
              Add New Doctor
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by full name, email, or speciality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={loading || !!error}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
            {error.includes("unauthenticated") && (
              <p className="text-gray-500 mt-2">Redirecting to sign-in...</p>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Doctors Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="rounded">
                <tr className="bg-blue-800 text-white">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Speciality</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.length > 0 ? (
                  currentDoctors.map((doctor) => (
                    <tr key={doctor._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        {doctor.image ? (
                          <img
                            src={doctor.image}
                            alt={`${doctor.fullName}'s profile`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                            {doctor.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="p-3">{doctor.email}</td>
                      <td className="p-3">Dr. {doctor.fullName}</td>
                      <td className="p-3">{doctor.speciality}</td>
                      <td className="p-3">{doctor.gender}</td>
                      <td className="p-3">{doctor.phoneNumber}</td>
                      <td className="p-3">
                        {doctor.dateOfBirth ? calculateAge(doctor.dateOfBirth) : "N/A"}
                      </td>
                      <td className="p-3">
                        {doctor.updatedAt
                          ? new Date(doctor.updatedAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                          : "N/A"}
                      </td>
                      <td className="p-3 flex space-x-2">
                        <Link href={`/doctor-details/${doctor.username}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/edit-doctor/${doctor.username}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-3 text-center text-gray-600">
                      No doctors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="mt-6 flex justify-between items-center">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 disabled:bg-gray-400"
            >
              Previous
            </Button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 disabled:bg-gray-400"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}