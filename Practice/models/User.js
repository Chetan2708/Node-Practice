const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profile: String,
});

const taskSchema = new mongoose.Schema({
  id: String,
  InputValue: String,
  priority: String,
  pic: String,
  completed:Boolean,
});

const UserModel = mongoose.model("User", userSchema);
const TaskModel = mongoose.model("Task", taskSchema);

module.exports = {
  UserModel,
  TaskModel,
};
