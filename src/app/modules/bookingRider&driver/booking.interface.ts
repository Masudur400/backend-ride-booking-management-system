import { Types } from "mongoose";


export enum IBookingStatus { 
    CANCELLED='CANCELLED',
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED"
}

export interface IBooking {
  _id?: Types.ObjectId
  postId: Types.ObjectId
  transporterId: Types.ObjectId
  transporterName: string
  transporterEmail: string
  bookerId: Types.ObjectId
  bookerName: string
  bookerEmail: string
  bookingStatus: IBookingStatus
}