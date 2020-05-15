import mongoose, { Schema } from "mongoose";

const articleViews = new Schema({
    type: {
        type: String,
        enum: ["day", "month", "total"]
    },
    articleId: {
        type: mongoose.Types.ObjectId,
        ref: "articles"
    },
    views: Number
});

export default mongoose.model("article_views", articleViews);