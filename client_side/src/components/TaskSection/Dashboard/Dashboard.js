import React from "react";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.css";

import Navbar from "./Navbar";
import TaskList from "../Task/TaskList";
const Dashboard = ({ logOutCallback }) => {
  return (
    <div className="container-fluid dashboard">
      <Navbar logOutCallback={logOutCallback}></Navbar>
      <TaskList></TaskList>
    </div>
  );
};

export default Dashboard;
