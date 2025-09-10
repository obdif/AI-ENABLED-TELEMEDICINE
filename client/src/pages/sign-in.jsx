import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import SignHeader from "@/components/sign-header";
import loginSignup from "@/assets/login-signup.jpg";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    // console.log("onSubmit triggered with data:", data);

    setIsSubmitting(true);
    try {
      // console.log("Sending Sign In Data:", data);

      const url = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/hospitals/login`
        : "http://localhost:8080/api/hospitals/login";

      // console.log("Sending request to:", url);

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Extract sessionToken directly
      const token = response.data.data.authentication.sessionToken;

      if (token) {
        const cleanToken =
          typeof token === "string" && token.startsWith("Bearer ")
            ? token.substring(7)
            : token;

        if (!cleanToken) {
          // console.warn("Cleaned token is empty or invalid:", cleanToken);
          throw new Error("Invalid token format received.");
        }

        // Store token in localStorage
        localStorage.setItem("authToken", cleanToken);
        // console.log("Auth token stored successfully:", cleanToken);

        // Store hospital details from the top level of data
        const dataFields = response.data.data || {};
        if (
          dataFields._id ||
          dataFields.name ||
          dataFields.email ||
          dataFields.type ||
          dataFields.address
        ) {
          const hospitalData = {
            hospitalId: dataFields._id,
            name: dataFields.name,
            email: dataFields.email,
            type: dataFields.type,
            address: dataFields.address,
          };
          try {
            localStorage.setItem("hospitalData", JSON.stringify(hospitalData));
            // console.log("Hospital data stored successfully:", hospitalData);
          } catch (error) {
            // console.error("Failed to store hospital data in localStorage:", error);
          }
        } else {
          // console.warn("No hospital details found in response, proceeding with sign-in.");
        }

        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event("storageChange"));

        // Show success notification
        toast.success("Sign in successful!", {
          duration: 3000,
          position: "top-center",
        });

        // Redirect to dashboard immediately
        setLocation("/dashboard");
      } else {
        throw new Error(
          "Authentication failed. No valid session token received."
        );
      }
    } catch (error) {
      // console.error("Sign In Error:", error);
      const errorMsg =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        "An error occurred during sign-in.";
      toast.error(errorMsg, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen items-center justify-center p-0">
      <Toaster />
      <SignHeader />
      <section className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="signDiv w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden sm:flex-reverse"
        >
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-8 flex flex-col justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="hospital@example.com"
                          className="rounded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="rounded pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-800 rounded text-white font-bold py-6 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#2563EB] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Image Section with Text */}
          <div className="w-full md:w-1/2 bg-gradient-to-r from-[#2563EB] to-[red] flex flex-col items-center justify-center p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Welcome Back
            </h2>
            <p className="text-sm md:text-base mb-6 text-center max-w-xs">
              Sign in as hospital to manage your records, patients and doctors.
            </p>
            <img
              src={loginSignup}
              alt="Team collaboration"
              className="w-2/4 md:w-4/5 h-auto object-cover rounded-xl"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SignIn;
