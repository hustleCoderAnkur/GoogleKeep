import { Router } from "express"
import {
    generateAccessAndRefreshTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getAllNotes
} from "../controller/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const userRouter = Router()

userRouter.post("/registerUser", registerUser)
userRouter.post("/loginUser", loginUser)
userRouter.get("/refreshAccessToken", refreshAccessToken)
userRouter.post("/generateAccessAndRefreshTokens/:id", verifyJWT, generateAccessAndRefreshTokens)
userRouter.post("/logoutUser", verifyJWT, logoutUser)
userRouter.put("/changeCurrentPassword", verifyJWT, changeCurrentPassword)
userRouter.get("/getCurrentUser", verifyJWT, getCurrentUser)
userRouter.put("/updateAccountDetails", verifyJWT, updateAccountDetails)
userRouter.get("/getAllNotes/:id", verifyJWT, getAllNotes)

export default userRouter
