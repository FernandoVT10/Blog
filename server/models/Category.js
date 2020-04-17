import mongoose, { Schema } from "mongoose";

const category = new Schema({
    name: {
        type: String,
        required: true
    }
});

export default mongoose.model("categories", category);