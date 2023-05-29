import React, { useEffect, useState, useContext } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import "../../Styles.css";
import Header from "./Header";
import AddTask from "../TaskSection/AddTask";
import SummaryComponent from "./SummaryComponent";
import jwt_decode from "jwt-decode";
import { UserContext } from "../../App";
import axios from "axios";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

function TaskTable() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({});
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [user] = useContext(UserContext);
  const refid = user.accesstoken;
  const userid = jwt_decode(refid);
  const green  = "#198754"
  // SUMAARY

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
      await axios.delete(`http://localhost:4000/${taskId}`);
      fetchTasks(); // Refresh the task list after deletion
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  const setEditTask = (task) => {
    console.log("Selecting task:", selectedTask);
    setSelectedTask(task);
    console.log("Selected task:", selectedTask);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewDueDate(task.duedate);
  };

  const updateTask = async () => {
    try {
      const response = await fetch(`http://localhost:4000/${selectedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          duedate: newDueDate,
        }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh the task list after editing
        cancelEdit(); // Clear the edit state
      } else {
        console.log("Error updating task:", response.status);
      }
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const cancelEdit = () => {
    setSelectedTask(null);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
  };
  const updateTaskStatus = async (task) => {
    setSelectedTask(task);
    const newStatusValue = searchValue === "PENDING" ? true : false; // Set the new status based on the selected dropdown value
    console.log("Selected task:", selectedTask);
    try {
      const response = await fetch(
        `http://localhost:4000/updatestatus/${selectedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatusValue,
          }),
        }
      );
      console.log("update status response", response);
      if (response.ok) {
        fetchTasks(); // Refresh the task list after updating status
      } else {
        console.log("Error updating task status:", response.status);
      }
    } catch (error) {
      console.log("Error updating task status:", error);
    }
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
          <button
            className={`status-button ${statusColor}`}
            onClick={() => updateTaskStatus(row)}
          >
            {row.status === true ? "COMPLETED" : "PENDING"}
          </button>
        );
      },
    },
    {
      dataField: "edit",
      text: "Edit",
      formatter: (cell, row) => (
        <FaPencilAlt className="editIcon" onClick={() => setEditTask(row)} />
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
        <Header
          showForm={() => setShowAddTask(!showAddTask)}
          changeTextAndColor={showAddTask}
        />
        {showAddTask && <AddTask fetchTasks={fetchTasks} />}
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

        {selectedTask && (
          <div>
            <div className="shadow-lg p-3 mt-5 bg-dark rounded form p-5">
              <form>
                <h3 className="text-white mb-4">Update Task</h3>
                <div className="form-group mt-2 text-white">
                  <label>Title</label>
                  <input
                    className="form-control mt-2 bg-dark text-white"
                    aria-describedby="emailHelp"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    type="text"
                    name="newTitle"
                    placeholder="Enter Title"
                    autoComplete="newTitle"
                  />
                </div>
                <div className="form-group mt-2 text-white">
                  <label>Description</label>
                  <input
                    className="form-control mt-2 bg-dark text-white"
                    aria-describedby="emailHelp"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    type="text"
                    name="newDescription"
                    placeholder="Enter Description"
                    autoComplete="newDescription"
                  />
                </div>
                <div className="form-group mt-2 text-white">
                  <label>Due Date</label>
                  <input
                    className="form-control mt-2 bg-dark text-white"
                    aria-describedby="emailHelp"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    type="date"
                    name="newDueDate"
                    placeholder="Enter Due Date"
                    autoComplete="newDueDate"
                  />
                </div>
                <button
                  className="btn btn-success mt-3 px-4"
                  onClick={updateTask}
                >
                  Save
                </button>
                {/* <button
                  className="btn btn-danger mt-2 mx-3 px-4"
                  onClick={cancelEdit}
                >
                  Cancel
                </button> */}
              </form>
            </div>
            {currentMonthTasks.length > 0 ? (
              <>
                <h3 className="text-white mt-4">
                  Tasks deadline in current month
                </h3>
                <p className="text-white">
                  Number of tasks: {currentMonthTasks.length}
                </p>
                <BootstrapTable
                  keyField="id"
                  data={currentMonthTasks}
                  columns={columns}
                  bootstrap4
                  condensed
                  bordered={false}
                  pagination={paginationFactory()}
                />
              </>
            ) : (
              <div className="alert alert-danger mt-3" role="alert">
                No task found for currentMonth!
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default TaskTable;
