import { validationResult } from "express-validator";
import { ApiErrors } from "../Utills/api-errors.js"
import { asyncHandler } from "../Utills/asyncHandler.js"
import { PorjectMemberModel } from "../DB/projectmember.model.js"
import mongoose from "mongoose";

const validatores = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extracterrors = [];
    errors.array().map((err) =>
        extracterrors.push({
            [err.path]: err.msg,
        })


    );
    throw new ApiErrors(422, "Received data is not valid",
        extracterrors
    )
})


const validateProjectPermisson = (roles = []) => {
    asyncHandler(async (req, res, next) => {
        const { project_id } = req.params
        if (!project_id) {
            throw new ApiErrors(400, "Project id not found")
        }

        const project = await PorjectMemberModel.findOne({
            project: new mongoose.Types.ObjectId(project_id),
            project: new mongoose.Types.ObjectId(req.user.id)
        })
        if (!project) {
            throw new ApiErrors(400, "Project  not found")
        }

        const givenRole = project?.role

        req.user.role = givenRole;

        if (!roles.includes(givenRole)) {
            throw new ApiErrors(400, "You don't have permission to perform this action")

        }

        next();
    });
}


export { validatores, validateProjectPermisson }