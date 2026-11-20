import { UserModel } from "../DB/User.model.js"
import { Apiresponse } from "../Utills/api-responses.js";
import { ApiErrors } from "../Utills/api-errors.js";
import { asyncHandler } from "../Utills/asyncHandler.js";
import {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail,
} from "../Utills/mail-verify.js";
import crypto from "crypto"
import JWT from "jsonwebtoken"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new ApiErrors(404, "User not found");
        }

        const accessToken = await user.createAccessToken();
        const refreshToken = await user.createRefreshTokens();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiErrors(
            500,
            "Something went wrong while generating access token",
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    const existedUser = await UserModel.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiErrors(409, "User with email or username already exists", []);
    }

    const user = await UserModel.create({
        email,
        password,
        username,
        isEmailVerified: false,
    });

    const { unhashedToken, hashedToken, tokenExpiry } =
        user.createTemporaryToken();



    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`,
        ),
    });

    const createdUser = await UserModel.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!createdUser) {
        throw new ApiErrors(500, "Something went wrong while registering a user");
    }

    return res
        .status(201)
        .json(
            new Apiresponse(
                200,
                { user: createdUser },
                "User registered successfully and verification email has been sent on your email",
            ),
        );
});

const LoginUser = asyncHandler(async (req, res) => {
    const { password, email, username } = req.body;

    if (!email || !username) {
        return new ApiErrors(400, "Email and Password are required")
    }

    const user = await UserModel.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        return new ApiErrors(400, "Invalid Credentials account doesn't exists")
    }

    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiErrors(400, "Invalid Credentials")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const LoggedinUser = await UserModel.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")


    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new Apiresponse(
            200, {
            user: LoggedinUser,
            access: accessToken,
            refreshToken: refreshToken
        }, "User Logged in successfully"
        ))

})

const LogoutUser = asyncHandler(async (req, res) => {
    await UserModel.findByIdAndUpdate(req.user.id, {
        $set: {
            refreshToken: ""
        }
    }, {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new Apiresponse(200, {}, "User logged out successfully")
        )


})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new Apiresponse(200, req.user, "Current user fetched successfully"))
})

const verifyEmial = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;
    if (!verificationToken) {
        throw new ApiErrors(400, "Email verification toke is missing")
    }

    let hashToken = crypto.createhash("sha256").update(verificationToken).digest("hex")

    const user = await UserModel.findOne({
        emailVerificationToken: hashToken,
        emailVerificationExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiErrors(400, "Token is missing or invalid")
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new Apiresponse(200, {
        isEmailVerified: true
    }, "Email is Verified"))
})

const resendEmailVerifivation = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id)
    if (!user) {
        throw new ApiErrors(404, "Cann't recognise user")
    }
    if (user.isEmailVerified) {
        throw new ApiErrors(409, "Email is already Verifies")
    }
    const { unhashedToken, hashedToken, tokenExpiry } =
        user.createTemporaryToken();



    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`,
        ),
    });

    return res.status(200).json(new Apiresponse(200, {}, "Mail has been send to your registered Gmial account"))
})

const generateRefreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        throw new ApiErrors(400, "Unauthorised request")
    }

    try {
        const decodedToken = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)

        const user = await UserModel.findById(decodedToken.id);
        if (!user) {
            throw new ApiErrors(400, "Invalid refresh token")
        }
        if (refreshToken != decodedToken) {
            throw new ApiErrors(400, "Refresh token is expired")

        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { newrefreshToken, newaccessToken } = await generateAccessAndRefreshTokens(user.id)

        user.refreshToken = newrefreshToken
        await user.save()

        return res.status(200).cookie("accesstokem", newaccessToken, options).cookie("refreshtoken", newrefreshToken, options).json(
            new Apiresponse(200, { newaccessToken, newrefreshToken }, "Access Token refreshed"))
    } catch (error) {
        throw new ApiErrors("401", "Invalid Refresh Token")

    }
})

const forgotPasswordrequest = asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await UserModel.findOne(email)

    if (!user) {
        throw new ApiErrors(400, "Invalid Email")

    }

    const { unhashedToken, hashedToken, tokenExpiry } = user.createTemporaryToken()

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Password reset request",
        mailgenContent: forgotPasswordMailgenContent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedToken}`
        ),

    })

    return res.status(200).json(new Apiresponse(200, {}, "Password reset mail has been sent on your registered gmail account"))

})

const resetForgotPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params
    const { newPassword } = req.body

    let hashedToken = crypto.createhash("sha256").update(resetToken).digest("hex")

    const user = await UserModel.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiErrors(409, "Token is Invalid or expired")
    }
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    res.status(200).json(new Apiresponse(200, {}, "Password reset successfully"));
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = UserModel.findById(req.user?.id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiErrors(400, "Current Password is wrong")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    res.status(200).json(new Apiresponse(200, {}, "Password Changed successfully"))

})



export { registerUser, LoginUser, LogoutUser, getCurrentUser, verifyEmial, resendEmailVerifivation, generateRefreshToken, forgotPasswordrequest, resetForgotPassword, changeCurrentPassword };
