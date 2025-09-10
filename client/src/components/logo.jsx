import React from "react";
import { Shield } from "lucide-react";


export default function Logo({
  size = "md",
  color = "primary",
  withText = true,
  className = ""
}) {
  // Define sizes
  const sizes = {
    sm: { icon: "h-6 w-6", text: "text-lg" },
    md: { icon: "h-8 w-8", text: "text-xl" },
    lg: { icon: "h-12 w-12", text: "text-4xl" },
  };

  // Define colors
  const colors = {
    primary: "text-primary-500",
    white: "text-white"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* <svg 
        className={`${sizes[size].icon} ${withText ? "mr-2" : ""} ${colors[color]}`} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M32 8L44 20H36V40H28V20H20L32 8Z" fill="currentColor"/>
        <path d="M52 32C52 42.493 43.493 52 32 52C20.507 52 12 42.493 12 32" stroke="currentColor" strokeWidth="4"/>
        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="4"/>
      </svg> */}
      <Shield className=" h-8 w-8 text-black mb" />
      {withText && (
        <span className={`${sizes[size].text} font-poppins font-bold ${colors[color]}`}>
          IlaroCARE
        </span>
      )}
    </div>
  );
}