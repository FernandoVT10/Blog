import mongoose, { Schema } from "mongoose";

const view = new Schema({
    type: ["day", "month", "total"],
    isForTheArticle: Boolean,
    views: Number
});

export default mongoose.model("views", view);