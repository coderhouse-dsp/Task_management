import React from "react";
import { Link } from "@reach/router";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../Styles.css"
const Navigation = ({ logOutCallback }) => (
  <div className="container form ">
    
      <button className="btn btn-primary mx-2">
        <Link to="/login" id="link_text">Login</Link>
      </button>

      <button className="btn btn-primary mx-2" >
        <Link to="/register" id="link_text">Register</Link>
      </button>
      {/* <button onClick={logOutCallback} className="btn btn-primary mx-2">Log Out</button> */}
     
  </div>
);

export default Navigation;
