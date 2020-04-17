import mongoose, { Schema } from "mongoose";

const comment = new Schema({
    articleId: {
        type: mongoose.Types.ObjectId,
        ref: "articles"
    },
    name: {
        type: String,
        maxlength: 30,
        required: true
    },
    comment: {
        type: String,
        maxlength: 500,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("comments", comment)