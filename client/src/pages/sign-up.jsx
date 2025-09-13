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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import SignHeader from "@/components/sign-header";
import SuccessModal from "../components/success-modal";
import loginSignup from "@/assets/login-signup.jpg";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const SignUp = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  // alert(import.meta.env.VITE_API_BASE_URL);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      type: "",
      address: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      console.log("Sending Sign Up Data:", data);

      let url = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}api/hospitals/register`
        : "https://ilarocare-backend-production.up.railway.app/api/hospitals/register";

      console.log("Sending request to:", url);

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response Status:", response.status);
      console.log("Sign Up Success - Raw Response:", response.data);

      setIsSuccessModalOpen(true); // Open modal only on success
    } catch (error) {
      console.error("Sign Up Error:", error);
      const errorMsg =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        "Failed to connect to the server. Please try again later.";
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
          className="signDiv w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
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
                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: "Hospital type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full rounded">
                            <SelectValue placeholder="Select Hospital Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter hospital address"
                          className="rounded"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <input type="checkbox" name="" id="" required /> I accept and
                  agree to the{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-and-policy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-700 text-white font-bold py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link href="/signin" className="text-[#2563EB] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Image Section with Text */}
          <div className="w-full md:w-1/2 bg-gradient-to-r from-[#2563EB] to-[red] flex flex-col items-center justify-center p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
              Join IlaroCARE
            </h2>
            <p className="text-sm md:text-base mb-6 text-center max-w-xs">
              Register your hospital to connect with our emergency platform.
            </p>
            <img
              src={loginSignup}
              alt="Community collaboration"
              className="w-3/4 md:w-4/5 h-auto object-cover rounded-xl"
            />
          </div>
        </motion.div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        setIsOpen={setIsSuccessModalOpen}
        onSuccess={() => setLocation("/signin")}
      />
    </div>
  );
};

export default SignUp;
