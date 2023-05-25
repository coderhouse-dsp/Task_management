import React, { useState, useContext, useEffect } from "react";
import { navigate } from "@reach/router";
import { UserContext } from "../App";
import { Link } from "@reach/router";
import Swal from "sweetalert2";
const Login = () => {
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Enter email",
        confirmButtonColor: "#0d6efd",
      });
    } else if (!password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Enter Password",
        confirmButtonColor: "#0d6efd",
      });
    } else {
      const result = await (
        await fetch("http://localhost:4000/login", {
          method: "POST",
          credentials: "include", // Needed to include the cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
      ).json();

      if (result.accesstoken) {
        setUser({
          accesstoken: result.accesstoken,
        });
        Swal.fire({
          icon: "success",
          title: "Yay...",
          text: "Logged in successfully!",
          confirmButtonColor: "#008000",
        });
        navigate("/protected");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oopss!!!",
          text: result.error,
          confirmButtonColor: "#0d6efd",
        });
        console.log(result.error);
      }
    }
  };

  useEffect(() => {
  }, [user]);

  const handleChange = (e) => {
    if (e.currentTarget.name === "email") {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };

  return (
    <div className="container form mt-5 p-5">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <hr></hr>
        <div className="form-group mt-4">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input
            className="form-control mt-2"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter Email"
            autoComplete="email"
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="exampleInputEmail1">Password</label>
          <input
            className="form-control mt-2"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={password}
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter Password"
            autoComplete="password"
          />
        </div>
        <p className="mt-3">
          Not signed up yet? &nbsp;
          <Link to="/register" id="link_text">
            Register here
          </Link>
        </p>
        <button type="submit" className="btn btn-warning mt-3">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
