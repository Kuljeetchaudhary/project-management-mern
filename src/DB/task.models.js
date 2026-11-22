import mongoose, { Schema } from "mongoose";

import { TaskStatusEnum, AvailableTaskStatues } from "../Utills/constants.js"

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    description: String,
     
    belongsTo: {
        type: Schema.Types.ObjectId,
        ref: "project",
        required:true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref:"user"
        
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref:"user"
    },
    status: {
        type: Stirng,
        enum: AvailableTaskStatues,
        default:TaskStatusEnum.TODO
    },
    attachements: {
        type: [{
            url: String,
            size: Number,
            mimetype:String
        }],
        default:[]
    }

}, { timestamps: true })

const TaskModel = new mongoose.model("tasks", TaskSchema)
export {TaskModel}