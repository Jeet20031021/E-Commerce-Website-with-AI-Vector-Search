import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    price: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

const Payment = mongoose.model("Payment", paymentSchema);

export { Payment };