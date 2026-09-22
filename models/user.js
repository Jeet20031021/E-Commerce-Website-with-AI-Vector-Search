import mongoose from "mongoose";
import { hashPassword } from "../config/hash.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone_no: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
        set(value){
            if(!value) return value;
            if (value.startsWith('$2b') || value.startsWith('$2a$')){
                return value;
            }
            return hashPassword(value);
        }
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    address: {
        type: Object,
        required: false,
    },
    picture: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin", "seller"],
        default: "user"
    }
}, {
    timestamps: false,
    strict: false,
});

// Index for Name field
userSchema.index({ name: 1 });


// Model creation
const User = mongoose.model("User", userSchema);

export { User };