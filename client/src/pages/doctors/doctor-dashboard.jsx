import { useState, useEffect, useCallback } from "react";
import { Calendar, Users, FileText, Clock, ArrowRight, Stethoscope, User, Eye, Plus, Search, Bell, LogOut, Activity, Heart, AlertTriangle, CheckCircle, Phone, Video, MessageSquare } from 'lucide-react';
import Logo from "@/components/logo";
import { Link, useLocation } from "wouter";
import EmergencyAlertModal from "@/components/emergency-alert-modal";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { DoctorHeader } from "@/components/layout/doctor-header";
import axios from "axios"; // Import axios
import Consultant from "@/components/consultant";
import CreatePatientModal from "@/components/create-patient-modal";


export default function DoctorDashboard() {
  const [consultations, setConsultations] = useState([]);
  const [patients, setPatients] = useState([]); // State to hold fetched patient data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [, setLocation] = useLocation();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const doctorData = JSON.parse(localStorage.getItem("doctorData")) || {};
  const doctorName = doctorData.name || doctorData.fullName || doctorData.username || "Doctor";
  const doctorSpecialization = doctorData.speciality || "General Practitioner";
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [newConsultationPatient, setNewConsultationPatient] = useState(null);
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);


  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleCloseRecordModal = () => {
    setIsRecordModalOpen(false);
    setNewConsultationPatient(null);
  };

  // --- Fetch Consultations ---
  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorId = doctorData._id;
      const token = localStorage.getItem("doctorAuthToken");

      if (!doctorId || !token) {
        setError("Doctor ID or auth token missing. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/doctors/get-consultations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            doctorId: doctorId
          }
        }
      );

      if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
        setConsultations(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch consultations: Invalid response format.");
        setConsultations([]);
      }
    } catch (err) {
      console.error("Error fetching consultations for dashboard:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || `Error: ${err.response.status}`);
      } else {
        setError("An unexpected error occurred while fetching consultations.");
      }
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [doctorData._id]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    const url = import.meta.env.VITE_API_BASE_URL
      ? `${import.meta.env.VITE_API_BASE_URL}/api/users/all`
      : "http://localhost:8080/api/users/all";
    try {
      const token = localStorage.getItem("doctorAuthToken");
      if (!token) {
        throw new Error("No authentication token found for patients. Please log in.");
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data.data && Array.isArray(response.data.data)) {
        const fetchedPatients = response.data.data.map(item => {
          const userData = item.user || item; // Handle cases where user data might be top-level or nested
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
            createdAt: userData.createdAt || item.createdAt || null, // Capture createdAt
            updatedAt: userData.updatedAt || item.updatedAt || null, // Capture updatedAt
            lastConsultationDate: item.lastConsultationDate || null,
          };
        }).filter(Boolean); // Filter out any null/undefined entries

        setPatients(fetchedPatients);
      } else {
        throw new Error("Unexpected response format: Expected an array of user objects in data.");
      }
    } catch (err) {
      console.error("Error fetching patients:", err.response ? err.response.data : err.message);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMsg || "Failed to fetch users. Please try again.");
    } finally {
      setLoading(false); // Make sure loading is set to false here after patients fetch
    }
  }, []);

  const handleConsultationRecorded = (newConsultationData) => {
    fetchConsultations(); // Re-fetch consultations to update the list
    setIsRecordModalOpen(false);
    setNewConsultationPatient(null);
  };

  useEffect(() => {
    fetchConsultations();
    fetchPatients(); // Call the new patient fetching function
  }, [fetchConsultations, fetchPatients]); // Depend on both fetch functions


  const handleLogout = () => {
    localStorage.removeItem("doctorAuthToken");
    localStorage.removeItem("doctorData");
    window.location.href = "/doctor-login";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calculate "Patients for Follow-up"
  // This logic assumes `consultations` contain `patient` objects with `_id` and `createdAt`
  // And `patients` array contains full patient objects with `_id`
  const calculatePatientsForFollowUp = () => {
    if (!consultations.length || !patients.length) return 0;

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const patientsWithRecentConsultation = new Set();

    consultations.forEach(consultation => {
      if (consultation.patient && consultation.createdAt) {
        const consultationDate = new Date(consultation.createdAt);
        if (consultationDate > thirtyDaysAgo) {
          patientsWithRecentConsultation.add(consultation.patient._id);
        }
      }
    });

    // Patients needing follow-up are those NOT in patientsWithRecentConsultation
    // This is a common interpretation, but you might adjust based on your specific criteria
    const patientsNeedingFollowUp = patients.filter(patient =>
      !patientsWithRecentConsultation.has(patient._id)
    ).length;

    return patientsNeedingFollowUp;
  };


  const stats = {
    totalConsultations: consultations.length,
    todayConsultations: consultations.filter(c => {
      const consultationDate = new Date(c.createdAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      return consultationDate === today;
    }).length,
    totalPatients: patients.length,
    patientsForFollowUp: calculatePatientsForFollowUp(), // New stat
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader onEmergencyModalOpen={handleEmergencyClick} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-gray-600">Welcome back, <strong> Dr. {doctorName}</strong>. Here's your medical practice overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Consultations Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? "..." : error ? "Error" : stats.todayConsultations}</p>
              </div>
            </div>
            <Link href="/doctor-consultations?filter=today">
              <a className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>

          {/* Total Consultations Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? "..." : error ? "Error" : stats.totalConsultations}</p>
              </div>
            </div>
            <Link href="/doctor-consultations">
              <a className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>

          {/* Total Patients Card - NOW  DATA */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? "..." : error ? "Error" : stats.totalPatients}</p>
              </div>
            </div>
            <Link href="/doctor-patients">
              <a className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>

          {/* Patients for Follow-up Card - REPLACED ACTIVE PATIENTS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg"> {/* Changed color to red for attention */}
                <AlertTriangle className="h-6 w-6 text-red-600" /> {/* Changed icon for attention */}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patients for Follow-up</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? "..." : error ? "Error" : stats.patientsForFollowUp}</p>
              </div>
            </div>
            {/* You'll need to create a route/filter for patients needing follow-up */}
            <Link href="/doctor-patients?filter=followup">
              <a className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>
        </div>


        {/* Quick Actions (unchanged) */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                variant="outline"
                onClick={() => {
                  setIsRecordModalOpen(true);
                }}
              >
                <a className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-blue-600 font-medium">New Consultation</span>
                </a>
              </button>

              {isRecordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 sm:mx-auto">
                    <Consultant
                      onClose={handleCloseRecordModal}
                      onConsultationRecorded={handleConsultationRecorded}
                      patient={newConsultationPatient?.id}
                      doctor={JSON.parse(localStorage.getItem("doctorData") || "{}")._id}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsCreatePatientOpen(true)}
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Plus className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-600 font-medium">New Patient</span>
              </button>
              <CreatePatientModal isOpen={isCreatePatientOpen} setIsOpen={setIsCreatePatientOpen} />

            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Consultations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Consultations</h3>
                  <Link href="/doctor-consultations">
                    <a className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </a>
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <p className="text-red-600 text-center">{error}</p>
                ) : consultations.length === 0 ? (
                  <p className="text-gray-500 text-center">No recent consultations found.</p>
                ) : (
                  <div className="space-y-4">
                    {consultations.slice(0, 3).map((consultation) => (
                      <div key={consultation._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{consultation.patient?.username || "Unknown Patient"}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status || "completed")}`}>
                                {consultation.status || "Completed"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Type:</span> {consultation.type || "General"}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Symptoms:</span> {consultation.conversation ? consultation.conversation.substring(0, 50) + "..." : "N/A"}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{new Date(consultation.createdAt).toLocaleDateString()} at {new Date(consultation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className={`font-medium ${getPriorityColor(consultation.priority || "normal")}`}>
                                {consultation.priority || "Normal"} Priority
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex space-x-2">
                            <Link href={`/doctor-consultation/${consultation.patient?.username}`}>
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View Details">
                                <Eye className="h-4 w-4" />
                              </button>
                            </Link>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Start Video Call">
                              <Video className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Summary (unchanged for this example) */}
          <div className="space-y-6">
            {/* Today's Schedule (can be updated to dynamically fetch from consultations) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {loading ? (
                    <p className="text-gray-500">Loading schedule...</p>
                  ) : error ? (
                    <p className="text-red-600">Error loading schedule.</p>
                  ) : stats.todayConsultations === 0 ? (
                    <p className="text-gray-500">No scheduled consultations for today.</p>
                  ) : (
                    consultations.filter(c => new Date(c.createdAt).toLocaleDateString() === new Date().toLocaleDateString())
                      .map(con => (
                        <div key={con._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{con.patient?.username || "Unknown Patient"}</p>
                            <p className="text-sm text-gray-600">{new Date(con.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {con.type || "General"}</p>
                          </div>
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Patients A */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {loading && patients.length === 0 ? (
                    <p className="text-gray-500">Loading recent patients...</p>
                  ) : error && patients.length === 0 ? (
                    <p className="text-red-600">Error loading recent patients.</p>
                  ) : patients.length === 0 ? (
                    <p className="text-gray-500 text-center">No recent patients found.</p>
                  ) : (
                    patients
                      .slice() // Create a shallow copy to avoid modifying the original state directly
                      .sort((a, b) => {
                        // Priority 1: updatedAt (most recent activity)
                        const dateAUpdatedAt = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                        const dateBUpdatedAt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

                        if (dateAUpdatedAt !== dateBUpdatedAt) {
                          return dateBUpdatedAt - dateAUpdatedAt; // Sort descending by updatedAt
                        }

                        // Priority 2: createdAt (if updatedAt is same or missing, use creation date)
                        const dateACreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateBCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0;

                        if (dateACreatedAt !== dateBCreatedAt) {
                          return dateBCreatedAt - dateACreatedAt; // Sort descending by createdAt
                        }

                        // Fallback: _id (as a very last resort, though less reliable for "latest" than timestamps)
                        // MongoDB _id contains a timestamp at its beginning.
                        const idDateA = new Date(parseInt(a._id.substring(0, 8), 16) * 1000).getTime();
                        const idDateB = new Date(parseInt(b._id.substring(0, 8), 16) * 1000).getTime();
                        return idDateB - idDateA; // Sort descending by _id creation time
                      })
                      .slice(0, 3) // Display only top 3 of the sorted patients
                      .map((patient) => (
                        <div key={patient._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {patient.image ? (
                                <img src={patient.image} alt={`${patient.fullname}'s profile`} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <User className="h-5 w-5 text-gray-600" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">{patient.fullname || patient.username}</p>
                              <p className="text-sm text-gray-600">
                                {/* Display last activity based on updatedAt, then createdAt, then lastConsultationDate */}
                                {patient.updatedAt
                                  ? `Last activity: ${new Date(patient.updatedAt).toLocaleDateString()}`
                                  : patient.createdAt
                                    ? `Added: ${new Date(patient.createdAt).toLocaleDateString()}`
                                    : patient.lastConsultationDate
                                      ? `Last seen: ${new Date(patient.lastConsultationDate).toLocaleDateString()}`
                                      : "N/A"}
                              </p>
                            </div>
                          </div>
                          <Link href={`/patient-detail/${patient.username}`}>
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Consultation Modal (unchanged) */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">New Consultation</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Start a new consultation session with a patient.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Start Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <EmergencyAlertModal
        isOpen={isEmergencyModalOpen}
        setIsOpen={setIsEmergencyModalOpen}
      />
    </div>
  );
}