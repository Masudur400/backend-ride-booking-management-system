import { Schema, model } from "mongoose";
import { IApply, IWant } from "./apply.interface";

const applySchema = new Schema<IApply>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, },
        want: { type: String, enum: Object.values(IWant), required: true, },
        isApproved: { type: Boolean, default: false, },
        email:{type:String, required:true},
        // name:{type:String, required:true}
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Apply = model<IApply>("Apply", applySchema);
