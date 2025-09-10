import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { DoctorHeader } from "@/components/layout/doctor-header";
import { ArrowRight, Search, Eye, Edit, Plus } from "lucide-react";
import axios from "axios";
import CreatePatientModal from "@/components/create-patient-modal";


const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date("2025-06-05");
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1;
  }
  return age;
};

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setLocation] = useLocation();
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      const url = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/users/all`
        : "http://localhost:8080/api/users/all";
      try {
        const token = localStorage.getItem("doctorAuthToken");
        // console.log("Fetching from:", url, "with token:", token);
        if (!token) {
          throw new Error("No authentication token found. Redirecting to sign-in...");
        }

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        // console.log("Patients API Response:", response.data);

        let fetchedPatients = [];
        if (response.data.data && Array.isArray(response.data.data)) {

          fetchedPatients = response.data.data.map(item => {
            const userData = item.user || {};
            return {
              _id: userData._id || item._id,
              username: userData.username || item.username || "N/A",
              email: userData.email || item.email || "N/A",
              fullname: userData.fullname || item.fullname || "N/A",
              phoneNumber: item.phoneNumber || "Not provided",
              dateOfBirth: item.dateOfBirth || null,
              gender: item.gender || "N/A",
              bloodGroup: item.bloodGroup || "N/A",
              image: item.image || null,
              updatedAt: item.updatedAt || userData.updatedAt || null,
            };
          }).filter(Boolean);


          fetchedPatients.sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return dateB - dateA;
          });

        } else {
          throw new Error("Unexpected response format: Expected an array of user objects in data.");
        }

        if (fetchedPatients.length === 0) {
          // console.warn("No users found in response.");
        }
        setPatients(fetchedPatients);
      } catch (err) {
        // console.error("Error fetching patients:", err.response ? err.response.data : err.message);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        setError(errorMsg || "Failed to fetch users. Please try again.");
        if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
          setTimeout(() => setLocation("/doctor-login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Search patients by full name and email
  const filteredPatients = patients.filter((patient) => {
    const fullnameMatch = patient.fullname
      ? patient.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const emailMatch = patient.email
      ? patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return fullnameMatch || emailMatch;
  });

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader onEmergencyClick={handleEmergencyClick} />

      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Patient List</h1>
            <p className="text-gray-600">Total Patients: {patients.length}</p>
          </div>
          <Button
            onClick={() => setIsCreatePatientOpen(true)}
            className="bg-blue-600 rounded-xl hover:bg-blue-700 text-white px-4 py-2">
            <Plus className="mr-2 h-5 w-5" />
            Add New Patient
          </Button>
          <CreatePatientModal isOpen={isCreatePatientOpen} setIsOpen={setIsCreatePatientOpen} />

        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by full name or email..."
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
            <p className="text-gray-600">Loading patients...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
            {error.includes("unauthenticated") && (
              <p className="text-gray-500 mt-2">Redirecting to sign-in in 2 seconds...</p>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="rounded">
                <tr className="bg-blue-800 text-white">
                  <th className="p-3">Image</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <tr key={patient._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        {patient.image ? (
                          <img src={patient.image} alt={`${patient.fullname}'s profile`} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">{patient.username ? patient.username.charAt(0).toUpperCase() : 'N/A'}</div>
                        )}
                      </td>
                      <td className="p-3">{patient.email}</td>
                      <td className="p-3">{patient.fullname}</td>
                      <td className="p-3">{patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : "N/A"}</td>
                      <td className="p-3">{patient.gender}</td>
                      <td className="p-3">{patient.phoneNumber}</td>
                      <td className="p-3">{patient.bloodGroup}</td>
                      <td className="p-3">
                        {patient.updatedAt
                          ? new Date(patient.updatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                          : "N/A"}
                      </td>
                      <td className="p-3 flex space-x-2">
                        <Link href={`/patient-detail/${patient.username}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/patient-edit/${patient.username}`}>
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
                      No users found.
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