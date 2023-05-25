import React from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../../../node_modules/bootstrap/dist/js/bootstrap.js";
// import { Link } from "@reach/router";
// import { UserContext } from "../../App";
// import { Redirect } from "@reach/router";
import Navbar from "./Navbar";
import TaskTable from "./TaskTable";
const Dashboard = ({ logOutCallback }) => {
  return (
    <div className="container-fluid dashboard">
      <Navbar logOutCallback={logOutCallback}></Navbar>
      <TaskTable></TaskTable>
    </div>
  );
};

export default Dashboard;
