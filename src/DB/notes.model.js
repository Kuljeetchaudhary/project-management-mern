import mongoose, { Schema } from "mongoose";
import { type } from "node:os";

const notesSchema = new mongoose.Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    }


}, { timestamps: true })


const notesModel = new mongoose.model("Projectnotes", notesSchema)
export { notesModel }