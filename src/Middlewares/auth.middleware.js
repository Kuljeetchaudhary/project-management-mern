import { decode } from "node:punycode";
import { UserModel } from "../DB/User.model.js";
import { ApiErrors } from "../Utills/api-errors.js"
import { asyncHandler } from "../Utills/asyncHandler.js"
import JWT from "jsonwebtoken"


const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.header("Authorization");

    const token =
        req.cookies?.accessToken || authHeader?.replace("Bearer ", "")


    if (!token) {
        throw new ApiErrors(401, "Unauthotization request")
    }

    try {
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY)
        const userID = decoded?.id;

        if (!userID) {
            throw new ApiErrors(400, "Cann't get necessary credentials");

        }

        const user = await UserModel.findById(userID).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

        if (!user) {
            throw new ApiErrors(401, "User  doesn't exists in our system system")
        }

        req.user = user;
        next()
    } catch (error) {
        console.error(error)
        throw new ApiErrors(404, "Sonething went wrong")
    }



})

export { authMiddleware }
