import "./App.css";
import Landing from "../src/Pages/Landing/Landing.jsx"
import Login from "../src/Pages/login_user/LoginUser";
import Signup from "../src/Pages/signup_user/SignupUser";
import OSignup from "../src/Pages/SignUpOrganiser/SignUpOrganiser";
import OLogin from "../src/Pages/LoginOrganiser/LoginOrganiser"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../src/Pages/MainPage/MainPage.jsx";
import Navbar from "../src/Pages/Navbar/Navbar.jsx";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path="/usersignup" element={<Signup />} />
          <Route path="/organisersignup" element={<OSignup />} />
          <Route path="/userlogin" element={<Login />} />
          <Route path="/organiserlogin" element={<OLogin />} />
          <Route path="/mainpage" element={<MainPage/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
