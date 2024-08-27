const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'fulfilled', 'failed'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
