import { model, Schema } from "mongoose";
import { IRider, IRiderPostStatus } from "./ride.interface";

const riderSchema = new Schema<IRider>(
    {
        title: { type: String, required: true, },
        from: { type: String, required: true, },
        to: { type: String, required: true, },
        riderId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        riderName: { type: String, required: true, },
        riderEmail: { type: String, required: true },
        amount: { type: Number, required: true, },
        postStatus: { type: String, enum: Object.values(IRiderPostStatus), default: IRiderPostStatus.APPROVED, required: true },
        phoneNumber: { type: String },
        vehicleNumber: { type: String },
        vehicleType: { type: String },
        licenseNumber: { type: String },
        available: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const Rider = model<IRider>('Rider', riderSchema)