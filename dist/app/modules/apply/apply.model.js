"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apply = void 0;
const mongoose_1 = require("mongoose");
const apply_interface_1 = require("./apply.interface");
const applySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true, },
    want: { type: String, enum: Object.values(apply_interface_1.IWant), required: true, },
    isApproved: { type: Boolean, default: false, },
    email: { type: String, required: true },
    // name:{type:String, required:true}
}, {
    timestamps: true,
    versionKey: false,
});
exports.Apply = (0, mongoose_1.model)("Apply", applySchema);
