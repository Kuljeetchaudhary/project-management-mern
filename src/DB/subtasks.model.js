import mongoose, { Schema } from "mongoose";

const subTasksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "tasks",
        required: true
    },
    isCompleted: {
        type: Boolean,
        defailt: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true })

const subTasksModel = new mongoose.model("subtasks", subTasksSchema)

export { subTasksModel }