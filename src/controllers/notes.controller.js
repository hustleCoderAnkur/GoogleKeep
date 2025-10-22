import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../Models/notes.modal.js";
import { User } from "../Models/user.modal.js";

const validateId = (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid ID format");
    }
    return id;
};

const createNote = asyncHandler(async (req, res) => {

    const {
        title,
        content,
        type,
        labels,
        isPinned,
        isArchived
    } = req.body;

    if (!title && (!content || content.length === 0)) {
        throw new ApiError(400, "Title or content required");
    }

    const note = await Note.create({
        user: req.user._id,
        title,
        content,
        type: type || 'text',
        labels: labels || [],
        isPinned: isPinned || false,
        isArchived: isArchived || false,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, note, "Note created successfully"));
});

const updateNote = asyncHandler(async (req, res) => {

    const { id } = req.params
    validateId(id)

    const {
        title,
        content,
        type,
        labels,
        isPinned,
        isArchived
    } = req.body

    const update = await Note.findOneAndUpdate(
        { _id: id, user: req.user._id },
        {
            title,
            content,
            type,
            labels,
            isPinned,
            isArchived,
        },
        { new: true }
    )

    if (!update) {
        throw new ApiError(404, "Note not found or unauthorized")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, update, "Note updated successfully")
        )
})

const getAllNotes = asyncHandler(async (req, res) => {

    const notes = await Note.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id),
                isDeleted: false,
                isArchived: false
            }
        },
        {
            $sort: { isPinned: -1, updatedAt: -1 }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                userDetails: {
                    $first: "$userDetails"
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const getArchivedNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({
        user: req.user._id,
        isArchived: true,
        isDeleted: false
    }).sort({ updatedAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Archived notes fetched successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);

    const note = await Note.findOneAndUpdate(
        { _id: id, user: req.user._id, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );

    if (!note) {
        throw new ApiError(404, "Note not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Note deleted successfully"));
});

const trashNote = asyncHandler(async (req, res) => {
    const deletedNotes = await Note.find({
        user: req.user._id,
        isDeleted: true
    }).sort({ updatedAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, deletedNotes, "Trash notes fetched"));
});

const restoreNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);

    const note = await Note.findOneAndUpdate(
        { _id: id, user: req.user._id, isDeleted: true },
        { isDeleted: false },
        { new: true }
    );

    if (!note) {
        throw new ApiError(404, "Note not found in trash");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note restored successfully"));
});

const permanentDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);

    const note = await Note.findOneAndDelete({
        _id: id,
        user: req.user._id,
        isDeleted: true
    });

    if (!note) {
        throw new ApiError(404, "Note not found or already deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Note deleted permanently"));
});

const emptyTrash = asyncHandler(async (req, res) => {
    const result = await Note.deleteMany({
        user: req.user._id,
        isDeleted: true
    });

    return res
        .status(200)
        .json(new ApiResponse(200, result, 'Trash emptied successfully'));
});

const addCollaborator = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { userId, permission } = req.body;
    validateId(noteId);
    
    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new ApiError(404, "User not found");
    }

    const note = await Note.findOne({
        _id: noteId,
        user: req.user._id
    });

    if (!note) {
        throw new ApiError(404, "Note not found or unauthorized");
    }

    
    const alreadyExists = note.collaborators.some(
        collab => collab.user.toString() === userId
    );

    if (alreadyExists) {
        throw new ApiError(400, "User is already a collaborator");
    }

    note.collaborators.push({ user: userId, permission });
    await note.save();

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Collaborator added successfully"));
});

const removeCollaborator = asyncHandler(async (req, res) => {
    const { noteId, userId } = req.params;
    validateId(noteId);

    const note = await Note.findOne({
        _id: noteId,
        user: req.user._id
    });

    if (!note) {
        throw new ApiError(404, "Note not found or unauthorized");
    }

    note.collaborators = note.collaborators.filter(
        collab => collab.user.toString() !== userId
    );

    await note.save();

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Collaborator removed"));
});

export {
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
};