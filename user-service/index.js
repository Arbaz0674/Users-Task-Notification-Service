const express = require("express");
const User = require("./db");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log("Error Saving", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log(`User Service is listening at Port 3001`);
});
