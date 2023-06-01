import React from "react";
import { Link } from "@reach/router";
import "../Styles/Styles.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="container-fluid home p-5">
      <div className="">
        <h1 className="title w-75">
          "<span id="title_span" className="text-warning">TaskMaster</span>: Simplify Your Workflow,
          Boost Productivity"
        </h1>
        <p className="info mt-5  w-75">
          "Streamline your workflow and stay on top of your to-do list with our
          feature-rich task management web app. From creating tasks and setting
          deadlines to assigning priorities and collaborating with your team,
          our app empowers you to take control of your work. With a
          user-friendly interface and seamless integration across devices, you
          can access and update your tasks anytime, anywhere. Boost your
          productivity, eliminate stress, and accomplish more with our trusted
          task management solution. Sign up now and unlock the potential of
          effective task management."
        </p>
        <button className="btn btn-warning mt-2 px-4">
          <Link to="/login" id="link_text_btn">
            Login
          </Link>
        </button>

        <button className="btn btn-warning mt-2 mx-3 px-4">
          <Link to="/register" id="link_text_btn">
            Register
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
