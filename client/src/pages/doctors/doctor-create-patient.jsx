import React, { useState } from "react";
import { useLocation } from "wouter";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

const CreatePatient = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [apiError, setApiError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setSuccess(null);
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccess(null);
    setApiError(null);

    try {
      const token = localStorage.getItem("doctorAuthToken");
      if (!token) {
        setApiError("No authentication token found. Redirecting to sign-in...");
        setTimeout(() => setLocation("/doctor-login"), 2000);
        return;
      }

      const response = await axios.post(
        "https://ilarocare-backend-production.up.railway.app/api/doctors/create-patient",
        {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          fullname: formData.fullname.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Patient created successfully!");
      setFormData({ username: "", email: "", password: "", fullname: "" });
      setTimeout(() => setLocation("/patients"), 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.response?.data?.message || error.message;
      setApiError(errorMsg || "Failed to create patient. Please try again.");
      if (errorMsg.includes("unauthenticated") || errorMsg.includes("token")) {
        setTimeout(() => setLocation("/signin"), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ username: "", email: "", password: "", fullname: "" });
    setErrors({});
    setSuccess(null);
    setApiError(null);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 font-poppins">
            Create New Patient
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Cancel and return to dashboard"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., bayo"
              className={`mt-1 w-full px-4 py-2 border ${errors.username ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
              disabled={isLoading}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : null}
            />
            {errors.username && (
              <p id="username-error" className="mt-1 text-sm text-red-600">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., bayo@gmail.com"
              className={`mt-1 w-full px-4 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : null}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`mt-1 w-full px-4 py-2 border ${errors.password ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : null}
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="e.g., Bayo Ade"
              className={`mt-1 w-full px-4 py-2 border ${errors.fullname ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
              disabled={isLoading}
              aria-invalid={!!errors.fullname}
              aria-describedby={errors.fullname ? "fullname-error" : null}
            />
            {errors.fullname && (
              <p id="fullname-error" className="mt-1 text-sm text-red-600">
                {errors.fullname}
              </p>
            )}
          </div>

          {success && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {apiError && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700">{apiError}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 py-2 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Patient"
              )}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 py-2"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatient;
