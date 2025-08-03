"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rider = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const riderSchema = new mongoose_1.Schema({
    title: { type: String, required: true, },
    from: { type: String, required: true, },
    to: { type: String, required: true, },
    riderId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    riderName: { type: String, required: true, },
    riderEmail: { type: String, required: true },
    amount: { type: Number, required: true, },
    postStatus: { type: String, enum: Object.values(ride_interface_1.IRiderPostStatus), default: ride_interface_1.IRiderPostStatus.APPROVED, required: true },
    phoneNumber: { type: String },
    vehicleNumber: { type: String },
    vehicleType: { type: String },
    licenseNumber: { type: String },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false
});
exports.Rider = (0, mongoose_1.model)('Rider', riderSchema);
