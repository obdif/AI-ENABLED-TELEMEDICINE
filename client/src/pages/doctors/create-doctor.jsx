
// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Plus, Upload, ArrowRight, X } from "lucide-react";
// import { Header } from "@/components/layout/header";
// import axios from "axios";
// import { useLocation } from "wouter";
// import toast, { Toaster } from "react-hot-toast";

// export default function CreateDoctor() {
//   const [filePreview, setFilePreview] = useState(null);
//   const [file, setFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [success, setSuccess] = useState(null);
//   const [, setLocation] = useLocation();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     username: "",
//     dateOfBirth: "",
//     gender: "",
//     speciality: "",
//     phoneNumber: "",
//     email: "",
//     bio: "",
//   });

//   // Redirect to sign-in if not authenticated
//   useEffect(() => {
//     const hospitalData = JSON.parse(localStorage.getItem("hospitalData"));
//     const authToken = localStorage.getItem("authToken");
//     if (!hospitalData?.hospitalId || !authToken) {
//       toast.error("Please sign in to create a doctor.", {
//         duration: 4000,
//         position: "top-center",
//       });
//       setLocation("/signin");
//     }
//   }, [setLocation]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError("File size exceeds 5MB limit.");
//         toast.error("File size exceeds 5MB limit.", {
//           duration: 4000,
//           position: "top-center",
//         });
//         return;
//       }
//       if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
//         setError("Only PNG and JPG files are allowed.");
//         toast.error("Only PNG and JPG files are allowed.", {
//           duration: 4000,
//           position: "top-center",
//         });
//         return;
//       }
//       setFile(selectedFile);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFilePreview(reader.result);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear field-specific error when user starts typing
//     setFieldErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current.click();
//   };

//   const handleEmergencyClick = () => {
//     setIsEmergencyModalOpen(true);
//   };

//   const validateForm = () => {
//     const errors = {};
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
//     if (!formData.username.trim()) errors.username = "Username is required.";
//     if (!emailRegex.test(formData.email)) errors.email = "Invalid email format.";
//     if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
//     if (!["Male", "Female", "Other"].includes(formData.gender)) errors.gender = "Gender is required.";
//     if (!formData.speciality) errors.speciality = "Speciality is required.";
//     if (!formData.phoneNumber.replace(/\D/g, "").match(/^\d{10,15}$/)) errors.phoneNumber = "Phone number must be 10-15 digits.";
//     if (!formData.bio.trim()) errors.bio = "Bio is required.";
//     return Object.keys(errors).length > 0 ? errors : null;
//   };

//   const isFormValid = () => {
//     return (
//       formData.fullName.trim() &&
//       formData.username.trim() &&
//       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) &&
//       formData.dateOfBirth &&
//       ["Male", "Female", "Other"].includes(formData.gender) &&
//       formData.speciality &&
//       formData.phoneNumber.replace(/\D/g, "").match(/^\d{10,15}$/) &&
//       formData.bio.trim()
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setFieldErrors({});

//     try {
//       // Client-side validation
//       const validationErrors = validateForm();
//       if (validationErrors) {
//         setFieldErrors(validationErrors);
//         const errorMsg = Object.values(validationErrors).join(" ");
//         throw new Error(errorMsg);
//       }

//       // Retrieve hospitalId and authToken
//       const hospitalData = JSON.parse(localStorage.getItem("hospitalData")) || {};
//       const hospitalId = hospitalData.hospitalId;
//       const authToken = localStorage.getItem("authToken");

//       if (!hospitalId) {
//         throw new Error("Hospital ID not found. Please sign in again.");
//       }
//       if (!authToken) {
//         throw new Error("Authentication token not found. Please sign in again.");
//       }

//       // Log formData for debugging
//       console.log("FormData state:", formData);

//       // Clean and validate phone number
//       const cleanedPhoneNumber = formData.phoneNumber.replace(/\D/g, "");
//       if (!cleanedPhoneNumber.match(/^\d{10,15}$/)) {
//         throw new Error("Phone number must be 10-15 digits.");
//       }

//       // Convert dateOfBirth to ISO format
//       let isoDateOfBirth;
//       try {
//         isoDateOfBirth = new Date(formData.dateOfBirth).toISOString();
//       } catch {
//         throw new Error("Invalid date of birth format.");
//       }

