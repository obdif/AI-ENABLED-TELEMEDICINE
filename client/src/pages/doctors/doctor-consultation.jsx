import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Mic, Download, Eye, Edit, MoreHorizontal, Calendar, Clock, ArrowRight, FileText, TrendingUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import axios from "axios";
import Consultant from "@/components/consultant";
import { DoctorHeader } from "@/components/layout/doctor-header";

export default function Consultation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setLocation] = useLocation();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [newConsultationPatient, setNewConsultationPatient] = useState(null);


  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleCloseRecordModal = () => {
    setIsRecordModalOpen(false);
    setNewConsultationPatient(null);
  };

  // Callback function to fetch consultations from the backend
  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorData = JSON.parse(localStorage.getItem("doctorData") || "{}");
      const doctorId = doctorData._id;
      const token = localStorage.getItem("doctorAuthToken");

      if (!doctorId || !token) {
        setError("Doctor ID or auth token missing. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://ilarocare-backend-production.up.railway.app/api/doctors/get-consultations`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Essential for authentication
          },
          params: { // If the backend expects doctorId as a query parameter
            doctorId: doctorId
          }
        }
      );

      if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
        const fetchedConsultations = response.data.data.map(con => {
          // Safely get patient and doctor names/IDs
          // Ensure your backend populates 'patient' with an object containing 'username'
          const patientName = con.patient?.username || con.patient || "Unknown Patient";
          const consultantName = con.doctor?.username || doctorData.username || "Unknown Doctor"; // Prioritize backend's doctor username if populated, else use localStorage

          // Generate customized consultation ID
          const customizedConsultationId = `CON-${con._id.substring(0, 5)}`;


          return {
            id: con._id, // Backend _id for unique key (used for routing)
            displayId: customizedConsultationId, // Custom ID for display in the table
            patientName: patientName, // This will be the username
            consultantId: con.doctor?._id || con.doctor || "N/A", // Doctor ID from backend (can be object or string)
            consultantName: consultantName,
            visitType: "General Consultation", // Default, or if your backend provides this
            dateCreated: new Date(con.createdAt).toLocaleDateString(), // Format date
            status: "Completed", // Default for fetched; if backend has status, use con.status
            duration: "N/A", // Add this to your backend's consultation model if needed
            symptoms: con.conversation ? con.conversation.substring(0, 50) + "..." : "No symptoms recorded", // Snippet
            diagnosis: "Auto-summarized", // Default, or from backend field
            fullConversation: con.conversation // Keep full conversation for detail view
          };
        });
        setConsultations(fetchedConsultations);
      } else {
        setError(response.data.message || "Failed to fetch consultations: Invalid response format.");
        setConsultations([]); // Ensure consultations is an empty array on error
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || `Error: ${err.response.status}`);
      } else {
        setError("An unexpected error occurred while fetching consultations.");
      }
      setConsultations([]); // Ensure consultations is an empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch consultations on component mount
  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const handleConsultationRecorded = (newConsultationData) => {
    fetchConsultations();
    setIsRecordModalOpen(false);
    setNewConsultationPatient(null);
  };

  // Dashboard statistics - update to use actual consultations data
  const stats = useMemo(() => ({
    totalConsultations: consultations.length,
    activeConsultations: consultations.filter((c) => c.status?.toLowerCase() === "in progress").length,
    completedConsultations: consultations.filter((c) => c.status?.toLowerCase() === "completed").length,
    scheduledConsultations: consultations.filter((c) => c.status?.toLowerCase() === "scheduled").length,
  }), [consultations]);

  // Filter and search functionality - use 'consultations' instead of 'consultationsData'
  const filteredData = useMemo(() => {
    let filtered = consultations.filter((consultation) => {
      // Adjusted search to include displayId
      const matchesSearch =
        (consultation.patientName && consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (consultation.consultantId && consultation.consultantId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (consultation.displayId && consultation.displayId.toLowerCase().includes(searchTerm.toLowerCase())) || // Search by customized ID
        (consultation.consultantName && consultation.consultantName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || (consultation.status && consultation.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Handle potential null/undefined values during sorting
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, statusFilter, sortConfig, consultations]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader onEmergencyModalOpen={handleEmergencyClick} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row mb-8 justify-between items-start sm:items-center">
          <div className="px-4 sm:px-0 mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-neutral-800 font-poppins">Consultation</h1>
            <p className="mt-1 text-sm text-neutral-600">Manage and monitor all consultation records.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 px-4 sm:px-0 w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-blue-600 text-white rounded-xl px-4 py-3 text-lg hover:bg-blue-700 border border-blue-600 flex items-center justify-center"
              onClick={() => {

                setIsRecordModalOpen(true);
              }}
            >
              <Mic className="mr-2 h-5 w-5" />
              Record New Consultation
            </Button>
          </div>
        </div>

        {/* Consultant Modal */}
        {isRecordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 sm:mx-auto">
              {/* Pass the handleConsultationRecorded callback and the newConsultationPatient */}
              {/* The `patient` and `doctor` props are crucial for the `Consultant` component */}
              <Consultant
                onClose={handleCloseRecordModal}
                onConsultationRecorded={handleConsultationRecorded}
                patient={newConsultationPatient?.id} // Pass patient ID to Consultant
                doctor={JSON.parse(localStorage.getItem("doctorData") || "{}")._id} // Pass doctor ID
              />
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledConsultations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, consultant ID, or consultation ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in progress">In Progress</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Export Button */}
            <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("displayId")} // Sort by the display ID
                  >
                    Consultation ID
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("patientName")}
                  >
                    Patient Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("consultantName")}
                  >
                    Consultant
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("visitType")}
                  >
                    Visit Type
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("dateCreated")}
                  >
                    Date Created
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("duration")}
                  >
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-blue-600">
                      Loading consultations...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-red-600">
                      Error: {error}
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No consultations found. Start by recording a new one!
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {consultation.displayId} {/* Display the customized ID here */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{consultation.patientName}</div>
                        <div className="text-sm text-gray-500">{consultation.symptoms}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900"> Dr. {consultation.consultantName}</div>
                        {/* <div className="text-sm text-gray-500">{consultation.consultantId}</div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.visitType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.dateCreated}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            consultation.status
                          )}`}
                        >
                          {consultation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {/* Updated Link component to include patientName and id */}
                          <Link href={`/doctor-consultation/${consultation.patientName}`}>
                            <button className="text-blue-600 hover:text-blue-900" title="View Details">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <button className="text-gray-600 hover:text-gray-900" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="More Options">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of{" "}
                  <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}