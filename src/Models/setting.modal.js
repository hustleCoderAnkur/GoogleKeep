import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    addNewItemToBottom: {
        type: Boolean,
        default: false,
    },
    moveTickedItemToBottom: {
        type: Boolean,
        default: true,
    },
    displayRichLinkPreviews: {
        type: Boolean,
        default: true,
    },
    enableSharing: {
        type: Boolean,
        default: false,
    },
    theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "light",
    },
    reminderPreference: {
        type: [String],
        enum: ["morning", "afternoon", "evening"],
        default: ["morning"],
        validate: {
            validator: (val) => val.length > 0,
            message: "At least one reminder preference required"
        }
    },
}, { timestamps: true })

export const Settings = mongoose.model("Settings", settingsSchema);
