
import {
  Shield,
  Eye,
  Database,
  Users,
  Settings,
  ArrowLeft,
  Lock
} from "lucide-react"

export default function PrivacyPolicy({ onBack, referrer }) {
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
          return "Back to Settings"
        default:
          return "Back"
      }
    }
    return "Back"
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
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600 mt-1">IlaroCARE Medical Platform</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-green-800">
                  <strong>Effective Date:</strong> May 2025
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="prose max-w-none">
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                At IlaroCARE, we understand the sensitive nature of medical information and are committed to protecting
                your privacy. This Privacy Policy outlines how we collect, use, store, and protect your personal and
                medical information.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Full name and contact details</li>
                    <li>• Date of birth and gender</li>
                    <li>• Emergency contact information</li>
                    <li>• Insurance information</li>
                    <li>• Government-issued ID numbers</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Medical history and diagnoses</li>
                    <li>• Allergies and medications</li>
                    <li>• Treatment records</li>
                    <li>• Consultation notes</li>
                    <li>• Test results and imaging</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Emergency Response</h4>
                  <p className="text-gray-700 text-sm">
                    Providing critical medical information to emergency responders and healthcare providers during
                    medical emergencies.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Medical Consultations</h4>
                  <p className="text-gray-700 text-sm">
                    Facilitating remote consultations and enabling healthcare providers to access relevant medical
                    history for better diagnosis and treatment.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Platform Improvement</h4>
                  <p className="text-gray-700 text-sm">
                    Analyzing anonymized data to improve our services, develop new features, and enhance user
                    experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-800 mb-3">We share your information only with:</h4>
                <ul className="text-yellow-700 space-y-2">
                  <li>• Authorized healthcare providers within the IlaroCARE network</li>
                  <li>• Emergency medical services when required for treatment</li>
                  <li>• Hospitals and medical facilities involved in your care</li>
                  <li>• Third-party service providers under strict confidentiality agreements</li>
                </ul>
                <p className="text-yellow-800 mt-4 font-medium">
                  We never sell your personal or medical information to third parties.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Data Security Measures</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Lock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Encryption</h4>
                  <p className="text-gray-700 text-sm">End-to-end encryption for all data</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Shield className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Access Control</h4>
                  <p className="text-gray-700 text-sm">Strict authentication protocols</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Eye className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Monitoring</h4>
                  <p className="text-gray-700 text-sm">24/7 security monitoring</p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Access & Correction</h4>
                    <p className="text-blue-800 text-sm">
                      Request access to your personal information and request corrections to inaccurate data.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Data Portability</h4>
                    <p className="text-blue-800 text-sm">
                      Request a copy of your data in a portable format for transfer to another service.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Deletion</h4>
                    <p className="text-blue-800 text-sm">
                      Request deletion of your personal information, subject to legal and medical requirements.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Consent Withdrawal</h4>
                    <p className="text-blue-800 text-sm">
                      Withdraw consent for data processing, though this may limit platform functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have questions about this Privacy Policy or wish to exercise your privacy rights, please
                  contact us:
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Email:</strong> privacy@IlaroCARE.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +234 814 030 8890
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Back Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600 text-sm">
              This Privacy Policy was last updated on May 2025. We may update this policy from time to time, and we
              will notify users of any significant changes.
            </p>
            <button
              onClick={handleBack}
              className="px-12 py-1 flex text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              <p >I Understand</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
