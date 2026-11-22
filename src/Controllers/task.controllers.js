import { ApiErrors } from "../Utills/api-errors.js"
import { Apiresponse } from "../Utills/api-responses.js"
import { asyncHandler } from "../Utills/asyncHandler.js"
import { UserModel } from "../DB/User.model.js"
import { PorjectMemberModel } from "../DB/projectmember.model.js"
import { ProjectModel } from "../DB/projects.model.js"
import { TaskModel } from "../DB/task.models.js"
import mongoose from "mongoose"

const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, assignedBy, status } = req.body;
    const { task_id } = req.params
    const Project = await ProjectModel.findById(task_id)

    if (!Project) {
        throw new ApiErrors(400, "Project Don't exists")
    }
    const files = req.files || [];

    const attachements = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    const task = await TaskModel.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(task_id),
        assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
        assignedBy: assignedBy ? new mongoose.Types.ObjectId(req.user.id) : undefined,
        status,
        attachements
    })

    return res.status(201).json(new Apiresponse(201, task, "Task added successfully"))
})

const ReadTask = asyncHandler(async (req, res) => {
    const { task_id } = req.params
    const Project = await ProjectModel.findById(task_id)

    if (!Project) {
        throw new ApiErrors(400, "Project Don't exists")
    }

    const task = await TaskModel.find({
        project: new mongoose.Types.ObjectId(task_id)
    }).populate("assignedTo", "avatar username fullname")  // popultae user data

    return res.status(200).json(new Apiresponse(200, task, "Tasks fetched Successfully"))
})

const getTaskById = asyncHandler(async (req, res) => {
    const { task_id } = req.params
    if (!task_id) {
        throw new ApiErrors(400, "Task id is Undefined")
    }
    const task = await TaskModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(task_id)
            }
        }, {
            $lookup: {
                from: "user",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        _id: 1,
                        username: 1,
                        fullname: 1,
                        avatar: 1
                    }
                ]

            }
        }, {
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                        $lookup: {
                            from: "user",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    }, {
                        $addField: {
                            createdBy: {
                                $aaaryElemAt: ["$createdBy", 0]
                            }
                        }
                    }
                ]
            }
        }, {
            $addField: {
                assignedTo: {
                    $arrrayElemAt: ["$assignedTo", 0]
                }
            }
        }
    ])

    if (!task || task.length === 0) {
        throw new ApiErrors(400, "Cann't  find Task")
    }
    return res.status(200).json(new Apiresponse(200, task[0], "Task found successfully"))

})
const updateeTask = asyncHandler(async (req, res) => {
})
const deleteTask = asyncHandler(async (req, res) => {

})
const createSubTask = asyncHandler(async (req, res) => {

})

const updateSubTask = asyncHandler(async (req, res) => {

})
const deleteSubTask = asyncHandler(async (req, res) => {

})


export { createSubTask, createTask, deleteTask, deleteSubTask, ReadTask, updateSubTask, getTaskById, updateeTask }



