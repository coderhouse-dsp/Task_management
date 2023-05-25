import React, { useEffect, useState, useContext } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import "../../Styles.css";
import Header from "./Header";
import AddTask from "../TaskSection/AddTask";
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

  return (
    <>
      <div className="container-fluid h-100 mt-3 p-5">
        <Header
          showForm={() => setShowAddTask(!showAddTask)}
          changeTextAndColor={showAddTask}
        />
        {showAddTask && <AddTask fetchTasks={fetchTasks} />}
        <p className="text-white">Number of tasks: {tasks.length}</p>
        {tasks.length > 0 ? (
          <BootstrapTable
            keyField="id"
            data={tasks}
            columns={columns}
            bootstrap4
            condensed
            bordered={false}
            pagination={paginationFactory()}
          />
        ) : (
          <div className="alert alert-warning mt-3" role="alert">
            No task found!
          </div>
        )}
        {selectedTask && (
          <div>
            <div className="shadow-lg p-3 mt-5 bg-dark rounded form p-5">
              <form >
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
                    className="btn btn-success mt-2 px-4"
                    onClick={updateTask}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-danger mt-2 mx-3 px-4"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskTable;
