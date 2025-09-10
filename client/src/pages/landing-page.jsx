import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Logo from "@/components/logo";
import {
  Shield,
  HeartPulse,
  Smartphone,
  Map,
  Bell,
  Activity,
  ArrowRight,
  CheckCircle,
  Users,
  AlertTriangle,
  Hospital,
  Clock,
  Phone,
} from "lucide-react";
import EmergencyAlertModal from "@/components/emergency-alert-modal";
import ChatWidget from "@/components/chat/ChatWidget";
import axios from "axios";

export default function LandingPage() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      // console.log("Checking auth status - Token in localStorage:", token);
      setIsAuthenticated(!!token);
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      // console.log("Storage change event triggered");
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storageChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storageChange", handleStorageChange);
    };
  }, []);

  const features = [
    {
      title: "Medical Records Access",
      description:
        "Securely store and access your family's complete medical history, allergies, medications, and emergency information.",
      icon: HeartPulse,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Family Safety",
      description:
        "Track the real-time location of family members and receive notifications when they arrive at or leave important places.",
      icon: Map,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Emergency Alerts",
      description:
        "Send instant emergency alerts to your trusted contacts and nearby emergency services with your exact location.",
      icon: Bell,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Hospital Integration",
      description:
        "Connect directly with healthcare providers to share medical information during emergencies.",
      icon: Activity,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Multiple Alert Methods",
      description:
        "Trigger alerts through voice commands, motion detection, or manual activation for any emergency situation.",
      icon: Smartphone,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Privacy Protection",
      description:
        "Your sensitive data is encrypted and secure, with complete control over what information is shared during emergencies.",
      icon: Shield,
      color: "bg-slate-100 text-slate-600",
    },
  ];

  const testimonials = [
    {
      quote:
        "IlaroCARE gave our family peace of mind knowing we're connected during emergencies. When my husband had a medical crisis, paramedics had immediate access to his heart condition history.",
      author: "Lisa Chen",
      title: "Family Plan User",
    },
    {
      quote:
        "As an ER doctor, having instant access to a patient's medical history and allergies through IlaroCARE has made critical care decisions faster and safer.",
      author: "Dr. Sarah Johnson",
      title: "Emergency Physician",
    },
    {
      quote:
        "The family tracking feature helps me know my children are safe when they're traveling to and from school. The emergency alert system is intuitive and simple to use.",
      author: "Michael Rodriguez",
      title: "Parent of Two",
    },
  ];

  const stats = [
    { value: "15k+", label: "Families Protected" },
    { value: "94%", label: "User Satisfaction" },
    { value: "500+", label: "Medical Partners" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Logo size="md" withText />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="font-medium text-neutral-600 hover:text-primary-600 transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-medium text-neutral-600 hover:text-primary-600 transition"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="font-medium text-neutral-600 hover:text-primary-600 transition"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="font-medium text-neutral-600 hover:text-primary-600 transition"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Button
                variant="destructive"
                size="sm"
                onClick={handleEmergencyClick}
                className="bg-red-600 text-white rounded hover:bg-red-700"
              >
                Emergency
              </Button> */}

              {/* <Link 
              to={isAuthenticated ? "/dashboard" : "/signin"}
               className="bg-blue-600 text-white rounded hover:bg-blue-700"
                
              >
              <Button>
                {isAuthenticated ? "Dashboard" : "Sign in"}
              </Button>
              </Link> */}

              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-blue-600 text-white rounded hover:bg-blue-700">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/#">
                  <Button variant="outline" className="rounded">
                    Get App
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  NEW: Advanced Emergency Response
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
                Your Family's Safety & Health Connection
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mb-10">
                IlaroCARE connects your family's medical information with
                cutting-edge safety features for instant emergency response when
                every second counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <Link href="/signin">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 rounded-xl sm:w-auto px-8 py-6 text-lg hover: border border-blue-600"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link> */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg"
                >
                  Watch Demo
                </Button>
                {/* <Button
                  size="lg"
                  className="w-full rounded-xl sm:w-auto px-8 py-6 text-lg bg-green-600 hover:bg-green-700"
                >
                  Download App
                  <Smartphone className="ml-2 h-5 w-5" />
                </Button> */}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 my-12 md:my-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-white shadow-sm border border-neutral-100"
                >
                  <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 shadow-sm">
                <Clock className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Rapid Response Time
                </h3>
                <p className="text-neutral-700">
                  IlaroCARE reduces emergency response time by up to 63% through
                  instant information sharing.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 shadow-sm">
                <Hospital className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Hospital Connected
                </h3>
                <p className="text-neutral-700">
                  Integrated with over 500 hospitals and healthcare systems
                  nationwide.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border border-amber-200 shadow-sm">
                <Shield className="h-10 w-10 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">HIPAA Compliant</h3>
                <p className="text-neutral-700">
                  Military-grade encryption and complete compliance with medical
                  privacy laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Comprehensive Features
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need to Protect Your Family
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              IlaroCARE combines critical health information access with
              real-time family safety monitoring in one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-400"></div>
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Simple Process
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                How IlaroCARE Works
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                A simple, intuitive platform designed to keep your family
                connected, safe, and healthy.
              </p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-primary-100 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="relative z-10 bg-white rounded-xl p-8 shadow-lg border border-neutral-100">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4 text-center">
                    Create Your Family Profile
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Add medical history & emergency contacts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Upload important medical documents
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Set privacy preferences for emergencies
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="relative z-10 bg-white rounded-xl p-8 shadow-lg border border-neutral-100">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-xl  font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4 text-center">
                    Connect Your Loved Ones
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Invite family members to your safety network
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Add trusted emergency contacts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Configure location-sharing preferences
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="relative z-10 bg-white rounded-xl p-8 shadow-lg border border-neutral-100">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4 text-center">
                    Activate Protection
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Set up automatic emergency response
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Configure safety check-ins and alerts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700">
                        Connect with healthcare providers
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-16 bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-2xl font-semibold mb-4">
                    Ready to protect your family?
                  </h3>
                  <p className="text-neutral-700">
                    Setup takes less than 15 minutes, and our support team is
                    available to help every step of the way.
                  </p>
                </div>
                <div className="md:w-1/3 bg-blue-800 text-white rounded-xl flex justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="px-8">
                      Get Started Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-16 md:py-24 bg-gradient-to-br from-primary-900 to-primary-700 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Success Stories
              </span>
            </div>
            <h2 className="text-3xl text-gray-500 md:text-4xl font-bold mb-4">
              Trusted by Families & Healthcare Providers
            </h2>
            <p className="text-lg text-black opacity-90 max-w-2xl mx-auto">
              Hear from people who rely on IlaroCARE every day to protect what
              matters most.
            </p>
          </div>

          <div className="grid grid-cols-1  md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white-500  text-black backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:shadow-xl transition duration-300"
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-300 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-6  italic text/90">{testimonial.quote}</p>
                <div className="flex   items-center">
                  <div className="w-12 h-12 bg-blue-800 text-black rounded-full  flex items-center justify-center mr-4">
                    <span className="text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-black">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-black/70">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <p className="text-center text-white/60 mb-8 text-sm uppercase tracking-wider">
              Trusted By Leading Organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="w-32 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Hospital className="h-8 w-8 text-white/80" />{" "}
                <span className="ml-2 font-semibold">MedTrust</span>
              </div>
              <div className="w-32 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="h-8 w-8 text-white/80" />{" "}
                <span className="ml-2 font-semibold">SafeGuard</span>
              </div>
              <div className="w-32 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <HeartPulse className="h-8 w-8 text-white/80" />{" "}
                <span className="ml-2 font-semibold">LifeCare</span>
              </div>
              <div className="w-32 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-white/80" />{" "}
                <span className="ml-2 font-semibold">FamilySafe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Pricing
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Choose the Right Plan for Your Family
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Affordable protection for every family size and need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
              <div className="p-6 bg-neutral-50 text-center border-b border-neutral-200">
                <h3 className="text-xl font-semibold mb-2">Basic</h3>
                <div className="text-3xl font-bold">
                  $0
                  <span className="text-lg font-normal text-neutral-500">
                    /month
                  </span>
                </div>
                <p className="text-neutral-600 mt-2">For individuals</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      Medical profile storage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">Emergency alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      24/7 emergency support
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-6 rounded-xl" variant="outline">
                  Choose Plan
                </Button>
              </div>
            </div>

            {/* Family Plan */}
            <div className="border-2 border-primary-500 rounded-xl overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-blue-800 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                MOST POPULAR
              </div>
              <div className="p-6 bg-primary-50 text-center border-b border-primary-200">
                <h3 className="text-xl font-semibold mb-2">Family</h3>
                <div className="text-3xl font-bold">
                  $9.99
                  <span className="text-lg font-normal text-neutral-500">
                    /month
                  </span>
                </div>
                <p className="text-neutral-600 mt-2">
                  For up to 5 family members
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">All Basic features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      Family location tracking
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">Safety check-ins</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      Medication reminders
                    </span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-800 rounded-xl mt-6">
                  Choose Plan
                </Button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
              <div className="p-6 bg-neutral-50 text-center border-b border-neutral-200">
                <h3 className="text-xl font-semibold mb-2">Premium</h3>
                <div className="text-3xl font-bold">
                  $29.99
                  <span className="text-lg font-normal text-neutral-500">
                    /month
                  </span>
                </div>
                <p className="text-neutral-600 mt-2">For large families</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      All Family features
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      Unlimited family members
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      Hospital integration
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-700">
                      Priority emergency response
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-6 rounded-xl" variant="outline">
                  Choose Plan
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-neutral-600">
              All plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-3/4">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to protect your family?
                  </h2>
                  <p className="text-lg text-white/80 mb-6">
                    Join thousands of families who trust IlaroCARE for their
                    safety and emergency medical needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full rounded border-2 border-blue-800 sm:w-auto"
                      >
                        Get Started Free
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full rounded sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <Phone className="h-5 w-5 mr-2" /> Contact Sales
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/4 flex justify-center">
                  <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center">
                    <AlertTriangle className="h-14 w-14 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add ChatModal */}
      <ChatWidget />

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
            <div>
              <Logo size="md" color="white" withText />
              <p className="mt-4">
                Your family's complete safety and health connection in one
                secure platform.
              </p>
              <div className="flex space-x-4 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23Z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.041-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-lg font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-primary-400 transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition">
                    Family Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary-400 transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition">
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/abo-us"
                    className="hover:text-primary-400 transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-400 transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-and-policy"
                    className="hover:text-primary-400 transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-and-conditions"
                    className="hover:text-primary-400 transition"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} IlaroCARE. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <select className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-1 text-sm">
                <option>English (US)</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </footer>

      <EmergencyAlertModal
        isOpen={isEmergencyModalOpen}
        setIsOpen={setIsEmergencyModalOpen}
      />
    </div>
  );
}
