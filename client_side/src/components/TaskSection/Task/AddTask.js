import React, { useState, useContext, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../../App";
// import { EditTask } from "./TaskTable";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "../../Styles/Styles.css"

function AddTask({ fetchTasks, selectedTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duedate, setDueDate] = useState("");
  const [status, setStatus] = useState(false); // New status state
  const [isEdit, setIsEdit] = useState(false);
  const user = useContext(UserContext);
  const inputRef = useRef(null);

  const handleInputClick = () => {
    inputRef.current.click();
  };
  const updateTask = async () => {
    console.log("Update Task 1");
    try {
      console.log("Update Task 2");
      const response = await fetch(
        `http://localhost:4000/${selectedTask.taskid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            description: description,
            duedate: duedate,
            status: status,
          }),
        }
      );
      console.log("Response: " + response);
      if (response.ok) {
        console.log("updated successfully");
        Swal.fire({
          icon: "success",
          title: "Yayy!!!",
          text: "Task updated successfully!",
        });

        // fetchTasks(); // Refresh the task list after editing
      } else {
        console.log("Error updating task:", response.status);
      }
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle submit called:");
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
        setStatus(false);
        fetchTasks();
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
  const cancelEdit = () => {
    // setSelectedTask(null);
    setTitle("");
    setDescription("");
    setDueDate("");
  };
  useEffect(() => {
    if (selectedTask) {
      setIsEdit(true);
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setDueDate(selectedTask.duedate);
      setStatus(selectedTask.status);
      console.log("Is edit selected:", isEdit);
    }
  }, [selectedTask]);
  return (
    <>
      <div className="container shadow-lg p-3 mb-5 bg-dark rounded form mt-5 p-5">
        <form>
          <h2 className="text-white">

            {isEdit ? "Update Task" : "Add Task"}
          </h2>
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
              style={{ maxWidth: '145px' }}
            />
          </div>
          {/* New status field */}
          <div className="form-group mt-2 text-white">
            <label>Status</label>
            <select
              className="form-control mt-2 bg-dark text-white"
              value={status ? "completed" : "pending"}
              onChange={(e) => setStatus(!status)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {isEdit ? (
            <>
              <button
                className="btn btn-success mt-3 px-4"
                onClick={updateTask}
              >
                update
              </button>
              <button
                className="btn btn-danger mt-3 px-4 mx-2"
                onClick={cancelEdit}
              >
                cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-success mt-3 px-4"
              onClick={handleSubmit}
            >
              Save
            </button>
          )}
          
        </form>
      </div>
    </>
  );
}

export default AddTask;
