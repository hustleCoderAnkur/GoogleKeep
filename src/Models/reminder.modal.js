import mongoose, { Schema } from "mongoose";

const reminderSchema = new Schema({
    noteId: {
        type: Schema.Types.ObjectId,
        ref: 'Note',
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    isActive: {
        type: Boolean,
        default:true
    },
    reminderDate: {
        type: Date,
        required:true
    }
}, { timestamps: true })

export const Reminder = mongoose.model('Reminder',reminderSchema)