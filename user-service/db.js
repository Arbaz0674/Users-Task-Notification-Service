const mongoose = require("mongoose");

mongoose
  .connect("mongodb://mongo:27017/users")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Database Connection Failed", err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
