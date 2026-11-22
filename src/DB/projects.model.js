import mongoose, { Schema } from "mongoose";


const PorjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    description: {
        type: String,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required:true
    }
    
}, { timeStamps: true })

const ProjectModel = new mongoose.model("project",PorjectSchema)

export { ProjectModel }