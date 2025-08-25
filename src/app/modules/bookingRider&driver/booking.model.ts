import { model, Schema } from "mongoose";
import { IBooking, IBookingStatus } from "./booking.interface";

const bookingSchema = new Schema<IBooking>({
    title: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    transporterId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    transporterName: { type: String, required: true },
    transporterEmail: { type: String, required: true },
    bookerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    bookerName: { type: String, required: true },
    bookerEmail: { type: String, required: true },
    bookingStatus: { type: String, enum: Object.values(IBookingStatus), default: IBookingStatus.REQUESTED },

}, {
    timestamps: true,
    versionKey: false,
})

export const Booking = model<IBooking>('Booking', bookingSchema)