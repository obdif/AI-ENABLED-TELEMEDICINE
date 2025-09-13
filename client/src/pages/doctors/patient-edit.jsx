import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DoctorHeader } from "@/components/layout/doctor-header";
import { Link, useLocation } from "wouter";
import { useParams } from "wouter";
import axios from "axios";
import { Plus, Upload, X } from "lucide-react";

export default function EditPatient() {
  const { username } = useParams();
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    genotype: "",
    disability: "",
    allergies: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [additionalNotes, setAdditionalNotes] = useState([]);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [, setLocation] = useLocation();

  // Debug state to track API interactions
  const [debugInfo, setDebugInfo] = useState({
    lastAPICall: null,
    lastRequest: null,
    lastResponse: null,
    lastError: null,
  });

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("doctorAuthToken");
        if (!token) {
          throw new Error("No authentication token found. Redirecting to sign-in...");
        }

        if (!username || typeof username !== "string" || username.trim() === "") {
          throw new Error("Invalid username.");
        }

        // Use the proxied URL with cache-busting parameter
        const profileUrl = `https://ilarocare-backend-production.up.railway.app/api/hospitals/get-user-profile/${username}?t=${Date.now()}`;
        console.log("Attempting to fetch from:", profileUrl);

        const profileResponse = await axios.get(profileUrl, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("Profile API Response:", profileResponse.data);
        // Check if we have user data directly or nested in a user property
        const fetchedPatient = profileResponse.data.data;
        const userData = fetchedPatient.user || fetchedPatient;

        setPatient(fetchedPatient);
        setFormData({
          fullname: userData.fullname || "",
          email: userData.email || "",
          phoneNumber: fetchedPatient.phoneNumber || "",
          address: fetchedPatient.address || "",
          dateOfBirth: fetchedPatient.dateOfBirth
            ? new Date(fetchedPatient.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: fetchedPatient.gender || "",
          bloodGroup: fetchedPatient.bloodGroup || "",
          genotype: fetchedPatient.genotype || "",
          disability: fetchedPatient.disability || "",
          allergies: fetchedPatient.allergies || "",
        });
        setFilePreview(fetchedPatient.image || null);

        // Parse additionalNotes array into label and value format
        const parsedNotes = fetchedPatient.additionalNotes
          ? fetchedPatient.additionalNotes.flatMap(noteObj => {
            // Split the note string by newlines to handle multiple entries
            return noteObj.note.split('\n').map(note => {
              const [label, value] = note.split(': ');
              return {
                label: label || '',
                value: value || '',
              };
            });
          })
          : [];
        setAdditionalNotes(parsedNotes);

        // Debug info for successful fetch
        setDebugInfo(prev => ({
          ...prev,
          lastAPICall: 'GET Patient Profile',
          lastResponse: profileResponse.data,
        }));
      } catch (err) {
        console.error("Error fetching patient:", err.response ? err.response.data : err.message);
        const errorMsg = err.response?.data?.message || err.message || "Failed to fetch patient details.";
        setError(errorMsg);

        // Debug info for fetch error
        setDebugInfo(prev => ({
          ...prev,
          lastAPICall: 'GET Patient Profile - ERROR',
          lastError: err.response?.data || err.message,
        }));

        if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
          setTimeout(() => setLocation("/doctor-login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [username, setLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit. Please select a smaller image.");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoteChange = (index, field, value) => {
    const newNotes = [...additionalNotes];
    newNotes[index][field] = value;
    setAdditionalNotes(newNotes);
  };

  const addNoteField = () => {
    setAdditionalNotes([...additionalNotes, { label: '', value: '' }]);
  };

  const removeNoteField = (index) => {
    const newNotes = additionalNotes.filter((_, i) => i !== index);
    setAdditionalNotes(newNotes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("doctorAuthToken");
      if (!token) {
        throw new Error("No authentication token found. Redirecting to sign-in...");
      }

      console.log("Current token:", token);

      // Format phone number correctly
      let phoneNumber = formData.phoneNumber.trim();
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = phoneNumber.startsWith("0")
          ? `+234${phoneNumber.substring(1)}`
          : `+234${phoneNumber}`;
      }

      // Format gender correctly
      const gender = formData.gender.trim();
      const formattedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

      // Convert additionalNotes array to a single string for the backend
      const additionalNote = additionalNotes
        .filter(note => note.label.trim() || note.value.trim())
        .map(note => `${note.label.trim() || "Untitled"}: ${note.value.trim() || "N/A"}`)
        .join('\n');

      // Create nested structure to match the API's expectations
      const jsonData = {
        // User object properties - these need to be nested as expected by the API
        user: {
          fullname: formData.fullname.trim(),
          email: formData.email.trim(),
        },
        // Profile properties at the top level
        phoneNumber: phoneNumber,
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formattedGender,
        bloodGroup: formData.bloodGroup.toUpperCase(),
        genotype: formData.genotype.toUpperCase(),
        disability: formData.disability.trim() || "None",
        allergies: formData.allergies.trim() || "None",
        additionalNote: additionalNote, // Send as a string
      };

      // Log JSON payload for debugging
      console.log("JSON payload being sent to backend:", JSON.stringify(jsonData, null, 2));

      // Update debugging info
      setDebugInfo(prev => ({
        ...prev,
        lastAPICall: 'PUT Update Profile (JSON) - Request',
        lastRequest: jsonData,
      }));

      const updateJsonUrl = `https://ilarocare-backend-production.up.railway.app/api/hospitals/update-user-profile/${username}`;
      // console.log("Updating patient with JSON at:", updateJsonUrl);

      const jsonResponse = await axios.put(updateJsonUrl, jsonData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("Update API Response (JSON):", jsonResponse.data);

      // Update debug info with response
      setDebugInfo(prev => ({
        ...prev,
        lastAPICall: 'PUT Update Profile (JSON) - Response',
        lastResponse: jsonResponse.data,
      }));

      // If we got here, JSON approach worked
      if (jsonResponse.data.status === 'success') {
        // Handle image separately if needed
        if (selectedFile) {
          try {
            const imageData = new FormData();
            imageData.append('image', selectedFile);

            console.log("Uploading image separately");
            const imageUrl = `/api/hospitals/update-user-image/${username}`;

            const imageResponse = await axios.put(imageUrl, imageData, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });

            console.log("Image update response:", imageResponse.data);

            setDebugInfo(prev => ({
              ...prev,
              imageUploadResponse: imageResponse.data,
            }));
          } catch (imageErr) {
            console.error("Error updating image (continuing anyway):", imageErr);
            setDebugInfo(prev => ({
              ...prev,
              imageUploadError: imageErr.response?.data || imageErr.message,
            }));
          }
        }

        setSuccess("Patient updated successfully!");

        // Longer delay to ensure backend processing completes
        setTimeout(() => {
          // Clear any potential cache
          localStorage.setItem('lastPatientRefresh', Date.now());
          // Force a refresh when redirecting
          setLocation(`/patient-detail/${username}?refresh=${Date.now()}`);
        }, 3000);

        return; // Exit early since JSON approach worked
      }
    } catch (err) {
      console.error("Error updating patient:", err.response ? err.response.data : err.message);

      // Update debug info with error
      setDebugInfo(prev => ({
        ...prev,
        lastAPICall: 'PUT Update Profile - ERROR',
        lastError: err.response?.data || err.message,
      }));

      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Failed to update patient.";
      const validationErrors = err.response?.data?.error ? err.response.data.error.join(", ") : "No specific error details provided.";

      setError(
        errorMsg.includes("401")
          ? `Failed to update patient. Authentication error (401). Please log in again and retry.`
          : err.response?.status === 422
            ? `Failed to update patient. Validation failed: ${validationErrors}.`
            : errorMsg.includes("404")
              ? `Failed to update patient. The endpoint might be incorrect, or the username "${username}" does not exist.`
              : `Failed to update patient. The server returned: ${errorMsg}.`
      );

      if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
        setTimeout(() => setLocation("/doctor-login"), 2000);
      }
    }
  };

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
            <p className="text-gray-500 mt-2">Redirecting to sign-in in 2 seconds...</p>
          )}
          <div className="mt-4 space-x-4">
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Retry</Button>
            <Link href="/patients"><Button className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2">Back to Patients List</Button></Link>
          </div>

          {/* Debug information - can be removed in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
              <h3 className="font-semibold">Debug Information:</h3>
              <pre className="text-xs mt-2 overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onEmergencyClick={handleEmergencyClick} />
        <div className="max-w-6xl mt-8 mx-auto p-6 bg-white rounded-xl shadow-md">
          <p className="text-gray-600">Patient not found.</p>
          <Link href="/patients"><Button className="mt-4 bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2">Back to Patients List</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader onEmergencyClick={handleEmergencyClick} />
      <div className="max-w-6xl mt-8 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Patient: {username}</h1>
            <Link href={`/patient-details/${username}`}><Button className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2">Back to Patient Details</Button></Link>
          </div>

          {success && <p className="text-green-600 mb-4">{success} Redirecting in 2 seconds...</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-image" className="text-gray-700">Patient Photo</Label>
                    <div className="border-4 border-blue-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => fileInputRef.current.click()}>
                      {filePreview ? <img src={filePreview} alt={`${formData.fullname}'s preview`} className="w-full h-64 object-cover rounded-xl" /> : <>
                        <Upload className="h-10 w-10 text-blue-500 mb-2" />
                        <p className="text-gray-500 text-center">Click to upload <br /><span className="text-sm text-gray-400">PNG, JPG <span className="text-red-500">(max. 5MB)</span></span></p>
                      </>}
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                  </div>
                  {filePreview && <Button type="button" onClick={() => {
                    setFilePreview(null);
                    setSelectedFile(null);
                  }} className="w-full border-red-500 text-red-500 hover:bg-red-50">Remove Image</Button>}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="fullname" className="text-gray-500">Full Name</Label><Input id="fullname" name="fullname" value={formData.fullname} onChange={handleInputChange} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" required /></div>
                    <div className="space-y-2"><Label htmlFor="email" className="text-gray-500">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" required /></div>
                    <div className="space-y-2"><Label htmlFor="phoneNumber" className="text-gray-500">Phone Number</Label><Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" required /></div>
                    <div className="space-y-2"><Label htmlFor="address" className="text-gray-500">Address</Label><Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" required /></div>
                    <div className="space-y-2"><Label htmlFor="dateOfBirth" className="text-gray-500">Date of Birth</Label><Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" required /></div>
                    <div className="space-y-2"><Label htmlFor="gender" className="text-gray-500">Gender</Label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">Medical Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="bloodGroup" className="text-gray-500">Blood Group</Label>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="genotype" className="text-gray-500">Genotype</Label>
                      <select
                        id="genotype"
                        name="genotype"
                        value={formData.genotype}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Genotype</option>
                        <option value="AA">AA</option>
                        <option value="AS">AS</option>
                        <option value="SS">SS</option>
                        <option value="AC">AC</option>
                        <option value="SC">SC</option>
                        <option value="CC">CC</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="disability" className="text-gray-500">Disability</Label><Input id="disability" name="disability" value={formData.disability} onChange={handleInputChange} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="None" /></div>
                    <div className="space-y-2"><Label htmlFor="allergies" className="text-gray-500">Known Allergies</Label><Input id="allergies" name="allergies" value={formData.allergies} onChange={handleInputChange} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="None" /></div>
                  </div>
                </div>

                {additionalNotes.map((note, index) => (
                  <div key={index} className="space-y-2 relative mt-4">
                    <div className="space-y-2"><Label htmlFor={`additional-label-${index}`} className="text-gray-500">Field Title</Label><Input id={`additional-label-${index}`} value={note.label} onChange={(e) => handleNoteChange(index, "label", e.target.value)} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" /></div>
                    <div className="space-y-2"><Label htmlFor={`additional-value-${index}`} className="text-gray-500">Field Value</Label><Input id={`additional-value-${index}`} value={note.value} onChange={(e) => handleNoteChange(index, "value", e.target.value)} className="border-gray-300 rounded focus:ring-2 focus:ring-blue-500" /></div>
                    <Button type="button" onClick={() => removeNoteField(index)} className="absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={16} /></Button>
                  </div>
                ))}
                <Button type="button" onClick={addNoteField} className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors mt-4"><Plus className="h-5 w-5" /><span>Add New Field</span></Button>

                <div className="flex justify-end space-x-4 mt-6">
                  <Link href={`/patient-details/${username}`}><Button type="button" className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2">Cancel</Button></Link>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Save Changes</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}