import { model, Schema } from "mongoose";
import { IDriver, IDrivePostStatus } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
    {
        title: { type: String, required: true, },
        from: { type: String, required: true, },
        to: { type: String, required: true, },
        driverId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        driverName: { type: String, required: true, },
        driverEmail: { type: String, required: true },
        amount: { type: Number, required: true, },
        postStatus: { type: String, enum: Object.values(IDrivePostStatus), default: IDrivePostStatus.APPROVED, required: true },
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

export const Driver = model<IDriver>('Driver', driverSchema);