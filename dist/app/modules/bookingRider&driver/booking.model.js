"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const booking_interface_1 = require("./booking.interface");
const bookingSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    transporterId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    transporterName: { type: String, required: true },
    transporterEmail: { type: String, required: true },
    bookerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    bookerName: { type: String, required: true },
    bookerEmail: { type: String, required: true },
    bookingStatus: { type: String, enum: Object.values(booking_interface_1.IBookingStatus), default: booking_interface_1.IBookingStatus.REQUESTED },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
