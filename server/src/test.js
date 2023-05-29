server.get("/send-email", async (req, res) => {
  try {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);

    const year = nextDay.getFullYear();
    const month = String(nextDay.getMonth() + 1).padStart(2, "0");
    const day = String(nextDay.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate);

    const tasks = await TaskData.findAll({
      where: {
        duedate: formattedDate,
      },
    });
    console.log("Tasks:", tasks);
    const emailcontent = tasks
      .map((task) => `${task.title}:${task.description}:${task.duedate}`)
      .join("\n");

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
    console.log("Mail Options", mailOptions);
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email notifications sent successfully." });
  } catch (err) {
    console.error("Error sending email notifications:", err);
    res.status(500).json({ error: "An error occurred while sending email notifications." });
  }
});
