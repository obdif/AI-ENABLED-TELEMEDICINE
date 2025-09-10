import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-indigo-100 text-gray-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-red-200 rounded-full opacity-30 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-blue-200 rounded-full opacity-30 bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center p-8 bg-white rounded-2xl shadow-xl max-w-lg border border-blue-100">
        <div className="mb-6">
          <div className="relative inline-block">
            <div className="bg-blue-500 rounded-full p-5">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 animate-bounce">
              404
            </div>
          </div>
        </div>

        {/* Heading and Description */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Whoops! Looks like this page got lost in the cosmos. Don’t worry, let’s navigate back to safety with a single click!
        </p>

        {/* Call to Action */}
        <Link href="/">
          <Button
            variant="destructive"
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="relative z-10 mt-6 text-sm text-gray-500">
        Need help?{" "}
        <a href="/support" className="text-blue-600 hover:underline">
          Contact Support
        </a>
      </div>
    </div>
  );
}