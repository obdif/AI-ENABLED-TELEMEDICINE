import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { File, Eye, Mic, LogOut, Plus, ArrowRight, MapPin, AlertTriangle, Users, ShieldAlert, Activity, Bell, Users2, User2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import Consultant from "../components/consultant";

export default function Dashboard() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [patients, setPatients] = useState([]);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [consultationsCount, setConsultationsCount] = useState(0);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true); // New loading state for consultations
  const [errorPatients, setErrorPatients] = useState(null);
  const [errorDoctors, setErrorDoctors] = useState(null);
  const [errorConsultations, setErrorConsultations] = useState(null); // New error state for consultations

  const hospitalData = JSON.parse(localStorage.getItem("hospitalData")) || {};
  const hospitalName = hospitalData.name || "Hospital";

  // --- Fetch Patients ---
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      setErrorPatients(null);
      const url = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/users/all`
        : "https://ilarocare-backend-production.up.railway.app/api/users/all";
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Redirecting to sign-in...");
        }

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        let fetchedPatients = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          fetchedPatients = response.data.data.map(item => {
            const userData = item.user || {}; // Assuming user details might be nested
            return {
              _id: userData._id || item._id,
              username: userData.username || item.username || "N/A",
              email: userData.email || item.email || "N/A",
              fullname: userData.fullname || item.fullname || "N/A",
              phoneNumber: item.phoneNumber || "Not provided",
              dateOfBirth: item.dateOfBirth || null,
              gender: item.gender || "N/A",
              bloodGroup: item.bloodGroup || "N/A",
              genotype: item.genotype || "N/A",
              image: item.image || null,
              updatedAt: item.updatedAt || userData.updatedAt || null,
            };
          }).filter(Boolean);

          fetchedPatients.sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
            return dateB - dateA;
          });
        } else {
          throw new Error("Unexpected response format: Expected an array of user objects in data.");
        }

        setPatients(fetchedPatients);
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        setErrorPatients(errorMsg || "Failed to fetch users. Please try again.");
        if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
          // It's good practice to clear token if it's invalid
          localStorage.removeItem("authToken");
          setTimeout(() => setLocation("/signin"), 2000);
        }
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [setLocation]);


  // --- Fetch Doctors Count ---
  useEffect(() => {
    const fetchDoctorsCount = async () => {
      setLoadingDoctors(true);
      setErrorDoctors(null);
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

        if (response.data.data && Array.isArray(response.data.data)) {
          setDoctorsCount(response.data.data.length);
        } else {
          throw new Error("Unexpected response format: Expected an array of doctor objects in data.");
        }
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        setErrorDoctors(errorMsg || "Failed to fetch doctors count. Please try again.");
        if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
          localStorage.removeItem("authToken");
          setTimeout(() => setLocation("/signin"), 2000);
        }
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctorsCount();
  }, [setLocation]);

  // --- Fetch Consultations Count (Updated for Hospital Dashboard) ---
  useEffect(() => {
    const fetchConsultationsCount = async () => {
      setLoadingConsultations(true);
      setErrorConsultations(null);
      // *** IMPORTANT: Update this URL to your hospital-specific endpoint for all consultations ***
      // This is a placeholder. You NEED to implement this endpoint on your backend.
      const url = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/hospitals/get-all-consultations` // <--- CHANGE THIS ENDPOINT
        : "https://ilarocare-backend-production.up.railway.app/api/hospitals/get-all-consultations"; // <--- CHANGE THIS ENDPOINT

      try {
        const token = localStorage.getItem("authToken"); // Assuming the same authToken works for hospital
        if (!token) {
          throw new Error("No authentication token found. Redirecting to sign-in...");
        }

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          setConsultationsCount(response.data.data.length);
        } else {
          throw new Error(response.data.message || "Unexpected response format: Expected an array of consultation objects in data.");
        }
      } catch (err) {
        console.error("Error fetching all consultations for hospital:", err); // Log the full error
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        setErrorConsultations(errorMsg || "Failed to fetch consultations count. Please try again.");
        if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
          localStorage.removeItem("authToken");
          setTimeout(() => setLocation("/signin"), 2000);
        }
      } finally {
        setLoadingConsultations(false);
      }
    };

    fetchConsultationsCount();
  }, [setLocation]); // Depend on setLocation for potential redirect

  const familyLocations = [
    {
      id: "2",
      name: "Adegbola Family",
      initials: "AF",
      location: "Agege, Lagos",
      lastUpdated: "5m ago",
      status: "online",
      color: "#4CAF50",
    },
    {
      id: "3",
      name: "Emma Chen",
      initials: "EC",
      location: "School",
      lastUpdated: "10m ago",
      status: "online",
      color: "#9C27B0",
      position: { top: "66%", left: "75%" },
    },
    {
      id: "4",
      name: "Jack Chen",
      initials: "JC",
      location: "Unknown",
      lastUpdated: "2h ago",
      status: "offline",
      color: "#FFC107",
      position: { top: "75%", left: "35%" },
    },
  ];

  const { data: emergencyContacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["/api/emergency-contacts"],
    queryFn: () => [], // This should be a function that fetches your actual emergency contacts
  });

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("hospitalData");
    // Consider adding a custom event or context update if other parts of the app rely on this
    window.dispatchEvent(new Event("storageChange"));
    setLocation("/signin");
  };

  const handleCloseRecordModal = () => {
    setIsRecordModalOpen(false);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-neutral-600">
      <Header onEmergencyClick={handleEmergencyClick} />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="px-4 sm:px-0 mb-4 sm:mb-0">
              <h1 className="text-2xl font-semibold text-neutral-800 capitalize font-poppins">Dashboard- {hospitalName}</h1>
              <p className="mt-1 text-sm text-neutral-600">Overview of your medical records and family safety status.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 px-4 sm:px-0 w-full sm:w-auto">
              <Link href="/hospital/create-doctor">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 text-white rounded-xl px-4 py-3 text-lg hover:bg-blue-700 border border-blue-600 flex items-center justify-center"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Doctor
                </Button>
              </Link>
              <Link href="/create-patient">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 text-white rounded-xl px-4 py-3 text-lg hover:bg-blue-700 border border-blue-600 flex items-center justify-center mt-2 sm:mt-0"
                >
                  Create Patient
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {isRecordModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 sm:mx-auto">
                <Consultant onClose={handleCloseRecordModal} />
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 p-4 lg:grid-cols-4">
            <Card className="rounded-xl shadow-lg bg-white">
              <CardContent className="p-5 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <Users2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-neutral-600 truncate">Patients</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-neutral-800">
                          {loadingPatients ? <Skeleton className="h-8 w-20" /> : `${patients.length || 0} Patients`}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-blue-50 px-5 py-3 rounded-xl">
                <div className="text-sm">
                  <Link to="/patients">
                    <a className="font-medium text-primary-600 hover:text-primary-900">
                      View all Patients
                    </a>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="rounded-xl bg-white shadow-lg">
              <CardContent className="p-5 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-neutral-600 truncate">Family Members</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-neutral-800">
                          {familyLocations.length} Connected
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-green-50 px-5 py-3 rounded-xl">
                <div className="text-sm">
                  <Link href="/family-safety">
                    <a className="font-medium text-primary-600 hover:text-primary-900">
                      View connected family
                    </a>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="rounded-xl shadow-lg bg-white">
              <CardContent className="p-5 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                    <File className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-neutral-600 truncate">Total Consultation</dt>
                      <dd>
                        <div className="text-lg font-semibold text-neutral-800">
                          {loadingConsultations ? "..." : errorConsultations ? "Error" : consultationsCount}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-red-50 px-5 py-3 rounded-xl">
                <div className="text-sm">
                  <a href="/consultation" className="font-medium text-primary-600 hover:text-primary-900">View consultation history</a>
                </div>
              </div>
            </Card>

            <Card className="rounded-xl shadow-lg bg-white">
              <CardContent className="p-5 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-neutral-600 truncate">Total Doctors</dt>
                      <dd>
                        <div className="text-lg font-semibold text-neutral-800">
                          {loadingDoctors ? (
                            <Skeleton className="h-6 w-16" />
                          ) : errorDoctors ? (
                            <span className="text-red-600">Error</span>
                          ) : (
                            `${doctorsCount} Doctors`
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-blue-50 px-5 py-3 rounded-xl">
                <div className="text-sm">
                  <Link href="/doctors">
                    <a className="font-medium text-primary-600 hover:text-primary-900">
                      View all Doctors
                    </a>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-4 sm:p-4 lg:col-span-2">
              <Card className="rounded-xl shadow-lg bg-white">
                <div className="flex justify-between px-6 py-5 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-neutral-800">Patients from your Hospital</h3>
                    <p className="mt-1 text-sm text-neutral-600">Quick access to the patient register from your hospital.</p>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-800 text-white text-xl">
                      {patients.length}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div value="history" className="px-6 py-5">
                  <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md mb-6">
                    {loadingPatients ? (
                      <p>Loading patients...</p>
                    ) : errorPatients ? (
                      <p className="text-red-600">{errorPatients}</p>
                    ) : patients.length > 0 ? (
                      patients.slice(0, 3).map((patient) => (
                        <li key={patient._id} className="px-4 py-3 flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 capitalize">{patient.fullname}</p>
                            <p className="text-xs text-neutral-600 mt-1">{patient.bloodGroup}, {patient.genotype}</p>
                            <p className="text-xs text-neutral-600 mt-1">
                              <span className="font-bold">Result:</span>
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                              Last Updated: {patient.updatedAt ? new Date(patient.updatedAt).toLocaleString() : "N/A"}
                            </p>
                          </div>
                          <div className="text-blue-800 underline">
                            <Link href={`/patient-details/${patient.username}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="h-2 w-2" />
                              </Button>
                            </Link>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No users found</p>
                    )}
                  </ul>
                  <Link to="/patients">
                    <Button
                      className="bg-blue-800 w-full text-white items-center flex justify-center hover:bg-blue-900"
                    >
                      View all Patients
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            <div className="p-4 sm:p-4">
              <Card className="rounded-xl">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-neutral-800">Family Location</h3>
                  <p className="mt-1 text-sm text-neutral-600">Real-time location of your connected family members.</p>
                </div>
                <div className="p-6">
                  <h4 className="text-sm font-medium text-neutral-600 uppercase tracking-wide mb-2">Connected Members</h4>
                  <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {familyLocations.map((member) => (
                      <li key={member.id} className="px-4 py-3 flex items-center">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center text-xs text-white font-medium"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.initials}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-800">{member.name}</p>
                          <p className="text-xs text-neutral-600">{member.location} • Updated {member.lastUpdated}</p>
                        </div>
                        <div className="ml-auto">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === "online"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {member.status === "online" ? "Online" : "Offline"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}