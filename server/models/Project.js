import mongoose, { Schema } from "mongoose";

const project = new Schema({
    title: {
        type: String,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        required: true
    },
    images: [String],
    skills: [
        {
            type: mongoose.Types.ObjectId,
            ref: "skills"
        }
    ]
}, { timestamps: true });

export default mongoose.model("projects", project);