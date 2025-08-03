"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const driverSchema = new mongoose_1.Schema({
    title: { type: String, required: true, },
    from: { type: String, required: true, },
    to: { type: String, required: true, },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    driverName: { type: String, required: true, },
    driverEmail: { type: String, required: true },
    amount: { type: Number, required: true, },
    postStatus: { type: String, enum: Object.values(driver_interface_1.IDrivePostStatus), default: driver_interface_1.IDrivePostStatus.APPROVED, required: true },
    phoneNumber: { type: String },
    vehicleNumber: { type: String },
    vehicleType: { type: String },
    licenseNumber: { type: String },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false
});
exports.Driver = (0, mongoose_1.model)('Driver', driverSchema);
