import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/user/Login";

// User Pages
import FormPage from "./pages/user/Form";
import AppointmentBookingPage from "./pages/user/AppointmentBooking";
import RecordPage from "./pages/user/Record";
import HomePage from "./pages/user/Home";

// Staff Pages
import AppointmentSchedulePage from "./pages/staff/AppointmentSchedule";
import MedicalRecordsPage from "./pages/staff/MedicalRecords";
import StatisticsPage from "./pages/staff/Statistics";
import StaffHomePage from "./pages/staff/StaffHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="form" element={<FormPage />} />
        <Route path="appointment" element={<AppointmentBookingPage />} />
        <Route path="record" element={<RecordPage />} />
        <Route path="home" element={<HomePage />} />

        <Route path="appointment-schedule" element={<AppointmentSchedulePage />} />
        <Route path="medical-records" element={<MedicalRecordsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="staff-home" element={<StaffHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
