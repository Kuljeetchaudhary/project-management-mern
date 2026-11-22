import Router from "express"
import { authMiddleware, validateProjectPermisson } from "../Middlewares/auth.middleware.js";
import { validatores } from "../Middlewares/validation.middleware.js"
import { getProjectById, getProjects, createProjects, updateProjectById, deleteProjectById, getProjectmember, addProjectmember, updateMemberRole, deleteMemberRole } from "../Controllers/Project.controllers.js";
import { createProjectValidtor, addProjectToMemberValidator } from "../Validators/index.js"
import { AvailableUserRole, UserRolesEnum } from "../Utills/constants.js";


const router = Router();

router.use(authMiddleware)

//routes 
router.route("/").get(getProjects).post(createProjectValidtor(), validatores, createProjects)

router.route("/:project_id").get(validateProjectPermisson(AvailableUserRole), getProjectById).post(createProjectValidtor(), validateProjectPermisson, createProjects)

router.route("/:project_id").get(validateProjectPermisson(AvailableUserRole), getProjectById).put(validateProjectPermisson([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]), validateProjectPermisson, createProjectValidtor(), validatores, updateProjectById).delete(validateProjectPermisson([UserRolesEnum.ADMIN]), deleteProjectById)

router.route("/:project_Id/members").get(getProjectmember).post(validateProjectPermisson([UserRolesEnum.ADMIN]),addProjectToMemberValidator(),validatores,addProjectmember)

router.route("/:project_Id/members/:userId").put(validateProjectPermisson([UserRolesEnum.ADMIN]),updateMemberRole).delete(validateProjectPermisson([UserRolesEnum.ADMIN]),deleteMemberRole)



export default { router }
