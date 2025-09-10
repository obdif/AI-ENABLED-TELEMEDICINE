"use client"

import { useState } from "react"
import { ArrowLeft, Heart, Shield, Users, Clock, Hospital, Lock, Target, Award, Globe, CheckCircle, Star, Phone, Mail, MapPin } from 'lucide-react'

export default function AboutUs({ onBack, referrer }) {
  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = "/"
      }
    }
  }

  // Get referrer page name for display
  const getReferrerName = () => {
    if (referrer) {
      switch (referrer) {
        case "dashboard":
          return "Dashboard"
        case "consultation":
          return "Consultation"
        case "home":
          return "Home"
        case "contact":
          return "Contact"
        default:
          return "Previous Page"
      }
    }
    return "Previous Page"
  }

  const stats = [
    { icon: Clock, label: "Response Time Reduction", value: "63%", color: "text-blue-600" },
    { icon: Hospital, label: "Connected Hospitals", value: "500+", color: "text-green-600" },
    { icon: Users, label: "Families Protected", value: "50K+", color: "text-purple-600" },
    { icon: Shield, label: "Uptime Guarantee", value: "99.9%", color: "text-red-600" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Family First",
      description: "Every feature we build is designed with families in mind, ensuring your loved ones are protected.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Military-grade encryption and HIPAA compliance ensure your medical data remains secure.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Clock,
      title: "Speed Matters",
      description: "In emergencies, every second counts. Our platform is built for instant response.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We listen to our users and continuously improve based on real family needs.",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Executive Officer",
      bio: "Former ER physician with 15+ years of emergency medicine experience.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "James Rodriguez",
      role: "Chief Technology Officer",
      bio: "Healthcare technology veteran with expertise in secure medical data systems.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Maria Chen",
      role: "Chief Medical Officer",
      bio: "Board-certified emergency physician and healthcare innovation leader.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "David Thompson",
      role: "VP of Engineering",
      bio: "Security expert specializing in HIPAA-compliant healthcare platforms.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const milestones = [
    { year: "2020", event: "IlaroCARE founded by emergency medicine physicians" },
    { year: "2021", event: "First 1,000 families protected, HIPAA compliance achieved" },
    { year: "2022", event: "100+ hospital partnerships, family tracking features launched" },
    { year: "2023", event: "500+ hospital network, 25,000 families protected" },
    { year: "2024", event: "50,000+ families, enterprise solutions launched" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to {getReferrerName()}
            </button>
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">About IlaroCARE</h1>
                <p className="text-gray-600 mt-1">Your Family's Safety & Health Connection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              IlaroCARE connects your family's medical information with cutting-edge safety features for instant
              emergency response when every second counts. We believe that access to critical health information
              shouldn't be limited by time, location, or circumstances.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 font-medium">
                "Our vision is a world where every family has instant access to life-saving medical information during
                emergencies, reducing response times and saving lives."
              </p>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Impact by the Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  IlaroCARE was founded in 2020 by a team of emergency medicine physicians who witnessed firsthand the
                  critical delays caused by lack of immediate access to patient medical information during emergencies.
                </p>
                <p>
                  After seeing too many cases where precious time was lost trying to gather medical history, allergies,
                  and medication information, our founders knew there had to be a better way to connect families with
                  their healthcare providers.
                </p>
                <p>
                  Today, IlaroCARE has grown into a comprehensive platform that not only provides instant medical
                  information access but also includes family safety features, location tracking, and emergency alert
                  systems - all while maintaining the highest standards of privacy and security.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Timeline</h3>
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mr-3 mt-0.5">
                      {milestone.year}
                    </div>
                    <p className="text-sm text-gray-700">{milestone.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className={`rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center ${value.color}`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Compliance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-gray-600">
                Full compliance with healthcare privacy regulations and patient data protection standards.
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SOC 2 Certified</h3>
              <p className="text-sm text-gray-600">
                Independently audited security controls and data protection measures.
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FDA Registered</h3>
              <p className="text-sm text-gray-600">
                Registered medical device software with the Food and Drug Administration.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600">24/7 Emergency Support</p>
              <p className="text-blue-600 font-medium">1-800-IlaroCARE</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">General Inquiries</p>
              <p className="text-green-600 font-medium">hello@IlaroCARE.com</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Headquarters</h3>
              <p className="text-gray-600">San Francisco, CA</p>
              <p className="text-purple-600 font-medium">123 Health Street</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Family?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of families who trust IlaroCARE for their safety and emergency medical needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Get Started Free
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Contact Sales
            </button>
          </div>
          <p className="text-sm mt-4 opacity-75">Setup takes less than 15 minutes • 14-day free trial</p>
        </div>
      </div>
    </div>
  )
}
