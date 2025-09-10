import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessModal({ isOpen, setIsOpen, onSuccess }) {
  const handleClose = () => {
    setIsOpen(false);
    if (onSuccess) {
      onSuccess(); // Trigger redirect to /signin
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] rounded-full p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
              Signup Successful!
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center text-gray-600 space-y-4">
            <span>
              Thank you for signing up with IlaroCARE! Your account is now under review and will be approved within 24 hours.
            </span>
            <br />
            <span>
              If you do not receive a confirmation email within 2 working days, please{" "}
              <a href="/support" className="text-[#2563EB] hover:underline">
                contact our support team
              </a>.
            </span>
          </DialogDescription>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleClose}
              className="bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] hover:from-[#1D4ED8] hover:to-[#7C3AED] text-white px-6 py-2 rounded-full"
            >
              Got It
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}