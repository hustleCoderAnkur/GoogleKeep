import { Router } from "express";
import {
    createReminder,
    getAllReminder,
    updateReminders,
    deleteReminder 
} from "../controller/reminder.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const reminderRouter = Router()

reminderRouter.use(verifyJWT)

reminderRouter.post("/createReminder/:noteId",createReminder)
reminderRouter.get("/getAllReminder", getAllReminder)
reminderRouter.put("/updateReminders/:id", updateReminders)
reminderRouter.delete("/deleteReminder/:id", deleteReminder)

export default reminderRouter
