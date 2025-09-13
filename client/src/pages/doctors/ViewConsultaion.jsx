import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import axios from "axios";
import { DoctorHeader } from "@/components/layout/doctor-header"; // Assuming this path is correct
import { ArrowLeft, User, Stethoscope, Calendar, FileText, Clipboard, MessageSquare, Clock, Edit } from 'lucide-react'; // Added Clock and Edit for consistency
import { Button } from "@/components/ui/button";

export default function ViewConsultation() {
  // Now, we're expecting 'username' from the URL, not 'id'
  const { username } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const doctorData = JSON.parse(localStorage.getItem("doctorData") || "{}");
        const token = localStorage.getItem("doctorAuthToken");

        if (!token) {
          setError("Authentication token missing. Please log in.");
          setLoading(false);
          // Optional: redirect to login if token is missing
          // setLocation("/doctor-login"); // if you use setLocation from wouter
          return;
        }

        if (!username) { // Check for username, not id
          setError("Patient username is missing from the URL.");
          setLoading(false);
          return;
        }

        // Use the backend endpoint that fetches consultations by username
        // Based on previous responses, it was:
        const response = await axios.get(
          `https://ilarocare-backend-production.up.railway.app/api/doctors/get-consultations?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
          if (response.data.data.length > 0) {
            // **CRUCIAL CHANGE:** Display the FIRST consultation found for this username.
            // If the patient 'username' has multiple consultations, this will always
            // show the first one returned by your backend.
            const con = response.data.data[0];

            // Map backend response to desired frontend structure
            const patientName = con.patient?.username || con.patient?.name || con.patient || "Unknown Patient";
            const doctorName = con.doctor?.fullName;

            setConsultation({
              id: con._id, // Still using _id for internal tracking, even if not from URL
              patientName: patientName,
              patientId: con.patient?._id || con.patient,
              consultantId: con.doctor?._id || con.doctor,
              consultantName: doctorName,
              visitType: con.visitType || "General Consultation",
              dateCreated: new Date(con.createdAt).toLocaleDateString() + ' ' + new Date(con.createdAt).toLocaleTimeString(),
              status: con.status || "Completed",
              duration: con.duration || "N/A",
              symptoms: con.symptoms || (con.conversation ? con.conversation.substring(0, 100) + "..." : "N/A"),
              diagnosis: con.diagnosis || "Auto-summarized",
              fullConversation: con.conversation || "No conversation record.",
              notes: con.notes || "No additional notes."
            });

            if (response.data.data.length > 1) {
              console.warn(`Patient '${username}' has multiple consultations. Displaying the first one found.`);
              // Optional: You could set an error message here if you want to notify the user
              // setError("This patient has multiple consultations. Displaying the latest/first one.");
            }

          } else {
            setError(`No consultations found for patient: ${username}`);
          }
        } else {
          setError(response.data.message || "Failed to fetch consultation details: Invalid response format or no data.");
        }
      } catch (err) {
        console.error("Error fetching consultation details:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || `Error: ${err.response.status}`);
        } else {
          setError("An unexpected error occurred while fetching consultation details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) { // Only fetch if username is present
      fetchConsultationDetails();
    } else {
      setLoading(false);
      setError("Patient username is missing from the URL.");
    }
  }, [username]); // Re-run effect if the username changes

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-blue-600">Loading consultation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <DoctorHeader />
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8 text-center text-red-600">
          <p className="text-lg">Error: {error}</p>
          <Link href="/doctor-consultations"> {/* Changed to doctor-consultations for general list */}
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Consultations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <DoctorHeader />
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8 text-center text-gray-600">
          <p className="text-lg">No consultation found for this patient.</p>
          <Link href="/doctor-consultations"> {/* Changed to doctor-consultations for general list */}
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Consultations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href="/doctor-consultations"> {/* Changed to doctor-consultations for general list */}
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-800 ml-4">Consultation Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6 border-b pb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-3" />
              <strong>Patient:</strong> <span className="ml-2 capitalize">{consultation.patientName}</span>
            </div>
            <div className="flex items-center">
              <Stethoscope className="h-5 w-5 text-green-600 mr-3" />
              <strong>Consultant:</strong> <span className="ml-2">Dr. {consultation.consultantName}</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-purple-600 mr-3" />
              <strong>Consultation ID:</strong> <span className="ml-2">CON-{consultation.id.substring(0, 5)}</span>
            </div>
            <div className="flex items-center">
              <Clipboard className="h-5 w-5 text-yellow-600 mr-3" />
              <strong>Visit Type:</strong> <span className="ml-2">{consultation.visitType}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-indigo-600 mr-3" />
              <strong>Date:</strong> <span className="ml-2">{consultation.dateCreated}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-3" />
              <strong>Duration:</strong> <span className="ml-2">{consultation.duration}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6 border-b pb-4">Symptoms & Diagnosis</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-teal-600 mr-2" /> Symptoms:
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100">{consultation.symptoms}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 flex items-center mb-2">
              <FileText className="h-5 w-5 text-red-600 mr-2" /> Diagnosis:
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100">{consultation.diagnosis}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6 border-b pb-4">Full Conversation Record</h2>
          <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-md border border-gray-100 text-gray-700 whitespace-pre-wrap">
            {consultation.fullConversation}
          </div>
        </div>

        {consultation.notes && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-neutral-700 mb-6 border-b pb-4">Additional Notes</h2>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-gray-700 whitespace-pre-wrap">
              {consultation.notes}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow">
            <Edit className="h-5 w-5 mr-2" /> Edit Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}