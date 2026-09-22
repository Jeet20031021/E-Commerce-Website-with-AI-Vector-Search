import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "shipped", "delivered", "cancelled"],
        default: 'pending',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }
}, {
    strict: false,
    timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);

export { Order };

