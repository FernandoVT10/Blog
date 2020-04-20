import mongoose, { Schema } from "mongoose";

const sucribe = new Schema({
    email: {
        type: String,
        maxlength: 100,
        validate: {
            validator: v => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "The email is not valid."
        },
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("suscriptions", sucribe);