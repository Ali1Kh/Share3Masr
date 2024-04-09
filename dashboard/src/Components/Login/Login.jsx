import React from "react";
import $ from "jquery";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  async function login() {
    let phone = $("#phone").val();
    let password = $("#password").val();

    if (phone == "" || password == "") {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      let { data } = await axios.post(
        "https://foodyproj.onrender.com/user/adminLogin",
        {
          phone,
          password,
        }
      );
      if (data.success) {
        navigate("dashboard");
        sessionStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="vh-100">
      <div className="container h-75 d-flex flex-column justify-content-center align-items-center">
        <h5>Login To Dashboard</h5>
        <div className="form">
          <div className="mb-3 mt-4 ">
            <input
              type="tel"
              className="form-control pe-3"
              placeholder="Phone Number"
              id="phone"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control pe-3"
              placeholder="Password"
              id="password"
            />
          </div>
          <button onClick={login} className="btn btn-primary mt-2 w-100">
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
