import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplet,
  Dna,
  ShipWheel,
} from "lucide-react";
import { DoctorHeader } from "@/components/layout/doctor-header";
import { Link, useLocation } from "wouter";
import { useParams } from "wouter";
import axios from "axios";
import patient1 from "@/assets/patient1.jpg";
// import FullPageModal from "../components/get-family-modal";
import FamilyMedicalModal from "@/components/get-family-modal";


export default function DoctorPatientDetails() {
  const { username } = useParams();
  const [patient, setPatient] = useState(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useLocation();
  const [familyRecord, setFamilyRecord] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("doctorAuthToken");
        // const username = localStorage.getItem("DoctorUsername");
        // console.log("Fetching with token:", token);
        if (!token) {
          throw new Error(
            "No authentication token found. Redirecting to sign-in..."
          );
        }

        if (
          !username ||
          typeof username !== "string" ||
          username.trim() === ""
        ) {
          throw new Error("Invalid username.");
        }

        const profileUrl = import.meta.env.VITE_API_BASE_URL
          ? `${import.meta.env.VITE_API_BASE_URL
          }/api/hospitals/get-user-profile/${username}`
          : `http://localhost:8080/api/hospitals/get-user-profile/${username}`;
        const cacheBuster = new Date().getTime();
        const fullUrl = `${profileUrl}?t=${cacheBuster}`;
        // console.log("Attempting to fetch from:", fullUrl);
        const profileResponse = await axios.get(fullUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        // console.log("Patient Profile API Response:", profileResponse.data);

        let fetchedPatient = null;
        if (profileResponse.data.data && profileResponse.data.data.user) {
          fetchedPatient = {
            ...profileResponse.data.data.user,
            ...profileResponse.data.data,
          };
        } else if (profileResponse.data.data) {
          fetchedPatient = profileResponse.data.data;
        } else if (profileResponse.data && profileResponse.data.user) {
          fetchedPatient = profileResponse.data.user;
        } else if (profileResponse.data) {
          fetchedPatient = profileResponse.data;
        } else {
          throw new Error(
            "Unexpected profile response format: Expected a user object in data."
          );
        }

        // Parse additionalNotes into label and value format
        if (
          fetchedPatient.additionalNotes &&
          Array.isArray(fetchedPatient.additionalNotes)
        ) {
          fetchedPatient.parsedAdditionalNotes =
            fetchedPatient.additionalNotes.flatMap((noteObj) => {
              // Split the note string by newlines to handle multiple entries
              return noteObj.note.split("\n").map((note) => {
                const [label, value] = note.split(": ");
                return {
                  label: label || "Untitled",
                  value: value || "N/A",
                };
              });
            });
        } else {
          fetchedPatient.parsedAdditionalNotes = [];
        }

        if (fetchedPatient.dateOfBirth) {
          const dob = new Date(fetchedPatient.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
          ) {
            fetchedPatient.age = age - 1;
          } else {
            fetchedPatient.age = age;
          }
        }

        setPatient(fetchedPatient);
      } catch (err) {
        const errorMsg =
          err.response?.data ||
          err.message ||
          "Failed to fetch patient details. Please try again.";
        setError(
          errorMsg.includes("Cannot GET")
            ? "Patient not found. Please verify the username or check with the backend team for the correct endpoint."
            : errorMsg
        );
        if (
          errorMsg.includes("unauthenticated") ||
          errorMsg.includes("token")
        ) {
          setTimeout(() => setLocation("/doctor-login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [username, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DoctorHeader onEmergencyClick={handleEmergencyClick} />
        <div className="max-w-6xl mt-8 mx-auto p-6 bg-white rounded-xl shadow-md">
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DoctorHeader onEmergencyClick={handleEmergencyClick} />
        <div className="max-w-6xl mt-8 mx-auto p-6 bg-white rounded-xl shadow-md">
          <p className="text-red-600">{error}</p>
          {error.includes("unauthenticated") && (
            <p className="text-gray-500 mt-2">
              Redirecting to sign-in in 2 seconds...
            </p>
          )}
          <div className="mt-4 space-x-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            >
              Retry
            </Button>
            <Link href="/patients">
              <Button className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2">
                Back to Patients List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DoctorHeader onEmergencyClick={handleEmergencyClick} />
        <div className="max-w-6xl mt-8 mx-auto p-6 bg-white rounded-xl shadow-md">
          <p className="text-gray-600">Patient not found.</p>
          <Link href="/doctor-patients">
            <Button className="mt-4 bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2">
              Back to Patients List
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  // const hand
  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader onEmergencyModalOpen={handleEmergencyClick} />

      <div className="max-w-6xl mt-8 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Patient Record: {patient.username}
            </h1>
            <Link href={`/patient-edit/${patient.username}`}>
              <Button className="bg-blue-600 rounded-xl hover:bg-blue-700 text-white">
                <Edit className="mr-2 h-4 w-4" /> Edit Patient
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="border-4 border-blue-800 rounded-xl p-4 flex flex-col items-center justify-center">
                  <img
                    src={patient.image || patient1}
                    alt={`${patient.fullname}'s profile`}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
                <center>
                  <Button
                    className="bg-blue-600 rounded-xl hover:bg-blue-700 text-white"
                    onClick={() => setIsOpen(true)}
                  >
                    Get Family Medical Records
                  </Button>
                  <FamilyMedicalModal isOpen={isOpen} setIsOpen={setIsOpen} username={username} />
                </center>
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800 border-b pb-2">
                    Contact Information
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{patient.phoneNumber || "Not provided"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span>{patient.email || "N/A"}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                    <span>{patient.address || "Not provided"}</span>
                  </div>
                  <div className="mt-10 text-sm text-gray-500">
                    <p>
                      Last updated:{" "}
                      {patient.updatedAt
                        ? new Date(patient.updatedAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Full Name</Label>
                      <div className="p-2 bg-gray-50 rounded">
                        {patient.fullname || "N/A"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">
                        Date of Birth / Age
                      </Label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {patient.dateOfBirth
                            ? `${new Date(
                              patient.dateOfBirth
                            ).toLocaleDateString()} (${patient.age || "N/A"
                            } years)`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Gender</Label>
                      <div className="p-2 bg-gray-50 rounded">
                        {patient.gender || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
                    Medical Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Blood Group</Label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <Droplet className="h-4 w-4 text-gray-500" />
                        <span>{patient.bloodGroup || "N/A"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Genotype</Label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <Dna className="h-4 w-4 text-gray-500" />
                        <span>{patient.genotype || "N/A"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Disability</Label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <ShipWheel className="h-4 w-4 text-gray-500" />
                        <span>{patient.disability || "None"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Known Allergies</Label>
                      <div className="p-2 bg-gray-50 rounded">
                        {patient.allergies || "None recorded"}
                      </div>
                    </div>
                  </div>
                </div>

                {patient.parsedAdditionalNotes?.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
                      Additional Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {patient.parsedAdditionalNotes.map((note, index) => (
                        <div key={index} className="space-y-2">
                          <Label className="text-gray-500">{note.label}</Label>
                          <div className="p-2 bg-gray-50 rounded">
                            {note.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
