import { body } from "express-validator";
import { AvailableUserRole } from "../Utills/constants.js";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is Required")
            .isLowercase()
            .withMessage("Username must be in Lowercase")
            .isLength({ min: 3 })
            .withMessage("Username must contains minimum Three Characters"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is Required"),
        body("fullName")
            .optional()
            .trim()


    ]

}

const userLoginValidator = () => {
    return [
        body("email").optional().isEmail().withMessage("Email is invalid"),
        body("password").notEmpty().withMessage("Password is required")
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage(" Old Password is required"),
        body("newPassword").notEmpty().withMessage("Enter new Password before processing"),

    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email")
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword").notEmpty().withMessage("password is required")
    ]
}


const createProjectValidtor = () => {
    return [
        body("name")
            .notEmpty()
            .withMessage("name is requires"),
        body("description").
            notEmpty()
            .optional()

    ]
}

const addProjectToMemberValidator = () => {
    return [
        body("trim")
            .notEmpty()
            .withMessage("Email is requires")
            .trim()
            .isEmail()
            .withMessage("Invalid Email"),
        body("role")
            .notEmpty()
            .withMessage("Role  is required")
            .isIn(AvailableUserRole)
            .withMessage("Inavlid role")
]
}

export { userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, createProjectValidtor, addProjectToMemberValidator }