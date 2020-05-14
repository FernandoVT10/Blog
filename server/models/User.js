import mongoose, { Schema } from "mongoose";

const user = new Schema({
    username: {
        type: String,
        maxlength: 30,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model("users", user);