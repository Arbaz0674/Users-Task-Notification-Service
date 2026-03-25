const amqp = require("amqplib");
let channel, connection;

async function start() {
  try {
    connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    await channel.assertQueue("task_created");
    console.log("Notification Service is listening to messages.");
    await channel.consume("task_created", (msg) => {
      const taskData = JSON.parse(msg.content.toString());
      console.log("Notification: NEW TASK: ", taskData.title);
      console.log("Notification: NEW TASK: ", taskData);
    });
  } catch (err) {
    console.error("RabbitMQ Connection Error : ", err.message);
  }
}

start();
