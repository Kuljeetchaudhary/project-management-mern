import { Router } from "express";


import healthCheckcontroller from "../Controllers/healthCheck.controllers.js"

const router = Router();

router.route("/").get(healthCheckcontroller.healthCheck)

export default { router }