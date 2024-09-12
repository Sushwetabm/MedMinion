import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import styles from "./styles.module.css";


const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
  });
  const [error,setError]=useState("")
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("hihihi");
      let Name = data.name;
      let email = data.email;
      let phone = data.phone;
      let dateOfBirth = data.dateOfBirth;
      let password = data.password;
      const  result = await axios.post(
        "http://localhost:5000/patient/signup",
        { Name, email, phone, dateOfBirth, password },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        }
	)
	  console.log(result)
      setData({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        password: "",
      });
      navigate("/mainpage");
    } catch (error) {
		if (
			error.response &&
			error.response.status >= 400 &&
			error.response.status <= 500
		) {
			setError(error.response.data.message);
		}
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/userlogin">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              onChange={handleChange}
              value={data.name}
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="phone"
              placeholder="Phone Number"
              name="phone"
              onChange={handleChange}
              value={data.phone}
              required
			  minLength={10}
			  maxLength={10}
              className={styles.input}
            />
            <input
              type="Date"
              placeholder="Date of Birth"
              name="dateOfBirth"
              onChange={handleChange}
              value={data.dateOfBirth}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
             {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
