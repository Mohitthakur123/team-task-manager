import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/signup", formData);

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />

          <select
            name="role"
            onChange={handleChange}
          >
            <option value="member">
              Member
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?
          {" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;