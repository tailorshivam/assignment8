import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: String,
    priority: String,
})

const todo = mongoose.model("todo", todoSchema);

export default todo;