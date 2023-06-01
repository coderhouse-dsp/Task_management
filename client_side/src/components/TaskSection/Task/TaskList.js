import React, { useEffect, useState, useContext } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import "../../Styles/Styles.css"
import AddTask from "./AddTask";
import jwt_decode from "jwt-decode";
import { UserContext } from "../../../App";
import axios from "axios";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Swal from "sweetalert2";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [user] = useContext(UserContext);
  const refid = user.accesstoken;
  const userid = jwt_decode(refid);
  


  const fetchTasks = async () => {
    try {
      const refid = userid.userId;
      const response = await (
        await fetch(`http://localhost:4000/fetchtasks/${refid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      const data = response.tasks;
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const result = await Swal.fire({
        title: "Confirmation",
        text: "Are you sure you want to delete this task?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:4000/${taskId}`);
        fetchTasks(); // Refresh the task list after deletion
      }
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  const EditTask = (task) => {
    console.log("Task set edit:", task);
    setSelectedTask(task);
  };

  useEffect(() => {
    // deleteTask();
    fetchTasks();
  }, []);

  const columns = [
    {
      dataField: "title",
      text: "Title",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      style: { maxWidth: "350px" },
    },
    {
      dataField: "duedate",
      text: "Due Date",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => {
        const statusColor = row.status === true ? "green" : "red";
        return (
          <button className={`status-button ${statusColor}`}>
            {row.status === true ? "COMPLETED" : "PENDING"}
          </button>
        );
      },
    },
    {
      dataField: "edit",
      text: "Edit",
      formatter: (cell, row) => (
        <FaPencilAlt className="editIcon" onClick={() => EditTask(row)} />
      ),
    },
    {
      dataField: "delete",
      text: "Delete",
      formatter: (cell, row) => (
        <FaTimes className="delIcon" onClick={() => deleteTask(row.taskid)} />
      ),
    },
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentMonthTasks = tasks.filter((task) => {
    const taskDate = new Date(task.duedate);
    const taskYear = taskDate.getFullYear();
    const taskMonth = taskDate.getMonth() + 1;

    return taskYear === currentYear && taskMonth === currentMonth;
  });
  return (
    <>
      <div className="container-fluid h-100 mt-3 p-5">
        <AddTask fetchTasks={fetchTasks} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
        <div className="row mt-3">
          <div className="col-md-2">
            <p className="text-white">Number of tasks: {tasks.length}</p>
          </div>
          <div className="col-md-auto">
            <select
              id="dropdown"
              className="form-control mb-2"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            >
              <option value="">Search using TaskStatus</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        {tasks.length > 0 ? (
          <>
            <BootstrapTable
              keyField="id"
              data={tasks.filter(
                (task) =>
                  searchValue === "" ||
                  (searchValue === "PENDING" && !task.status) ||
                  (searchValue === "COMPLETED" && task.status)
              )}
              columns={columns}
              bootstrap4
              condensed
              bordered={false}
              pagination={paginationFactory()}
            />
          </>
        ) : (
          <div className="alert alert-danger mt-3" role="alert">
            No task found!
          </div>
        )}
      </div>
    </>
  );
}

export default TaskList;
