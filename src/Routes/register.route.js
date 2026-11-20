import { Router } from "express";


import { LoginUser, LogoutUser, registerUser, verifyEmial, generateRefreshToken, forgotPasswordrequest, resetForgotPassword, getCurrentUser, changeCurrentPassword, resendEmailVerifivation } from "../Controllers/auth.controllers.js"
import { userRegisterValidator, userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator } from "../Validators/index.js"
import { validatores } from "../Middlewares/validation.middleware.js"
import { authMiddleware } from "../Middlewares/auth.middleware.js";


const router = Router();
//insecure routes
router.route("/").post(userRegisterValidator(),validatores,registerUser)
router.route("/login").post(userLoginValidator(), validatores, LoginUser)
router.route("/verify-email/:verifcationToken").get(verifyEmial)
router.route("/refresh-token").post(generateRefreshToken)
router.route("/forgot-password").post(userForgotPasswordValidator(), validatores, forgotPasswordrequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validatores, resetForgotPassword)

//secure route
router.route("/logout").post(authMiddleware, LogoutUser)
router.route("/current-user").post(authMiddleware, getCurrentUser)
router.route("/chnage-password", authMiddleware, userChangeCurrentPasswordValidator(), validatores, changeCurrentPassword)
router.route("/resend-emial-verification").post(authMiddleware, resendEmailVerifivation)



export default { router }