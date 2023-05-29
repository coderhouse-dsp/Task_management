import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../App";
import { fetchTasks } from "./TaskTable";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../../../node_modules/bootstrap/dist/js/bootstrap.js";
import "../../Styles.css";

function AddTask(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duedate, setDueDate] = useState("");
  const [status, setStatus] = useState(false); // New status state

  const user = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !duedate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fill up all the fields to add task",
      });
    } else {
      const result = await (
        await fetch("http://localhost:4000/addtask", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refid: user[0].accesstoken,
            title: title,
            description: description,
            duedate: duedate,
            status: status, // Include status in the request body
          }),
        })
      ).json();
      if (!result.error) {
        Swal.fire({
          icon: "success",
          title: "Yayy!!!",
          text: result.message,
        });
        setTitle("");
        setDescription("");
        setDueDate("");
        props.fetchTasks();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oopss!!!",
          text: result.error,
        });
      }
    }
  };

  const handleChange = (e) => {
    if (e.currentTarget.name === "title") {
      setTitle(e.currentTarget.value);
    } else if (e.currentTarget.name === "description") {
      setDescription(e.currentTarget.value);
    } else if (e.currentTarget.name === "duedate") {
      setDueDate(e.currentTarget.value);
    }
  };

  return (
    <>
      <div className="container shadow-lg p-3 mb-5 bg-dark rounded form mt-5 p-5">
        <form onSubmit={handleSubmit}>
          <h2 className="text-white">AddTask</h2>
          <div className="form-group mt-2 text-white">
            <label>Title</label>
            <input
              className="form-control mt-2 bg-dark text-white"
              aria-describedby="emailHelp"
              value={title}
              onChange={handleChange}
              type="text"
              name="title"
              placeholder="Enter Title"
              autoComplete="title"
            />
          </div>
          <div className="form-group mt-2 text-white">
            <label>Description</label>
            <input
              className="form-control mt-2 bg-dark text-white"
              aria-describedby="emailHelp"
              value={description}
              onChange={handleChange}
              type="text"
              name="description"
              placeholder="Enter Description"
              autoComplete="description"
            />
          </div>
          <div className="form-group mt-2 text-white">
            <label>Due Date</label>
            <input
              className="form-control mt-2 bg-dark text-white"
              aria-describedby="emailHelp"
              value={duedate}
              onChange={handleChange}
              type="date"
              name="duedate"
              placeholder="Enter Due Date"
              autoComplete="duedate"
            />
          </div>
          {/* New status field */}
          <div className="form-group mt-2 text-white">
            <label>Status</label>
            <select
              className="form-control mt-2 bg-dark text-white"
              value={status}
              onChange={(e) => setStatus(e.currentTarget.value)}
            >
              <option value={status}>Pending</option>
              <option value={!status}>Completed</option>
            </select>
          </div>
          <button type="submit" className="btn btn-warning mt-3">
            Add Task
          </button>
        </form>
      </div>
    </>
  );
}

export default AddTask;
