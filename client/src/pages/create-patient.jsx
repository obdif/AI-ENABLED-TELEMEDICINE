import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, ArrowRight, X } from "lucide-react";
import { Header } from "@/components/layout/header";
import axios from "axios";
import { useLocation } from "wouter";

export default function CreatePatient() {
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [, setLocation] = useLocation();

    const handleFieldChange = (index, field, value) => {
        const newFields = [...formFields];
        newFields[index][field] = value;
        setFormFields(newFields);
    };

    const addFormField = () => {
        setFormFields([...formFields, { label: '', value: '' }]);
    };

    const removeFormField = (index) => {
        const newFields = formFields.filter((_, i) => i !== index);
        setFormFields(newFields);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleEmergencyClick = () => {
        setIsEmergencyModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("No authentication token found. Redirecting to sign-in...");
            }

            const formData = new FormData(e.target);
            formData.append(
                'additionalNotes',
                JSON.stringify(
                    formFields.map((field) => ({
                        label: field.label.trim(),
                        value: field.value.trim(),
                    }))
                )
            );
            if (fileInputRef.current.files[0]) {
                formData.append("image", fileInputRef.current.files[0]);
            }

            const createUrl = `http://localhost:8080/api/users/create`;
            const response = await axios.post(createUrl, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            console.log("Create API Response:", response.data);
            setSuccess("Patient created successfully!");
            setTimeout(() => setLocation("/patients"), 2000);
        } catch (err) {
            console.error("Error creating patient:", err.response ? err.response.data : err.message);
            const errorMsg = err.response?.data || err.message || "Failed to create patient.";
            setError(errorMsg);
            if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
                setTimeout(() => setLocation("/signin"), 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onEmergencyClick={handleEmergencyClick} />
            <div className="max-w-6xl mt-8 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Patient Record</h1>

                    {success && (
                        <p className="text-green-600 mb-4">{success} Redirecting in 2 seconds...</p>
                    )}
                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Image Upload */}
                        <div className="lg:col-span-1">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="patient-image" className="text-gray-700">
                                        Patient Photo
                                    </Label>
                                    <div
                                        className="border-4 border-blue-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                                        onClick={triggerFileInput}
                                    >
                                        {filePreview ? (
                                            <img
                                                src={filePreview}
                                                alt="Patient preview"
                                                className="w-full h-64 object-cover rounded-xl"
                                            />
                                        ) : (
                                            <>
                                                <Upload className="h-10 w-10 text-blue-500 mb-2" />
                                                <p className="text-gray-500 text-center">
                                                    Click to upload <br />
                                                    <span className="text-sm text-gray-400">PNG, JPG <span className="text-red-500">(max. 5MB)</span></span>
                                                </p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            id="patient-image"
                                            name="image"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {filePreview && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setFilePreview(null)}
                                        className="w-full border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                        Remove Image
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Patient Information */}
                        <div className="lg:col-span-2">
                            <form id="patient-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
                                            Personal Information
                                        </h2>

                                        <div className="space-y-2">
                                            <Label htmlFor="full-name" className="text-gray-800">
                                                Full Name<span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="full-name"
                                                name="fullname"
                                                placeholder="John Doe"
                                                className="text-gray-700 border-gray-300 rounded"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dob" className="text-gray-800">
                                                Date of Birth<span className="text-red-500">*</span>
                                            </Label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                className="w-full p-2 text-gray-700 justify-start text-left border rounded border-gray-300 font-normal"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gender" className="text-gray-800">
                                                Gender<span className="text-red-500">*</span>
                                            </Label>
                                            <select
                                                name="gender"
                                                className="border w-full p-2 rounded border-gray-300"
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-4">
                                        <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
                                            Contact Information
                                        </h2>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-gray-800">
                                                Address<span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                placeholder="123 Main St"
                                                className="text-gray-700 rounded border-gray-300"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-gray-800">
                                                Phone Numbers<span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phoneNumber"
                                                placeholder="+234 800 000 0000"
                                                className="rounded text-gray-700 border-gray-300"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-800">
                                                Email (Optional)
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                typebv="email"
                                                placeholder="patient@example.com"
                                                className="rounded text-gray-700 border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="space-y-4">
                                    <h2 className="font-semibold text-lg text-blue-800 border-b pb-2">
                                        Medical Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="blood-group" className="text-gray-800">
                                                Blood Group<span className="text-red-500">*</span>
                                            </Label>
                                            <select
                                                name="bloodGroup"
                                                className="w-full p-2 border border-gray-300 rounded text-gray-700"
                                                required
                                            >
                                                <option value="">Select your Blood Group</option>
                                                <option value="a+">A+</option>
                                                <option value="a-">A-</option>
                                                <option value="b+">B+</option>
                                                <option value="b-">B-</option>
                                                <option value="ab+">AB+</option>
                                                <option value="ab-">AB-</option>
                                                <option value="o+">O+</option>
                                                <option value="o-">O-</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="genotype" className="text-gray-700">
                                                Genotype<span className="text-red-500">*</span>
                                            </Label>
                                            <select
                                                name="genotype"
                                                className="w-full border text-gray-700 rounded border-gray-300 p-2"
                                                required
                                            >
                                                <option value="">Select your Genotype</option>
                                                <option value="aa">AA</option>
                                                <option value="as">AS</option>
                                                <option value="ss">SS</option>
                                                <option value="ac">AC</option>
                                                <option value="sc">SC</option>
                                                <option value="cc">CC</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="disability" className="text-gray-700">
                                                Disability
                                            </Label>
                                            <select
                                                name="disability"
                                                className="w-full border border-gray-300 text-gray-700 p-2 rounded"
                                            >
                                                <option value="">Select disability status</option>
                                                <option value="none">None</option>
                                                <option value="physical">Physical</option>
                                                <option value="visual">Visual</option>
                                                <option value="hearing">Hearing</option>
                                                <option value="intellectual">Intellectual</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="allergies" className="text-gray-800">
                                                Known Allergies
                                            </Label>
                                            <Input
                                                id="allergies"
                                                name="allergies"
                                                placeholder="List any allergies by separating them with ',' e.g: egg, beans"
                                                className="text-gray-700 border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic form fields */}
                                {formFields.map((field, index) => (
                                    <div key={index} className="space-y-2 relative">
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Add Title."
                                                required
                                                value={field.label}
                                                onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                                                className="w-full px-4 py-2 capitalize border rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Add Value."
                                                required
                                                value={field.value}
                                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                                className="w-full px-4 py-2 border capitalize rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        {/* Remove Field Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeFormField(index)}
                                            className="absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addFormField}
                                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Add New Field</span>
                                </button>

                                {/* Additional Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-gray-700">
                                        Additional Medical Notes
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="medicalNotes"
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter any additional medical information..."
                                    ></textarea>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setLocation("/patients")}
                                        className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="lg"
                                        type="submit"
                                        disabled={isLoading}
                                        className={`${isLoading
                                            ? 'bg-blue-600 cursor-not-allowed w-full'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            } text-white px-4 py-2 w-full rounded-xl font-medium transition-all sm:w-auto px-6 py-6 text-lg hover:text-white-700 border border-blue-600`}
                                    >
                                        {isLoading ? 'Creating...' : 'Create Patient Record '}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}