import mongoose, { Schema } from "mongoose";

const article = new Schema({
    title: {
        type: String,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        maxlength: 250,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    categories: [
        {
            type: mongoose.Types.ObjectId,
            ref: "categories"
        }
    ]
}, { timestamps: true });

export default mongoose.model("articles", article);