//       // Create FormData
//       const formDataToSend = new FormData();
//       formDataToSend.append("fullName", formData.fullName.trim());
//       formDataToSend.append("username", formData.username.trim());
//       formDataToSend.append("email", formData.email);
//       formDataToSend.append("dateOfBirth", isoDateOfBirth);
//       formDataToSend.append("gender", formData.gender);
//       formDataToSend.append("speciality", formData.speciality);
//       formDataToSend.append("phoneNumber", Number(cleanedPhoneNumber));
//       formDataToSend.append("bio", formData.bio.trim());
//       formDataToSend.append("hospital", hospitalId);
//       if (file) {
//         formDataToSend.append("image", file);
//       }

//       // Log FormData entries for debugging
//       for (let [key, value] of formDataToSend.entries()) {
//         console.log(`${key}: ${value}`);
//       }

//       // Send POST request
//       const url = import.meta.env.VITE_API_BASE_URL
//         ? `${import.meta.env.VITE_API_BASE_URL}/api/hospitals/create-doctor`
//         : "https://ilarocare-backend-production.up.railway.app/api/hospitals/create-doctor";

//       const response = await axios.post(url, formDataToSend, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       // Handle success
//       setSuccess(response.data.message || "Doctor created successfully");
//       toast.success(response.data.message || "Doctor created successfully", {
//         duration: 3000,
//         position: "top-center",
//       });
//       setTimeout(() => {
//         setLocation("/doctors");
//       }, 2000);
//     } catch (err) {
//       // Log detailed error
//       console.error("Error response:", err.response?.data);
//       const backendErrors = err.response?.data?.error;
//       if (Array.isArray(backendErrors)) {
//         const newFieldErrors = {};
//         backendErrors.forEach(({ field, message }) => {
//           newFieldErrors[field] = message;
//         });
//         setFieldErrors(newFieldErrors);
//         setError("Validation failed. Please check the form.");
//       } else {
//         const errorMsg =
//           err.response?.data?.message ||
//           err.response?.data?.error ||
//           err.message ||
//           "Failed to create doctor. Please try again.";
//         setError(errorMsg);
//       }
//       toast.error("Validation failed. Please check the form.", {
//         duration: 4000,
//         position: "top-center",
//       });
//       if (err.response?.status === 401) {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("hospitalData");
//         setLocation("/signin");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Toaster />
//       <Header onEmergencyClick={handleEmergencyClick} />
//       <div className="max-w-6xl mt-8 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h1>

//           {success && (
//             <p className="text-green-600 mb-4">{success} Redirecting in 2 seconds...</p>
//           )}
//           {error && <p className="text-red-600 mb-4">{error}</p>}

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left Column - Image Upload */}
//             <div className="lg:col-span-1">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="doctor-image" className="text-gray-700">
//                     Doctor Photo
//                   </Label>
//                   <div
//                     className="border-4 border-blue-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
//                     onClick={triggerFileInput}
//                   >
//                     {filePreview ? (
//                       <img
//                         src={filePreview}
//                         alt="Doctor preview"
//                         className="w-full h-64 object-cover rounded-xl"
//                       />
//                     ) : (
//                       <>
//                         <Upload className="h-10 w-10 text-blue-500 mb-2" />
//                         <p className="text-gray-500 text-center">
//                           Click to upload <br />
//                           <span className="text-sm text-gray-400">
//                             PNG, JPG <span className="text-red-500">(max. 5MB)</span>
//                           </span>
//                         </p>
//                       </>
//                     )}
//                     <input
//                       type="file"
//                       id="doctor-image"
//                       name="image"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                       accept="image/png,image/jpeg"
//                       className="hidden"
//                     />
//                   </div>
//                 </div>

//                 {filePreview && (
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setFilePreview(null);
//                       setFile(null);
//                       fileInputRef.current.value = "";
//                     }}
//                     className="w-full border-red-500 text-red-500 hover:bg-red-50"
//                   >
//                     Remove Image
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {/* Right Column - Doctor Information */}
//             <div className="lg:col-span-2">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                   {/* Personal Information */}
//                   <div className="space-y-4">
//                     <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
//                       Doctor Information
//                     </h2>

