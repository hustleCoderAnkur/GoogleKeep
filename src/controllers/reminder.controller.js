import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../Models/notes.modal.js";
import { Reminder } from "../Models/reminder.modal.js";

const createReminder = asyncHandler(async (req, res) => {
    const { noteId } = req.params
    const { reminderDate } = req.body

    if (!isValidObjectId(noteId)) {
        throw new ApiError(400, "noteId not found")
    }
    if (!reminderDate) {
        throw new ApiError(400, "there is No reminderDate")
    }
    const note = await Note.findOne({
        _id: noteId,
        userId: req.user._id
    })
    if (!note) {
        throw new ApiError(404, "Note not found")
    }

    const reminder = await Reminder.create({
        noteId,
        userId: req.user._id,
        reminderDate
    })

    return res
        .status(201)
        .json(new ApiResponse(201, reminder, "reminder is created successfully"))
})

const getAllReminder = asyncHandler(async (req, res) => {

    const getReminders = await Reminder.find({
        userId: req.user._id,
        isActive: true,
    }).populate("noteId", "title").sort({ reminderDate: 1 })

    return res
        .status(200)
        .json(new ApiResponse(200, getReminders, "all reminders are  founded successfully"))
})

const updateReminders = asyncHandler(async (req, res) => {

    const { id } = req.params
    const { reminderDate, isActive } = req.body

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid reminder ID")
    }

    const update = await Reminder.findOneAndUpdate(
        {
            _id: id,
            userId: req.user._id,
        },
        {
            reminderDate,
            isActive
        },
        { new: true }
    )

    if (!update) {
        throw new ApiError(404, "Reminder not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, update, "reminder updated successfully"))
})

const deleteReminder = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (isValidObjectId(id)) {
        throw new ApiError(400, "Invalid reminder ID")
    }

    const del = await Reminder.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!del) {
        throw new ApiError(400, "unalbe to find userId")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, del, "reminder deleted successfully")
        )
})

export {
    createReminder,
    getAllReminder,
    updateReminders,
    deleteReminder
}
