const express = require("express");
const amqp = require("amqplib");
const Task = require("./db");
const bodyParser = require("body-parser");
const app = express();
let channel, connection;

app.use(bodyParser.json());

async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
  while (retries) {
    try {
      connection = await amqp.connect("amqp://rabbitmq");
      channel = await connection.createChannel();
      await channel.assertQueue("task_created");
      console.log("Connected to RabbitMQ");
      return;
    } catch (err) {
      console.log("RabbitMQ Connection Error : ", err.message);
      retries--;
      console.log("Retrying Again ", retries);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { title, description, userId } = req.body;
  try {
    const task = new Task({ title, description, userId });
    await task.save();
    const message = { taskId: task._id, userId, title };
    if (!channel) {
      return res.status(503).json({ error: "RabbitMQ Not Connected" });
    }
    channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
    res.status(201).json(task);
  } catch (error) {
    console.log("Error Saving", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3002, () => {
  console.log(`Task Service is listening at Port 3002`);
  connectRabbitMQWithRetry();
});
