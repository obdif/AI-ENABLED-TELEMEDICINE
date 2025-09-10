import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Shield, ArrowRight, User, Lock } from 'lucide-react';
import { Link, useLocation } from "wouter";
import axios from 'axios'; // Added axios import

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [, setLocation] = useLocation();
  const hasSubmitted = useRef(false); // Track submission to prevent double submits

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || hasSubmitted.current) {
      return;
    }

    hasSubmitted.current = true; // Mark as submitted
    setIsSubmitting(true);

    try {
      console.log("Sending login request with:", formData);
      const response = await axios.post("http://localhost:8080/api/doctors/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      console.log("Server response:", data);

      if (data.status === "success") {
        // Try multiple possible token locations, including sessionToken
        const token = data.data?.authentication?.sessionToken || data.data?.authentication?.token || data.data?.token || data.token;
        const doctorData = data.data?.doctor || data.data;

        if (token) {
          localStorage.setItem("doctorAuthToken", token);
          console.log("Stored doctorAuthToken:", localStorage.getItem("doctorAuthToken")); // Debug token
        } else {
          console.error("No token found in response:", data);
          setMessage({ text: "Login successful, but no token received. Contact support.", type: "error" });
          hasSubmitted.current = false;
          return;
        }

        if (doctorData) {
          localStorage.setItem("doctorData", JSON.stringify(doctorData));
          console.log("Stored doctorData:", localStorage.getItem("doctorData")); // Debug doctor data
        } else {
          console.warn("No doctor data found in response, using empty object.");
          localStorage.setItem("doctorData", "{}");
        }

        setMessage({ text: "Login successful! Redirecting to dashboard...", type: "success" });
        setTimeout(() => {
          console.log("Redirecting to /doctor-dashboard"); // Debug redirect
          setLocation("/doctor-dashboard");
          hasSubmitted.current = false; // Reset submission flag after redirect
        }, 2000);
      } else {
        setMessage({ text: data.message || "Login failed. Please check your credentials.", type: "error" });
        hasSubmitted.current = false; // Reset on failure
        if (data.errors) {
          console.log("Validation errors:", data.errors);
        }
      }
    } catch (error) {
      console.error("Login error:", error.message || error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        setMessage({ text: error.response.data.message || "An error occurred during login. Please try again.", type: "error" });
      } else if (error.request) {
        console.error("No response received:", error.request);
        setMessage({ text: "Network error. Please check your internet connection.", type: "error" });
      } else {
        setMessage({ text: "An error occurred during login setup. Please try again.", type: "error" });
      }
      hasSubmitted.current = false; // Reset on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-3 mr-3">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">IlaroCARE</h1>
              </div>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Portal</h2>
            <p className="text-gray-600">Sign in to access your medical dashboard</p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 outline-none rounded-xl py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="doctor@hospital.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl outline-none  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || hasSubmitted.current}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition-all duration-200 ${(isSubmitting || hasSubmitted.current)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need access?{" "}
              <button className="text-blue-600 hover:text-blue-500 font-medium">
                Contact Administrator
              </button>
            </p>
          </div>
        </div>

        {/* Right Side - Medical Theme */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10">
              <Shield className="h-16 w-16" />
            </div>
            <div className="absolute top-32 right-16">
              <Shield className="h-12 w-12" />
            </div>
            <div className="absolute bottom-32 left-16">
              <Shield className="h-14 w-14" />
            </div>
            <div className="absolute bottom-16 right-12">
              <Shield className="h-10 w-10" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <div className="bg-white/20 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                <Shield className="h-12 w-12" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Welcome Back, Doctor</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-md">
                Access your patient consultations, medical records, and emergency response tools
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 text-left max-w-sm">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-blue-100">HIPAA Compliant & Secure</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-blue-100">Real-time Patient Data</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-blue-100">Emergency Response Ready</span>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-blue-200">Hospitals</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-xs text-blue-200">Patients</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-xs text-blue-200">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}