import { body } from "express-validator";

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
        body("password").notEmpty().withMessage(" Old Password is required"),
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

export { userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgotPasswordValidator }