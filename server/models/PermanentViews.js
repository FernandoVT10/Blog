import mongoose, { Schema } from "mongoose";

const permanentViews = new Schema({
    type: {
        type: String,
        enum: ["day", "month"]
    },
    name: {
        type: String,
        required: true
    },
    views: Number
}, { timestamps: true });

export default mongoose.model("permanent_views", permanentViews);