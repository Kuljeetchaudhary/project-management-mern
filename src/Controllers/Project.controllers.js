import { ApiErrors } from "../Utills/api-errors.js"
import { Apiresponse } from "../Utills/api-responses.js"
import { asyncHandler } from "../Utills/asyncHandler.js"
import { UserModel } from "../DB/User.model.js"
import { PorjectMemberModel } from "../DB/projectmember.model.js"
import { ProjectModel } from "../DB/projects.model.js"
import mongoose from "mongoose"
import { AvailableUserRole, UserRolesEnum } from "../Utills/constants.js"
import { pipeline } from "node:stream"

const getProjects = asyncHandler(async (req, res) => {
    const fetchedProject = await PorjectMemberModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user.id)
            }
        }, {
            $lookup: {
                from: "projects",
                localField: "projects",
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField: "projects",
                            as: "projectmembers"

                        }
                    }, {
                        $addFields: {
                            members: {
                                $size: "$projectmembers"
                            }
                        }
                    }
                ]
            }
        }, {
            $unwind: "$project"
        }, {
            $project: {
                project: {
                    _id: 1,
                    name: 2,
                    description: 1,
                    members: 1,
                    createdAt: 1,
                    createdBy: 1
                },
                role: 1,
                _id: 0
            }
        }
    ])

    return res.status(200).json(new Apiresponse(200, fetchedProject, "Project fetched succeddfully"))

})

const getProjectById = asyncHandler(async (req, res) => {
    const { project_id } = req.params

    const project = await ProjectModel.findById(project_id)

    if (!project) {
        throw new ApiErrors(400, "Project not found")
    }
    return res.status(200).json(new Apiresponse(200, project, "Project fetched successfully"))

})

const createProjects = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const newProject = await ProjectModel.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user.id)
    })
    await PorjectMemberModel.create({
        user: new mongoose.Types.ObjectId(req.user.id),
        projectId: new mongoose.Types.ObjectId(newProject._id),
        role: UserRolesEnum.ADMIN
    })
    res.status(200).json(new Apiresponse(200, newProject, "New Project listed successfuly"))

})

const updateProjectById = asyncHandler(async (req, res) => {
    const { name, description, owner } = req.body
    const { Porject_id } = req.params

    const project = await ProjectModel.findByIdAndUpdate(
        Porject_id,
        {
            name: name,
            description: description,
            role: owner
        }, { new: true })

    if (!project) {
        throw new ApiErrors(404, "Project Not Found")
    }

    return res.status(200).json(new Apiresponse(200, project, "Project Updated Successfully"))
})

const deleteProjectById = asyncHandler(async (req, res) => {
    const { project_id } = req.params
    const deletedProject = await ProjectModel.findByIdAndDelete(project_id, (err, docs) => {
        if (err) {
            throw new ApiErrors(400, "Something went wrong cann't delete Project")
        }
        else {
            throw new Apiresponse(200, {}, "Project deleted successfully")
        }
    })
    if (!deletedProject) {
        throw new ApiErrors(400, "Something went wrong Cann't delete Project")
    }
    throw new Apiresponse(200, { deletedProject }, "Project removed from the list successfully")
})

const getProjectmember = asyncHandler(async (req, res) => {
    const { project_id } = req.params
    const project = await ProjectModel.findById(project_id)

    if (!project) {
        throw new ApiErrors(400, "Cann't find any project")
    }
    const projectMembers = await PorjectMemberModel.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(project_id)
            },
        }, {
            $lookup: {
                from: "user",
                localField: "user",
                foreignField: "_id",
                as: "user",
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
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0]
                }
            }
        }, {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            }
        }
    ]);
    return res.status(200).json(new Apiresponse(200, projectMembers, "Project members fetched successfully"))

})

const addProjectmember = asyncHandler(async (req, res) => {
    const { email, role } = req.body
    const { project_id } = req.params

    const user = await UserModel.findOne({ email })

    if (!user) {
        throw new ApiErrors(400, "User not exists")
    }

    await PorjectMemberModel.findByIdAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(project_id)
        }, {
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(project_id),
        role: role
    }, {
        new: true,
        upsert: true
    }
    )
    return res.status(200).json(new Apiresponse(201, {}, "Project member added successfully"))
})

const updateMemberRole = asyncHandler(async (req, res) => {
    const { project_id, userId } = req.params
    const { newRole } = req.body;

    if (!AvailableUserRole.includes(newRole)) {
        throw new ApiErrors(400, "This user role is invalid")
    }
    let projectMember = await PorjectMemberModel.findOne({
        project: new mongoose.Types.ObjectId(project_id),
        user: new mongoose.Types.ObjectId(userId)
    })

    if (!projectMember) {
        throw new ApiErrors(400, "Project member not found")
    }

    projectMember = await PorjectMemberModel.findByIdAndUpdate(projectMember._id, {
        role: newRole
    }, {
        new: true
    })
    if (!projectMember) {
        throw new ApiErrors(400, "Project member not found")
    }

    return res.status(200).josn(new Apiresponse(200, projectMember, "Project member Role Updated Successfully"))
})

const deleteMemberRole = asyncHandler(async (req, res) => {
    const { project_id, userId } = req.params
    let projectMember = await PorjectMemberModel.findOne({
        project: new mongoose.Types.ObjectId(project_id),
        user: new mongoose.Types.ObjectId(userId)
    })

    if (!projectMember) {
        throw new ApiErrors(400, "Project member not found")
    }

    projectMember = await PorjectMemberModel.findByIdAndDelete(projectMember._id)
    if (!projectMember) {
        throw new ApiErrors(400, "Project member deleted successfully")
    }


})

export { getProjects, getProjectById, createProjects, updateProjectById, getProjectmember, addProjectmember, updateMemberRole, deleteProjectById, deleteMemberRole }