//                     <div className="space-y-2">
//                       <Label htmlFor="fullName" className="text-gray-800">
//                         Full Name<span className="text-red-500">*</span>
//                       </Label>
//                       <Input
//                         id="fullName"
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         placeholder="John Doe"
//                         className={`text-gray-700 border-gray-300 rounded ${fieldErrors.fullName ? 'border-red-500' : ''}`}
//                         required
//                       />
//                       {fieldErrors.fullName && (
//                         <p className="text-red-500 text-sm">{fieldErrors.fullName}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="username" className="text-gray-800">
//                         Username<span className="text-red-500">*</span>
//                       </Label>
//                       <Input
//                         id="username"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleInputChange}
//                         placeholder="johndoe"
//                         className={`text-gray-700 border-gray-300 rounded ${fieldErrors.username ? 'border-red-500' : ''}`}
//                         required
//                       />
//                       {fieldErrors.username && (
//                         <p className="text-red-500 text-sm">{fieldErrors.username}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="dateOfBirth" className="text-gray-800">
//                         Date of Birth<span className="text-red-500">*</span>
//                       </Label>
//                       <input
//                         type="date"
//                         id="dateOfBirth"
//                         name="dateOfBirth"
//                         value={formData.dateOfBirth}
//                         onChange={handleInputChange}
//                         className={`w-full p-2 text-gray-700 justify-start text-left border rounded border-gray-300 font-normal ${fieldErrors.dateOfBirth ? 'border-red-500' : ''}`}
//                         required
//                       />
//                       {fieldErrors.dateOfBirth && (
//                         <p className="text-red-500 text-sm">{fieldErrors.dateOfBirth}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="gender" className="text-gray-800">
//                         Gender<span className="text-red-500">*</span>
//                       </Label>
//                       <select
//                         id="gender"
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleInputChange}
//                         className={`border w-full p-2 rounded border-gray-300 ${fieldErrors.gender ? 'border-red-500' : ''}`}
//                         required
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                       {fieldErrors.gender && (
//                         <p className="text-red-500 text-sm">{fieldErrors.gender}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="speciality" className="text-gray-800">
//                         Specialty<span className="text-red-500">*</span>
//                       </Label>
//                       <select
//                         id="speciality"
//                         name="speciality"
//                         value={formData.speciality}
//                         onChange={handleInputChange}
//                         className={`border w-full p-2 rounded border-gray-300 ${fieldErrors.speciality ? 'border-red-500' : ''}`}
//                         required
//                       >
//                         <option value="">Select Doctor Specialty</option>
//                         <option value="Cardiology">Cardiology</option>
//                         <option value="Dermatology">Dermatology</option>
//                         <option value="Neurology">Neurology</option>
//                         <option value="Surgery">Surgery</option>
//                         <option value="Pediatrics">Pediatrics</option>
//                         <option value="Oncology">Oncology</option>
//                         <option value="Pharmacist">Pharmacist</option>
//                       </select>
//                       {fieldErrors.speciality && (
//                         <p className="text-red-500 text-sm">{fieldErrors.speciality}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phoneNumber" className="text-gray-800">
//                         Phone Number<span className="text-red-500">*</span>
//                       </Label>
//                       <Input
//                         id="phoneNumber"
//                         name="phoneNumber"
//                         value={formData.phoneNumber}
//                         onChange={handleInputChange}
//                         placeholder="+234 800 000 0000"
//                         className={`rounded text-gray-700 border-gray-300 ${fieldErrors.phoneNumber ? 'border-red-500' : ''}`}
//                         required
//                       />
//                       {fieldErrors.phoneNumber && (
//                         <p className="text-red-500 text-sm">{fieldErrors.phoneNumber}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email" className="text-gray-800">
//                         Email<span className="text-red-500">*</span>
//                       </Label>
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="doctor@example.com"
//                         className={`rounded text-gray-700 border-gray-300 ${fieldErrors.email ? 'border-red-500' : ''}`}
//                         required
//                       />
//                       {fieldErrors.email && (
//                         <p className="text-red-500 text-sm">{fieldErrors.email}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Additional Notes */}
//                 <div className="space-y-2">
//                   <Label htmlFor="bio" className="text-gray-800">
//                     Bio<span className="text-red-500">*</span>
//                   </Label>
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.bio ? 'border-red-500' : ''}`}
//                     placeholder="Enter doctor bio..."
//                     required
//                   ></textarea>
//                   {fieldErrors.bio && (
//                     <p className="text-red-500 text-sm">{fieldErrors.bio}</p>
//                   )}
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-4 pt-4">
//                   <Button
//                     type="button"
//                     onClick={() => setLocation("/doctors")}
//                     className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     size="lg"
//                     type="submit"
//                     disabled={isLoading || !isFormValid()}
//                     className={`${
//                       isLoading || !isFormValid()
//                         ? "bg-blue-600 cursor-not-allowed w-full"
//                         : "bg-blue-600 hover:bg-blue-700 text-white"
//                     } text-white px-4 py-2 w-full rounded-xl font-medium transition-all sm:w-auto px-6 py-6 text-lg border border-blue-600`}
//                   >
//                     {isLoading ? "Creating..." : "Create Doctor "}
//                     <ArrowRight className="ml-2 h-5 w-5" />
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "wouter";
import toast, { Toaster } from "react-hot-toast";

export default function CreateDoctor() {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    speciality: "",
    phoneNumber: "",
    email: "",
    bio: "",
  });

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    const hospitalData = JSON.parse(localStorage.getItem("hospitalData"));
    const authToken = localStorage.getItem("authToken");
    if (!hospitalData?.hospitalId || !authToken) {
      toast.error("Please sign in to create a doctor.", {
        duration: 4000,
        position: "top-center",
      });
      setLocation("/signin");
    }
  }, [setLocation]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        toast.error("File size exceeds 5MB limit.", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }
      if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
        setError("Only PNG and JPG files are allowed.");
        toast.error("Only PNG and JPG files are allowed.", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
    if (!formData.username.trim()) errors.username = "Username is required.";
    if (!emailRegex.test(formData.email)) errors.email = "Invalid email format.";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
    if (!["Male", "Female", "Other"].includes(formData.gender)) errors.gender = "Gender is required.";
    if (!formData.speciality) errors.speciality = "Speciality is required.";
    if (!formData.phoneNumber.replace(/\D/g, "").match(/^\d{10,15}$/)) errors.phoneNumber = "Phone number must be 10-15 digits.";
    if (!formData.bio.trim()) errors.bio = "Bio is required.";
    return Object.keys(errors).length > 0 ? errors : null;
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.username.trim() &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) &&
      formData.dateOfBirth &&
      ["Male", "Female", "Other"].includes(formData.gender) &&
      formData.speciality &&
      formData.phoneNumber.replace(/\D/g, "").match(/^\d{10,15}$/) &&
      formData.bio.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Client-side validation
      const validationErrors = validateForm();
      if (validationErrors) {
        setFieldErrors(validationErrors);
        const errorMsg = Object.values(validationErrors).join(" ");
        throw new Error(errorMsg);
      }

      // Retrieve hospitalId and authToken
      const hospitalData = JSON.parse(localStorage.getItem("hospitalData")) || {};
      const hospitalId = hospitalData.hospitalId;
      const authToken = localStorage.getItem("authToken");

      if (!hospitalId) {
        throw new Error("Hospital ID not found. Please sign in again.");
      }
      if (!authToken) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      // Log formData for debugging
      console.log("FormData state:", formData);

      // Clean and validate phone number
      const cleanedPhoneNumber = formData.phoneNumber.replace(/\D/g, "");
      if (!cleanedPhoneNumber.match(/^\d{10,15}$/)) {
        throw new Error("Phone number must be 10-15 digits.");
      }

      // Convert dateOfBirth to ISO format
      let isoDateOfBirth;
      try {
        isoDateOfBirth = new Date(formData.dateOfBirth).toISOString();
      } catch {
        throw new Error("Invalid date of birth format.");
      }

      // Prepare JSON payload
      const payload = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email,
        dateOfBirth: isoDateOfBirth,
        gender: formData.gender,
        speciality: formData.speciality,
        phoneNumber: Number(cleanedPhoneNumber),
        bio: formData.bio.trim(),
        hospital: hospitalId,
      };

      if (file) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        payload.image = await base64Promise;
      }

      // Log payload for debugging
      console.log("Request payload:", payload);

      // Send POST request
      const url = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/hospitals/create-doctor`
        : "https://ilarocare-backend-production.up.railway.app/api/hospitals/create-doctor";

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Handle success
      setSuccess(response.data.message || "Doctor created successfully");
      toast.success(response.data.message || "Doctor created successfully", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        setLocation("/doctors");
      }, 2000);
    } catch (err) {
      // Log detailed error
      console.error("Error response:", err.response?.data);
      const backendErrors = err.response?.data?.error;
      if (Array.isArray(backendErrors)) {
        const newFieldErrors = {};
        backendErrors.forEach(({ field, message }) => {
          newFieldErrors[field] = message;
        });
        setFieldErrors(newFieldErrors);
        setError("Validation failed. Please check the form.");
      } else {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to create doctor. Please try again.";
        setError(errorMsg);
      }
      toast.error(errorMsg || "Validation failed. Please check the form.", {
        duration: 4000,
        position: "top-center",
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("hospitalData");
        setLocation("/signin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <header className="bg-blue-800 text-white p-4">
        <h1 className="text-xl font-bold">IlaroCARE</h1>
      </header>
      <div className="max-w-6xl mt-8 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h1>

          {success && (
            <p className="text-green-600 mb-4">{success} Redirecting in 2 seconds...</p>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="doctor-image" className="text-gray-700">
                    Doctor Photo
                  </label>
                  <div
                    className="border-4 border-blue-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Doctor preview"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    ) : (
                      <>
                        <svg
                          className="h-10 w-10 text-blue-500 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-gray-500 text-center">
                          Click to upload <br />
                          <span className="text-sm text-gray-400">
                            PNG, JPG <span className="text-red-500">(max. 5MB)</span>
                          </span>
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      id="doctor-image"
                      name="image"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg"
                      className="hidden"
                    />
                  </div>
                </div>

                {filePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilePreview(null);
                      setFile(null);
                      fileInputRef.current.value = "";
                    }}
                    className="w-full border border-red-500 text-red-500 hover:bg-red-50 rounded py-2"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Doctor Information */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
                      Doctor Information
                    </h2>

                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-gray-800">
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full p-2 text-gray-700 border rounded ${fieldErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {fieldErrors.fullName && (
                        <p className="text-red-500 text-sm">{fieldErrors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="username" className="text-gray-800">
                        Username<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="johndoe"
                        className={`w-full p-2 text-gray-700 border rounded ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {fieldErrors.username && (
                        <p className="text-red-500 text-sm">{fieldErrors.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="text-gray-800">
                        Date of Birth<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`w-full p-2 text-gray-700 border rounded ${fieldErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {fieldErrors.dateOfBirth && (
                        <p className="text-red-500 text-sm">{fieldErrors.dateOfBirth}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="gender" className="text-gray-800">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${fieldErrors.gender ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {fieldErrors.gender && (
                        <p className="text-red-500 text-sm">{fieldErrors.gender}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="speciality" className="text-gray-800">
                        Specialty<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="speciality"
                        name="speciality"
                        value={formData.speciality}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${fieldErrors.speciality ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      >
                        <option value="">Select Doctor Specialty</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Oncology">Oncology</option>
                        <option value="Pharmacist">Pharmacist</option>
                      </select>
                      {fieldErrors.speciality && (
                        <p className="text-red-500 text-sm">{fieldErrors.speciality}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="text-gray-800">
                        Phone Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+234 800 000 0000"
                        className={`w-full p-2 text-gray-700 border rounded ${fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {fieldErrors.phoneNumber && (
                        <p className="text-red-500 text-sm">{fieldErrors.phoneNumber}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-gray-800">
                        Email<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email@example.com"
                        className={`w-full p-2 text-gray-700 border rounded ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {fieldErrors.email && (
                        <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-gray-800">
                    Bio<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full p-2 border rounded ${fieldErrors.bio ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter doctor bio..."
                    required
                  ></textarea>
                  {fieldErrors.bio && (
                    <p className="text-red-500 text-sm">{fieldErrors.bio}</p>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setLocation("/doctors")}
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isFormValid()}
                    className={`${isLoading || !isFormValid()
                      ? "bg-blue-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                      } text-white px-6 py-3 rounded-xl font-medium border border-blue-600 flex items-center`}
                  >
                    {isLoading ? "Creating..." : "Create Doctor"}
                    {!isLoading && (
                      <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}