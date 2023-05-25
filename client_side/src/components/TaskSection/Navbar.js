import React from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../../../node_modules/bootstrap/dist/js/bootstrap.js";
import { Link } from "@reach/router";
import "../../Styles.css"
import Profile from "./Profile";
const Navbar=({logOutCallback})=> {
  return (
    <>
      <nav className="navbar navbar-expand-lg py-3 px-4 ">
        <a className="navbar-brand text-warning" href="#!">
          TASKMASTER
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mx-3">
            <li className="nav-item">
            <Link to="/protected/profile" className="nav-link nav-link-ltr" id="link_tag" >View Profile</Link>
            </li>
            
          </ul>
          
          <button
            className="btn btn-warning my-4 my-sm-0"
            type="submit"
            onClick={logOutCallback}
          >
            <Link to="/" className="text-decoration-none" id="link_text_btn">Log out</Link>
          </button>
          
        </div>
      </nav>
      {/* <Outlet/> */}
    </>
  );
}

export default Navbar;
