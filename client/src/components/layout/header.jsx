import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { Link, useLocation } from "wouter";
import { Settings, LogOut, Menu } from "lucide-react";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import PropTypes from "prop-types";
import EmergencyAlertModal from "@/components/emergency-alert-modal"



export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const hospitalData = JSON.parse(localStorage.getItem("hospitalData")) || {};
  const hospitalName = hospitalData.name || "Hospital";


  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
   const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("hospitalData");
    // Dispatch storageChange event to update other components
    window.dispatchEvent(new Event("storageChange"));
    // Redirect to signin
    setLocation("/signin");
  };


  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  
  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };
  


  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/dashboard">
              <a className="flex items-center">
                <Logo size="sm" />
              </a>
            </Link>
            <nav className="hidden md:flex space-x-8 ml-10">
              {/* <Link href="/dashboard">
                <a className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Dashboard</a>
              </Link> */}
              <Link href="/patients">
                <a className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Patients</a>
              </Link>

              <Link href="/doctors">
                <a className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Doctors</a>
              </Link>

              <Link href="/family-safety">
                <a className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Family Safety</a>
              </Link>

              <Link href="/consultation">
                <a className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Consultation</a>
              </Link>

              <Link href="/settings">
                <a className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Settings</a>
              </Link>
            </nav>
          </div>
          
   {/* Right side actions */}
          <div className=" flex items-center space-x-4">

              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleEmergencyClick}
                className="bg-red-600 text-white rounded hover:bg-red-700"
              >
                Emergency Search
              </Button>

              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
                className="bg-red-600 logout rounded-xl text-white rounded hover:bg-red-700 "
              >
                Logout
                <LogOut className="ml-2 h-5 w-5" />
              </Button>

          </div>
          

          {/* Mobile Menu Button */}
          <div className="bg-white md:hidden">
            <Sheet className="bg-white" open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 " />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white" side="left">
                <div className="py-4 ">
                  <Link href="/dashboard">
                    <a className="flex items-center mb-6">
                      <Logo size="sm" />
                    </a>
                  </Link>
                  <nav className="flex flex-col space-y-4">
                    {/* <Link href="/dashboard">
                      <a className="text-neutral-600 hover:text-neutral-900 py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </a>
                    </Link> */}
                    <Link href="/patients">
                      <a className="text-neutral-600 hover:text-neutral-900 py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                        Patients
                      </a>
                    </Link>
                    <Link href="/doctors">
                      <a className="text-neutral-600 hover:text-neutral-900 py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                        Doctors
                      </a>
                    </Link>

                    <Link href="/family-safety">
                      <a className="text-neutral-600 hover:text-neutral-900 py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                        Family Safety
                      </a>
                    </Link>
                    <Link href="/consultation">
                      <a className="text-neutral-600 hover:text-neutral-900 py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                        Consultation
                      </a>
                    </Link>
                    <Link href="/settings">
                      <a className="text-neutral-600 hover:text-neutral-900 py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                        Settings
                      </a>
                    </Link>
                  <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
                className="bg-red-600 rounded-xl text-white rounded hover:bg-red-700"
              >
                Logout
                <LogOut className="ml-2 h-5 w-5" />
              </Button>
                    {/* <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleEmergencyClick}
                      className="bg-red-600  rounded hover:bg-red-700"
                    >
                      Emergency
                    </Button> */}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
       
        </div>
      </div>
            <EmergencyAlertModal 
        isOpen={isEmergencyModalOpen} 
        setIsOpen={setIsEmergencyModalOpen}
      />
    </header>
  );
}

Header.propTypes = {
  onEmergencyClick: PropTypes.func,
};