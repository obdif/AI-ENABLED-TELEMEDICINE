import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Settings from "@/pages/settings";
import EmergencyAlertModal from "@/components/emergency-alert-modal";
import Patients from "@/pages/patients";
import ProtectedRoute from "@/components/protectedRoute";
import DoctorRoute from "@/components/doctorRoute";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import LandingPage from "@/pages/landing-page";
import CreatePatient from "@/pages/create-patient";
import PatientDetails from "@/pages/patient-details";
import EditPatient from "@/pages/edit-patient";
import PatientTable from "./pages/patient-table";
import Consultation from "./pages/consultation";
import TermsAndConditions from "./pages/terms-and-conditions";
import PrivacyPolicy from "./pages/privacy-policy";
import About from "./pages/about-us";
import Doctors from "./pages/doctors";
import CreateDoctor from "./pages/doctors/create-doctor";
import DoctorDashboard from "./pages/doctors/doctor-dashboard";
import DoctorLogin from "./pages/doctors/doctor-login";
import DoctorConsultaion from "./pages/doctors/doctor-consultation";
import DoctorPatient from "./pages/doctors/doctor-create-patient";
import ViewConsultation from "./pages/doctors/ViewConsultaion";
import DoctorPatients from "./pages/doctors/doctor-patients";
import DoctorPatientDetails from "./pages/doctors/patient-detail";
import PatientEdit from "./pages/doctors/patient-edit";


function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/privacy-and-policy" component={PrivacyPolicy} />
      <Route path="/about-us" component={About} />
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>

      <Route path="/doctors">
        <ProtectedRoute component={Doctors} />
      </Route>

      <Route path="/patient-table">
        <ProtectedRoute component={PatientTable} />
      </Route>

      <Route path="/create-patient">
        <ProtectedRoute component={CreatePatient} />
      </Route>

      <Route path="/patient-details/:username">
        <ProtectedRoute component={PatientDetails} />
      </Route>


      <Route path="/patients">
        <ProtectedRoute component={Patients} />
      </Route>

      <Route path="/edit-patient/:username">
        <ProtectedRoute component={EditPatient} />
      </Route>


      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>

      <Route path="/consultation">
        <ProtectedRoute component={Consultation} />
      </Route>



      {/* Doctor Routes */}
      <Route path="/hospital/create-doctor">
        <ProtectedRoute component={CreateDoctor} />
      </Route>

      <Route path="/doctor-login" component={DoctorLogin}></Route>

      <Route path="/doctor-dashboard">
        <DoctorRoute component={DoctorDashboard} />
      </Route>

      <Route path="/doctor-consultations">
        <DoctorRoute component={DoctorConsultaion} />
      </Route>



      <Route path="/doctor-patients">
        <DoctorRoute component={DoctorPatients} />
      </Route>


      <Route path="/doctor-consultation/:username">
        <DoctorRoute component={ViewConsultation} />
      </Route>


  <Route path="/patient-detail/:username">
        <DoctorRoute component={DoctorPatientDetails} />
      </Route>

 <Route path="/patient-edit/:username">
        <DoctorRoute component={PatientEdit} />
      </Route>

      {/* <Route path="/doctor-patient" component={DoctorPatient}></Route> */}

      {/* 404 page */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Router />
        <Toaster />
        <EmergencyAlertModal
          isOpen={isEmergencyModalOpen}
          setIsOpen={setIsEmergencyModalOpen}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
