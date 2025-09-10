"use client"

import { useState } from "react"
import { Shield, Lock, Users, FileText, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react"

export default function TermsAndConditions({ onBack, referrer }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (typeof window !== "undefined") {
      // Check if there's a previous page in history
      if (window.history.length > 1) {
        window.history.back()
      } else {
        // Fallback to home page or dashboard
        window.location.href = "/"
      }
    }
  }

  // Get referrer page name for display
  const getReferrerName = () => {
    if (referrer) {
      switch (referrer) {
        case "dashboard":
          return "Back to Dashboard"
        case "consultation":
          return "Back to Consultation"
        case "profile":
          return "Back to Profile"
        case "settings":
          return " Back to Settings"
        default:
          return " Back "
      }
    }
    return " Back "
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              {getReferrerName()}
            </button>
            <div className="flex items-center ">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
                <p className="text-gray-600 mt-1">IlaroCARE Medical Platform</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Last Updated:</strong> May 2025
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Please read these terms carefully before using the IlaroCARE platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="prose max-w-none">
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to IlaroCARE, a comprehensive medical platform designed to improve emergency response, diagnosis,
                and treatment through secure data sharing and consultation services. By accessing or using our platform,
                you agree to be bound by these Terms and Conditions.
              </p>
            </div>

            {/* Section 1: Consent to Data Use */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Consent to Data Use</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using IlaroCARE, you acknowledge and consent to the collection, storage, and sharing of your medical
                  and personal information for the purpose of improving emergency response, diagnosis, and treatment.
                  This includes:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Medical Records Storage</h4>
                      <p className="text-gray-700">
                        Storing your medical records (e.g., diagnosis history, allergies, treatments) in secure
                        databases to ensure quick access during emergencies and consultations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Information Sharing</h4>
                      <p className="text-gray-700">
                        Sharing your medical information with authorized healthcare providers and hospitals within the
                        IlaroCARE network when necessary for treatment or emergency response.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Data Security */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Data Security</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use advanced encryption and security protocols to protect your information. By using the app, you
                  accept this risk and agree that IlaroCARE will not be held liable for data breaches outside of our
                  control.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Security Measures</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• End-to-end encryption for all data transmissions</li>
                        <li>• Regular security audits and vulnerability assessments</li>
                        <li>• Secure cloud infrastructure with industry-standard protocols</li>
                        <li>• Access controls and authentication mechanisms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Platform Usage</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  You agree to use IlaroCARE only for legitimate medical purposes and in accordance with applicable laws
                  and regulations. Misuse of the platform may result in account suspension or termination.
                </p>
                <p>
                  Healthcare providers using IlaroCARE must maintain valid licenses and certifications in their
                  respective jurisdictions.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitation of Liability</h2>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">
                  IlaroCARE is a platform that facilitates medical consultations and data sharing. We do not provide
                  medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for
                  medical decisions.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Updates to Terms</h2>
              <p className="text-gray-700">
                We may update these Terms and Conditions from time to time. Users will be notified of significant
                changes, and continued use of the platform constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="accept-terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="accept-terms" className="ml-2 text-sm text-gray-700">
                I have read and agree to the Terms and Conditions
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!acceptedTerms}
                className={`px-6 py-2 rounded-md font-medium ${acceptedTerms
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                onClick={() => {
                  if (acceptedTerms) {
                    alert("Terms accepted! Redirecting...")
                    handleBack()
                  }
                }}
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
