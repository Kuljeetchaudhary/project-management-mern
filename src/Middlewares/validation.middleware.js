import { validationResult } from "express-validator";
import { ApiErrors } from "../Utills/api-errors.js"


const validatores = (req, res, next) => {
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
    throw  new ApiErrors(422, "Received data is not valid",
        extracterrors
    )
};
export {validatores}