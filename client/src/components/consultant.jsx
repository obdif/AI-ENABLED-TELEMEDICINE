import { useState, useEffect, useRef } from "react";
import {
  Mic,
  FileText,
  X,
  Pause,
  Square,
  Copy,
  Download,
  Edit,
  ArrowLeft,
  Check,
  AlertTriangle,
  Users,
  Search,
} from "lucide-react";
import jsPDF from "jspdf";

export default function Consultant({ onClose }) {
  const [activeTab, setActiveTab] = useState("patient-selection");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [errorPatients, setErrorPatients] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [consultationNotes, setConsultationNotes] = useState({
    summary: "",
    fullTranscription: "",
    liveTranscription: "",
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        setConsultationNotes((prev) => ({
          ...prev,
          liveTranscription: finalTranscript + interimTranscript,
        }));
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition failed: ${event.error}`);
      };
    } else {
      setError("Speech recognition is not supported in this browser. Please use a supported browser like Chrome.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      setErrorPatients(null);
      const url = "https://ilarocare-backend-production.up.railway.app/api/users/all";
      try {
        const token = localStorage.getItem("doctorAuthToken");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.status === "success" && Array.isArray(data.data)) {
          const fetchedPatients = data.data
            .map((item) => {
              const userData = item.user || {};
              return {
                id: userData._id || item._id,
                name: userData.fullname || item.fullname || "N/A",
                username: userData.username || item.username || "N/A",
                fullData: userData || item,
              };
            })
            .filter(Boolean);
          setPatients(fetchedPatients);
        } else {
          throw new Error(data.message || "Failed to fetch patients.");
        }
      } catch (err) {
        setErrorPatients(err.message || "Failed to fetch patients. Please try again.");
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    const nameMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const usernameMatch = patient.username.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || usernameMatch;
  });

  // Handle patient selection
  const handlePatientSelect = (patientId) => {
    setSelectedPatient(patientId);
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatientData(patient);
    setFieldErrors((prev) => ({ ...prev, patient: null }));
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("Audio data chunk available, size:", event.data.size);
        }
      };


      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped. Total chunks:", audioChunksRef.current.length);
        if (audioChunksRef.current.length === 0) {
          console.warn("No audio chunks were recorded. The recording might have been too short or an issue occurred.");
          setError("Audio recording was too short or failed to capture any sound.");
          setIsSubmitting(false);
          setIsTranscribing(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        console.log("Created audioBlob from chunks, size:", audioBlob.size);

        const finalTranscription = consultationNotes.liveTranscription.trim();

        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result;
            localStorage.setItem("consultationAudio", base64Audio);
            localStorage.setItem("consultationTranscription", finalTranscription);
            console.log("Audio and transcription saved to localStorage.");
            processRecording();
          };
          reader.onerror = (e) => {
            console.error("FileReader error:", e);
            setError("Error reading audio data for local storage.");
            setIsSubmitting(false);
            setIsTranscribing(false);
          };
        } catch (e) {
          console.error("Error saving to localStorage:", e);
          setError("Failed to save recording locally.");
          setIsSubmitting(false);
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start(); // Start recording
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setConsultationNotes((prev) => ({ ...prev, liveTranscription: "", fullTranscription: "" }));
      setError(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Could not access microphone. Please check permissions. " + error.message);
    }
  };



  // Pause recording function
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsPaused(true);
      } else {
        mediaRecorderRef.current.resume();
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
        setIsPaused(false);
      }
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  //  process recording
  const processRecording = async () => {
    setIsTranscribing(true);
    setError(null);

    try {
      console.log("Processing recording from localStorage...");
      const storedTranscription = localStorage.getItem("consultationTranscription");
      // The audio blob reconstruction part can remain as is if you want to log its size,
      // but it won't be sent to the backend.
      let audioBlob = null;
      const storedAudio = localStorage.getItem("consultationAudio");
      if (storedAudio) {
        try {
          const base64WithoutPrefix = storedAudio.split(',')[1];
          if (base64WithoutPrefix) {
            const byteCharacters = atob(base64WithoutPrefix);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            audioBlob = new Blob([byteArray], { type: "audio/wav" });
          }
        } catch (e) {
          console.error("Error reconstructing audio blob from localStorage for logging:", e);
        }
      }

      console.log("Retrieved Transcription from localStorage:", storedTranscription);
      console.log("Retrieved Audio Blob from localStorage (size):", audioBlob ? audioBlob.size : 'N/A');

      if (!storedTranscription) {
        throw new Error(`Missing stored transcription. Please record again.`);
      }

      // Pass only the transcription to sendToBackend
      await sendToBackend(storedTranscription);
    } catch (error) {
      console.error("Error processing recording from localStorage:", error);
      setError(error.message || "Failed to process recording for submission.");
      setIsSubmitting(false);
      setIsTranscribing(false);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Send audio and transcription to backend
  const sendToBackend = async (transcription) => {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      if (!selectedPatientData || !selectedPatientData.username) {
        setFieldErrors((prev) => ({ ...prev, patient: "No patient selected or patient username unavailable." }));
        throw new Error("No patient selected or patient username unavailable.");
      }

      if (!transcription || transcription.length === 0) {
        throw new Error("No transcription available.");
      }

      const token = localStorage.getItem("doctorAuthToken");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const jsonData = {
        patient: selectedPatientData.username,
        conversation: transcription,
      };

      console.log("Sending JSON payload to backend:", jsonData);

      const response = await fetch("https://ilarocare-backend-production.up.railway.app/api/doctors/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Still include for authentication if needed
        },
        body: JSON.stringify(jsonData),
      });

      let data;
      if (!response.ok) {
        try {
          data = await response.json(); // Try to parse as JSON first
          console.error("Backend error response (JSON):", data);
        } catch (jsonError) {
          const textResponse = await response.text();
          console.error("Backend error response (non-JSON, likely HTML for 500):", textResponse);
          throw new Error(`Server responded with non-JSON error (Status: ${response.status}). Check backend logs.`);
        }

        // Now, throw the error with the message received or a generic one
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error(`Server error with status: ${response.status}`);
        }
      } else {
        // If response.ok is true, it means it's a 2xx success code.
        data = await response.json();
        console.log("Backend response (success):", data);

        if (data.status !== "success") {
          // This handles cases where status is 200 OK but data.status is "error"
          if (data.error && Array.isArray(data.error)) {
            const newFieldErrors = {};
            data.error.forEach((errObj) => {
              newFieldErrors[errObj.field] = errObj.message;
            });
            setFieldErrors(newFieldErrors);
            setError("Please fix the errors in the form.");
            console.error("Backend validation errors:", data.error);
          } else {
            throw new Error(data.message || `Server responded with success status but data.status was not 'success'.`);
          }
        }
      }

      // Proceed only if everything was truly successful
      if (response.ok && data.status === "success") {
        setConsultationNotes((prev) => ({
          ...prev,
          summary: generateSummary(transcription),
          fullTranscription: transcription,
        }));
        setActiveTab("summary");
        localStorage.removeItem("consultationAudio");
        localStorage.removeItem("consultationTranscription");
      }
    } catch (err) {
      console.error("Error submitting consultation:", err);
      setError(err.message || "An error occurred while submitting the consultation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate summary from transcription
  const generateSummary = (transcription) => {
    const lines = transcription.split('\n').filter((line) => line.trim());
    const patientLines = lines.filter((line) => line.toLowerCase().startsWith('patient:'));
    const doctorLines = lines.filter((line) => line.toLowerCase().startsWith('doctor:'));

    const patientComplaints = patientLines
      .map((line) => line.replace(/^patient:\s*/i, '').trim())
      .join(' ');

    return `CONSULTATION SUMMARY
Patient: ${selectedPatientData?.name || 'Unknown'} (${selectedPatientData?.username || 'N/A'})
Date: ${new Date().toLocaleDateString()}

Chief Complaints:
${patientComplaints || 'No specific complaints documented'}

Consultation Notes:
${transcription}

Assessment & Plan:
[To be completed by physician]`;
  };

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(showSummary ? consultationNotes.summary : consultationNotes.fullTranscription)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        setError("Failed to copy to clipboard.");
      });
  };

  // Download PDF function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(showSummary ? consultationNotes.summary : consultationNotes.fullTranscription, 10, 10, { maxWidth: 190 });
    doc.save(`consultation_${selectedPatientData?.username || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const saveDocument = () => {
    alert("Document saved successfully!");
    onClose();
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "patient-selection":
        return (
          <div className="py-4">
            <h2 className="text-xl font-bold mb-4">Select Patient</h2>
            <div className="bg-gray-50 p-6 rounded-md">
              <div className="mb-4">
                <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Patient
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="patient-search"
                    type="text"
                    placeholder="Search by name or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search patients"
                  />
                </div>
              </div>

              <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>
              <div className="relative">
                <select
                  id="patient-select"
                  value={selectedPatient}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  disabled={loadingPatients || !!errorPatients}
                  aria-label="Select patient"
                >
                  <option value="">Select a patient...</option>
                  {filteredPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.username})
                    </option>
                  ))}
                </select>
                <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {fieldErrors.patient && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.patient}</p>
                )}
              </div>

              {selectedPatientData && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium text-blue-900">Selected Patient:</h4>
                  <p className="text-blue-800">{selectedPatientData.name} ({selectedPatientData.username})</p>
                </div>
              )}

              {loadingPatients && (
                <div className="mt-4 text-gray-600 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  Loading patients...
                </div>
              )}
              {(errorPatients || error) && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {errorPatients || error}
                </div>
              )}
              {!loadingPatients && !errorPatients && filteredPatients.length === 0 && searchTerm && (
                <div className="mt-4 text-gray-600">No patients found matching "{searchTerm}".</div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    if (!selectedPatient) {
                      setFieldErrors((prev) => ({ ...prev, patient: "Please select a patient to proceed." }));
                      setError("Please select a patient to proceed.");
                      return;
                    }
                    setError(null);
                    setActiveTab("transcription");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loadingPatients || !!errorPatients || !selectedPatient}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case "transcription":
        return (
          <>
            {selectedPatientData && (
              <div className="mb-6 p-3 bg-blue-50 rounded-md">
                <p className="text-blue-900">
                  <strong>Recording consultation for:</strong> {selectedPatientData.name} ({selectedPatientData.username})
                </p>
              </div>
            )}

            <p className="text-center text-gray-600 mb-12">
              Record your consultation with the patient
            </p>

            <div className="flex justify-center mb-8">
              {isRecording || isSubmitting || isTranscribing ? (
                <div className="flex flex-col items-center">
                  <div className="bg-red-100 rounded-full p-6 mb-4">
                    {isPaused ? (
                      <Mic className="h-12 w-12 text-red-500" />
                    ) : (
                      <Pause className="h-12 w-12 text-red-500" />
                    )}
                  </div>
                  <div className="text-2xl font-semibold mb-2">{formatTime(recordingTime)}</div>
                  <div className="text-gray-500">
                    {isTranscribing ? "Transcribing audio..." : isSubmitting ? "Submitting to server..." : "Recording in progress"}
                  </div>
                  {(isTranscribing || isSubmitting) && (
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-full p-6">
                  <Mic className="h-12 w-12 text-gray-600" />
                </div>
              )}
            </div>

            {isRecording && consultationNotes.liveTranscription && (
              <div className="mb-6 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold mb-2">Live Transcription:</h3>
                <p className="text-gray-800 whitespace-pre-wrap">{consultationNotes.liveTranscription}</p>
              </div>
            )}

            {isRecording ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={pauseRecording}
                  disabled={isSubmitting || isTranscribing}
                  className="flex items-center justify-center py-3 px-6 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  {isPaused ? (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
                <button
                  onClick={stopRecording}
                  disabled={isSubmitting || isTranscribing}
                  className="flex items-center justify-center py-3 px-6 rounded-md bg-red-500 text-white disabled:opacity-50"
                >
                  <Square className="h-4 w-4 mr-2" />
                  <span>Stop</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setActiveTab("patient-selection")}
                  className="flex items-center justify-center py-3 px-6 rounded-md border border-gray-300 text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>Back to Patient</span>
                </button>
                <button
                  onClick={startRecording}
                  className="flex items-center justify-center py-3 px-6 rounded-md bg-gray-900 text-white"
                  disabled={!!error && error.includes("Speech recognition is not supported")}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  <span>Start Recording</span>
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
          </>
        );
      case "summary":
        return (
          <div className="py-4">
            <h2 className="text-xl font-bold mb-4">Consultation Results</h2>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="mr-2">Show Summary</span>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${showSummary ? "bg-blue-600" : "bg-gray-200"}`}
                  aria-label="Toggle between summary and full transcription"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${showSummary ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <button
                className="flex items-center text-blue-600"
                onClick={() => alert("Edit mode would open here")}
                aria-label="Edit consultation notes"
              >
                <Edit className="h-4 w-4 mr-1" />
                <span>Edit</span>
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-md">
              {showSummary ? (
                <div>
                  <h3 className="font-semibold mb-2">Summary:</h3>
                  <pre className="text-gray-800 whitespace-pre-wrap font-sans">{consultationNotes.summary}</pre>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold mb-2">Full Transcription:</h3>
                  <pre className="text-gray-800 whitespace-pre-wrap font-sans">{consultationNotes.fullTranscription}</pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setActiveTab("transcription")}
                className="flex items-center text-gray-600"
                aria-label="Back to transcription"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Recording</span>
              </button>
              <button
                onClick={() => setActiveTab("export")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Export Options
              </button>
            </div>
          </div>
        );
      case "export":
        return (
          <div className="py-4">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Export Options
            </h2>

            <div className="bg-yellow-50 p-6 rounded-md mb-4">
              <div className="flex items-start mb-3">
                <FileText className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800">Copy to EMR</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Copy the formatted summary to paste directly into your EMR system
                  </p>
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center py-2 px-4 bg-gray-900 text-white rounded-md"
                aria-label="Copy to clipboard"
              >
                <Copy className="h-4 w-4 mr-2" />
                <span>Copy to Clipboard</span>
              </button>
            </div>

            <div className="bg-yellow-50 p-6 rounded-md">
              <div className="flex items-start mb-3">
                <Download className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800">Download PDF</h3>
                  <p className="text-gray-600 text-sm mb-3">Save the consultation summary as a PDF document</p>
                </div>
              </div>
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center py-2 px-4 bg-gray-900 text-white rounded-md"
                aria-label="Download PDF"
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setActiveTab("summary")}
                className="flex items-center text-gray-600"
                aria-label="Back to summary"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Summary</span>
              </button>

              <button
                onClick={saveDocument}
                className="flex items-center justify-center py-2 px-6 bg-green-600 text-white rounded-md"
                aria-label="Save document"
              >
                <Check className="h-4 w-4 mr-2" />
                <span>Save Document</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative p-6">
        <button
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close consultation"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Consultation Documentation</h1>
          <p className="text-gray-600 mt-1">Record your consultation, generate summary, and export to your EMR system</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            className={`flex items-center justify-center py-3 px-4 rounded-md ${activeTab === "patient-selection" ? "bg-white border border-gray-200 shadow-sm" : "bg-gray-50 text-gray-500"
              }`}
            onClick={() => setActiveTab("patient-selection")}
            aria-label="Patient selection tab"
          >
            <Users className="h-4 w-4 mr-2" />
            <span>Patient</span>
          </button>
          <button
            className={`flex items-center justify-center py-3 px-4 rounded-md ${activeTab === "transcription" ? "bg-white border border-gray-200 shadow-sm" : "bg-gray-50 text-gray-500"
              }`}
            onClick={() => setActiveTab("transcription")}
            disabled={!selectedPatient}
            aria-label="Transcription tab"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Transcription</span>
          </button>
          <button
            className={`flex items-center justify-center py-3 px-4 rounded-md ${activeTab === "summary" ? "bg-white border border-gray-200 shadow-sm" : "bg-gray-50 text-gray-500"
              }`}
            onClick={() => setActiveTab("summary")}
            disabled={!consultationNotes.fullTranscription}
            aria-label="Summary tab"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Summary</span>
          </button>
          <button
            className={`flex items-center justify-center py-3 px-4 rounded-md ${activeTab === "export" ? "bg-white border border-gray-200 shadow-sm" : "bg-gray-50 text-gray-500"
              }`}
            onClick={() => setActiveTab("export")}
            disabled={!consultationNotes.fullTranscription}
            aria-label="Export tab"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Export</span>
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-8 mb-6">{renderContent()}</div>
      </div>
    </div>
  );
}