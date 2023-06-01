import React, { useState } from "react";
import { navigate } from "@reach/router";
import { Link } from "@reach/router";
import Swal from "sweetalert2";
import "../Styles/Styles.css";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFisrtName] = useState("");
  const [lastname, setLastName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstname || !lastname || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "I got it you are in hurry! But every Field is important!",
        confirmButtonColor: "#0d6efd",
      });
    } else {
      const result = await (
        await fetch("http://localhost:4000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
          }),
        })
      ).json();
      if (!result.error) {
        console.log(result.message);
        navigate("/");
      } else {
        console.log(result.error);
      }
    }
  };

  const handleChange = (e) => {
    if (e.currentTarget.name === "email") {
      setEmail(e.currentTarget.value);
    } else if (e.currentTarget.name === "firstname") {
      setFisrtName(e.currentTarget.value);
    } else if (e.currentTarget.name === "lastname") {
      setLastName(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };

  return (
    <div className="container form mt-5 p-5">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <hr></hr>
        <div className="form-group mt-4">
          <label for="exampleInputEmail1">First Name</label>
          <input
            className="form-control mt-2"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={firstname}
            onChange={handleChange}
            type="text"
            name="firstname"
            placeholder="FirstName"
            autoComplete="firstname"
          />
        </div>
        <div className="form-group mt-2">
          <label for="exampleInputEmail1">Last Name</label>
          <input
            className="form-control mt-2"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={lastname}
            onChange={handleChange}
            type="text"
            name="lastname"
            placeholder="LastName"
            autoComplete="lastname"
          />
        </div>
        <div className="form-group mt-2">
          <label for="exampleInputEmail1">Email</label>
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
          <label for="exampleInputEmail1">Password</label>
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
          Already Registered?
          <Link to="/login" id="link_text">
            {" "}
            Log in here
          </Link>
        </p>
        <button type="submit" className="btn btn-warning mt-3">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
