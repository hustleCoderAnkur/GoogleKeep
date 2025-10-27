import { Router } from "express";
import {
    getAllNotes,
    getArchivedNotes,
    createNote,
    updateNote,
    deleteNote,
    trashNote,
    restoreNote,
    permanentDelete,
    emptyTrash,
    addCollaborator,
    removeCollaborator
} from "../controller/notes.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const notesRouter = Router()
notesRouter.use(verifyJWT)

notesRouter.post("/createNote", createNote)
notesRouter.put("/updateNote/:id", updateNote)
notesRouter.get("/getAllNotes", getAllNotes)
notesRouter.get("/getArchivedNotes", getArchivedNotes)
notesRouter.delete("/emptyTrash", emptyTrash)
notesRouter.delete("/deleteNote/:id", deleteNote)
notesRouter.put("/trashNote/:id", trashNote)
notesRouter.put("/restoreNote/:id", restoreNote)
notesRouter.delete("/permanentDelete/:id", permanentDelete)
notesRouter.post("/addCollaborator/:noteId", addCollaborator)
notesRouter.delete("/removeCollaborator/:noteId", removeCollaborator)

export default notesRouter
