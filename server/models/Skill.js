import mongoose, { Schema } from "mongoose";

const skill = new Schema({
    name: String
});

export default mongoose.model("skills", skill);