import { Button } from "@/components/ui/button";
import Logo from "@/components/logo"; // Assuming Logo uses default export
import { Link } from "wouter";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import PropTypes from "prop-types";

function SignHeader({  }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  


  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Logo size="sm" />
              </a>
            </Link>
            <nav className="hidden md:flex space-x-8 ml-10">
              {/* <Link href="/dashboard">
                <a className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Dashboard</a>
              </Link> */}
              
            </nav>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
    
              <SheetContent side="left">
                <div className="py-4">
                  <Link href="/">
                    <a className="flex items-center mb-6">
                      <Logo size="sm" />
                    </a>
                  </Link>
                  {/* <nav className="flex flex-col space-y-4">
                    <Link href="/dashboard">
                      <a className="text-neutral-600 hover:text-neutral-900 py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </a>
                    </Link>
                  </nav> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
      
        </div>
      </div>
    </header>
  );
}

SignHeader.propTypes = {
  onEmergencyClick: PropTypes.func,
};

export default SignHeader; // Changed to default export