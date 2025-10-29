// once you make complete google keep go toward mongoose aggregate paginatte piplines to go towards Notion project
import mongoose, { Schema } from "mongoose"

const blockSchema = new Schema({
    type: {
        type: String,
        enum: ["heading", "paragraph", "list", "image", "audio", "drawing", "link"],
        default: "paragraph"
    },
    text: String,
    bold: Boolean,
    italic: Boolean,
    underline: Boolean,
    fontSize: Number,
    url: String,
    listItems: [String],
}, { _id: false })

const collaboratorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    permission: {
        type: String,
        enum: ["view", "edit", "comment"],
        default: "view"
    }
}, { _id: false })

const noteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        trim: true
    },
    content: [blockSchema],
    type: {
        type: String,
        enum: ["text", "image", "audio", "list", "drawing"],
        default: "text"
    },
    labels: [String],
    isPinned: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    reminder: { type: Date },
    backgroundColor: String,
    backgroundImage: String,
    collaborators: [collaboratorSchema],
}, { timestamps: true })

export const Note = mongoose.model('Note', noteSchema)

