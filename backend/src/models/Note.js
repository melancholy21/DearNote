import mongoose from "mongoose";

// 1st step: You need to create a schema
// 2nd step: You would create a model base off of that schema

const noteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
        index: true,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["none", "todo", "inprogress", "completed"],
        default: "none",
        index: true,
    }
}, 
    {timestamps: true}
);

const Note = mongoose.model("Note", noteSchema)

export default Note