import mongoose, { Schema } from "mongoose";

const skill = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

export default mongoose.model("skills", skill);