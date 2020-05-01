import mongoose, { Schema } from "mongoose";

const skill = new Schema({
    name: String,
    image: String,
    color: String
});

export default mongoose.model("skills", skill);