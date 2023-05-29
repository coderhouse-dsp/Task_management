require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("./tokens");
const { isAuth } = require("./isAuth");
const { connection, UserData, TaskData } = require("./sequelize");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const {Sequelize, DataTypes} = require('sequelize');
const server = express();

// Use express middleware for easier cookie handling
const allowedOrigins = ["http://localhost:3000"]; // Add any other allowed origins as needed

server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Set the credentials option to true
  })
);
server.options("*", cors()); // Enable preflight requests for all routes
server.use(cookieParser());
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Make a database connection & model
connection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

// send a mail

server.get("/send-email", async (req, res) => {
  try {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);

    console.log(nextDay);

    const tasks = await TaskData.findAll({
      where: {
        duedate: nextDay,
      },
    });
    console.log("Tasks:", tasks);
    const emailcontent = tasks
      .map(
        (task) =>
          `Task Title:${task.title}\n Task Description:${task.description}\n Task DueDate:${task.duedate}`
      )
      .join("\n");
    console.log("emailContent:", emailcontent);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: "4techusage@gmail.com",
        pass: "stcrltmkozgtipzc",
      },
    });
    const token = req.headers.authorization.split(" ")[1];

    // Verify the access token
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user in the database based on the decoded user ID
    const loggedInUser = await UserData.findOne({
      where: {
        userid: payload.userId,
      },
    });

    if (!loggedInUser) {
      throw new Error("User not found");
    }

    // Return the user's details
    // res.json({ loggedInUser });
    const mailOptions = {
      from: "4techusage@gmail.com", // Sender's email address
      to: `${loggedInUser.email}`, // Recipient's email address
      subject: "Task Reminder",
      text: `The following tasks are due tomorrow:\n\n${emailcontent}`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Mail options sent:", mailOptions);
    res.status(200).json({ message: "Email notifications sent successfully." });
  } catch (err) {
    console.error("Error sending email notifications:", err);
    res
      .status(500)
      .json({ error: "An error occurred while sending email notifications." });
  }
});

// 1.Register a user

server.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    // 1.check if user is already registered
    const user = await UserData.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      throw new Error("User already registered");
    }

    // 2. If user not exist , hash the password
    const hashedpassword = await hash(password, 10);
    // 3.Insert the user in "UserData"
    await UserData.create({
      firstname,
      lastname,
      email,
      password: hashedpassword,
    });
    // res.send(typeof(email)+email)
    res.send({ message: "User created successfully" });
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 2. Login a user

server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // console.log(typeof email);

    // 1. Find user in "database".If not exist send error
    const user = await UserData.findOne({
      where: {
        email: email,
      },
    });
    console.log(user, "user data");
    console.log("Email is printed properly");
    if (!user) {
      throw new Error("User not found");
    }
    // 2. Compare crypted password and see if it check out.send error if not
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Password is incorrect");
    }
    // 3. create Refresh- and access token
    const accesstoken = createAccessToken(user.userid);
    const refreshtoken = createRefreshToken(user.userid);
    // 4.put the refresh token in the "database"
    user.refreshtoken = refreshtoken;
    // 5. Send token.Refreshtoken as a cookie and access token as a regular respone
    console.log(refreshtoken);
    console.log(accesstoken);
    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, req, accesstoken);
    console.log("Login completed successfully");
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 3. Logout a user

server.post("/logout", (_req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  return res.send({
    message: "Logged out",
  });
});

// 4. protected route

server.post("/protected", async (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      res.send({
        data: "This is protected data",
      });
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 5. get a new access token with a refresh token

server.post("/refresh_token", async (req, res) => {
  const token = req.cookies.refreshtoken;
  // If we don't have a token in our request
  console.log("Cookies:", req.cookies);
  if (!token) return res.send({ accesstoken: "" });
  // We have a token, let's verify it!
  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log("Printing catch");
    return res.send({ accesstoken: "" });
  }
  // token is valid, check if user exist
  const user = await UserData.findOne({
    where: {
      userid: payload.userId,
    },
  });
  if (!user) return res.send({ accesstoken: "" });
  // user exist, check if refreshtoken exist on user
  console.log("Pritend user:", user);
  if (req.cookies.refreshtoken !== token) {
    console.log("I am an error");
    return res.send({ accesstoken: "" });
  }
  // token exist, create new Refresh- and accesstoken
  const accesstoken = createAccessToken(user.userid);
  const refreshtoken = createRefreshToken(user.userid);

  console.log("Final accesstoken: ", accesstoken);
  console.log("Final refreshtoken: ", refreshtoken);
  // update refreshtoken on user in db
  // Could have different versions instead!
  req.cookies.refreshtoken = refreshtoken;
  // All good to go, send new refreshtoken and accesstoken
  sendRefreshToken(res, refreshtoken);
  console.log("Final token", req.cookies.refreshtoken);
  return res.send({ accesstoken });
});

// 6. Add Task

server.post("/addtask", async (req, res) => {
  try {
    const { refid, title, description, duedate, status } = req.body;
    console.log("Add task values:", refid, title, description, duedate, status);
    const userid = jwt.decode(refid);
    console.log("Decoded userid:", userid);
    const newTask = await TaskData.create({
      refid: userid.userId,
      title,
      description,
      duedate,
      status,
    });
    console.log("Task added check:", newTask);
    res.status(200).json({ message: "Task added successfully", task: newTask });
  } catch (err) {
    res.send({ error: `${err.message}` });
  }
});

// 7. Fetch Tasks

server.get("/fetchtasks/:id", async (req, res) => {
  try {
    const refid = req.params.id;
    console.log("Backend refid:", refid);
    // const userid = jwt.decode(refid);

    // console.log("Backend userid:",userid)
    const options = {
      raw: true,
      where: {
        refid: refid,
      },
    };
    const tasks = await TaskData.findAll(options);
    console.log(tasks);
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ error: `${err.message}` });
  }
});

// 8. Delete a task

server.delete("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  console.log("Delete task id:", taskId);
  try {
    const task = await TaskData.findByPk(taskId);
    console.log("Task found:", task);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();

    res.json({ success: true });
  } catch (error) {
    console.log("Error deleting task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the task" });
  }
});

// 9. Edit a task

server.put("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title, description, duedate } = req.body;

  try {
    const task = await TaskData.findByPk(taskId);
    console.log("put task:", task);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    task.title = title;
    task.description = description;
    task.duedate = duedate;

    await task.save();

    res.json({ success: true, task });
  } catch (error) {
    console.log("Error editing task:", error);
    res.status(500).json({ error: "An error occurred while editing a task" });
  }
});

// 10. Get logged-in user's details

server.get("/protected/profile", async (req, res) => {
  try {
    // Extract the access token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    // Verify the access token
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user in the database based on the decoded user ID
    const user = await UserData.findOne({
      where: {
        userid: payload.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return the user's details
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: `${err.message}` });
  }
});

// 11. Update user's profile

server.put("/protected/profile/:userid", async (req, res) => {
  const { userid } = req.params;
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await UserData.findByPk(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const hashedpassword = await hash(password, 10);
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.password = hashedpassword;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user's details" });
  }
});

// 12. Update task status

server.put("/updatestatus/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const task = await TaskData.findByPk(taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
  }
  task.status = status;
  await task.save();
  console.log("Task:", task);
  return res.status(200).json({ message: "Task status updated successfully!" });
});

server.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
