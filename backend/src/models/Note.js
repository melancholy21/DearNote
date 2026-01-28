import mongoose from "mongoose";

// 1st step: You need to create a schema
// 2nd step: You would create a model base off of that schema

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, 
    {timestamps: true}
);

const Note = mongoose.model("Note", noteSchema)

export default Note