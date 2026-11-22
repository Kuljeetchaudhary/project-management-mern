import mongoose, { Schema } from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../Utills/constants.js"

const ProjectMemberSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        requires: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    role: {
        type: String,
        enum: AvailableUserRole,
        default: UserRolesEnum.MEMBER
    }



}, { timestamps: true })


const PorjectMemberModel = new mongoose.model("projectmember", ProjectMemberSchema)

export { PorjectMemberModel }