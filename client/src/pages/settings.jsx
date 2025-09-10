import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import EmergencyAlertModal from "@/components/emergency-alert-modal";

// Profile form schema
const profileSchema = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  accountType: "personal",
};

// Medical info form schema
const medicalInfoSchema = {
  bloodType: "",
  height: "",
  weight: "",
  dateOfBirth: "",
  primaryCareProviderName: "",
  primaryCareProviderFacility: "",
  primaryCareProviderPhone: "",
};

// Contact form schema
const contactSchema = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
  notifyBySms: true,
  notifyByCall: true,
  notifyByApp: true,
  isPrimary: false,
};

export default function Settings() {
  // const { user, logoutMutation } = useAuth();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      accountType: "personal",
    },
  });


  const contactForm = useForm({
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
      notifyBySms: true,
      notifyByCall: true,
      notifyByApp: true,
      isPrimary: false,
    },
  });

  const onProfileSubmit = (data) => {
    console.log("Profile updated:", data);
  };

  const onMedicalInfoSubmit = (data) => {
    console.log("Medical info updated:", data);
  };

  const onContactSubmit = (data) => {
    console.log("Contact added:", data);
  };

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-600">
      <Header onEmergencyClick={handleEmergencyClick} />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-semibold text-neutral-800 font-poppins">Settings</h1>
            <p className="mt-1 mb-2 text-sm text-neutral-600">Manage your account and preferences.</p>
          </div>
          

            
            {/* Profile Tab */}
            <div value="profile">
              <div className="px-4 sm:px-0">
                <div className="border border-gray-600 rounded-xl ">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hospital Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} className="rounded"  />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
     
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} className="rounded"  />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        

                        
                        <FormField
                          control={profileForm.control}
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                className="w-full border rounded p-2"
                              >
                                <option disabled value="private">Private</option>
                                <option value="public">Public</option>
                              </select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" className=" bg-blue-800 rounded text-white hover:bg-blue-900 ">Save Changes</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </div>
              </div>
            </div>
            

          
        </div>
      </main>
      
      <Footer />
      
      <EmergencyAlertModal 
        isOpen={isEmergencyModalOpen} 
        setIsOpen={setIsEmergencyModalOpen}
      />
    </div>
  );
}

function Label({ htmlFor, className, children }) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`text-sm font-medium text-neutral-600 mb-1 block ${className}`}
    >
      {children}
    </label>
  );
}
