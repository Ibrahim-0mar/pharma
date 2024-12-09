import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import PharmacistOverview from "./pages/OverView";
import PharmacistsPage from "./pages/pharmacistsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import Profile from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<PharmacistOverview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="pharmacists" element={<PharmacistsPage />} />
          <Route path="prescription" element={<PrescriptionsPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
