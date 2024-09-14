import "./App.css";
import Landing from "../src/Pages/Landing/Landing.jsx"
import Login from "../src/Pages/login_user/LoginUser";
import Signup from "../src/Pages/signup_user/SignupUser";
import OSignup from "../src/Pages/SignUpOrganiser/SignUpOrganiser";
import OLogin from "../src/Pages/LoginOrganiser/LoginOrganiser"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../src/Pages/MainPage/MainPage.jsx";
import Navbar from "../src/Pages/Navbar/Navbar.jsx";
import Booking from "../src/Pages/forms/booking.js";
import Reschedule from "../src/Pages/forms/reschedule.js"
import Cancel from "../src/Pages/forms/cancel.js"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path="/patientsignup" element={<Signup />} />
          <Route path="/doctorsignup" element={<OSignup />} />
          <Route path="/patientlogin" element={<Login />} />
          <Route path="/doctorlogin" element={<OLogin />} />
          <Route path="/mainpage" element={<MainPage/>}/>
          <Route path="/bookingpage" element={<Booking/>}/>
          <Route path="/reschedulepage" element={<Reschedule/>}/>
          <Route path="/cancelpage" element={<Cancel/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
