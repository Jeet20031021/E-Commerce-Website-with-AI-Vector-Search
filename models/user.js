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


// Password Hashing
userSchema.pre('save', async function(next){
    if(this.isModified('password') && this.password){
        this.password = await hashPassword(this.password);
    }
    next();
});

// Log save data
userSchema.post('save', async function (doc) {
    console.log(`${doc.name} is saved to Database!`);
});

// Model creation
const User = mongoose.model("User", userSchema);

export { User };