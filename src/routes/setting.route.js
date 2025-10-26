import { Router } from "express";
import {
    getUserSetting,
    updateSetting
} from "../controller/setting.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const settingRouter = Router()
settingRouter.use(verifyJWT)

settingRouter.get("/getUserSetting", getUserSetting)
settingRouter.put("/updateSetting", updateSetting)

export default settingRouter
