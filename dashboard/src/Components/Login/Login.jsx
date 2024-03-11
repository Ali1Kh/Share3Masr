import React from "react";
import $ from "jquery";
import axios from "axios";
import toast from "react-hot-toast";
export default function Login() {
  async function login() {
    let email = $("#email").val();
    let password = $("#password").val();

    if (email == "" || password == "") {
      toast.error("Please fill all the fields");
      return;
    }

    let { data } = await axios.post(
      "https://foodyproj.onrender.com/user/login",
      {
        email,
        password,
      }
    );
    console.log(data);
    if (data.success) {
      toast.success(data.message);
      localStorage.setItem("token", data.token);
    } else {
      toast.error(data.errors.error);
    }
  }

  return (
    <main className="vh-100">
      <div className="container h-75 d-flex flex-column justify-content-center align-items-center">
        <h5>Login To Dashboard</h5>
        <div className="form">
          <div className="mb-3 mt-4 ">
            <input
              type="email"
              className="form-control px-3"
              placeholder="Email"
              id="email"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control px-3"
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
