import { Types } from "mongoose";
import { IBooking, IBookingStatus } from "./booking.interface";
import { Booking } from "./booking.model";
import AppError from "../../errorHandler/AppError";
import httpStatus from 'http-status-codes'
import { Driver } from "../driver/driver.model";
import { JwtPayload } from "jsonwebtoken";
import { Rider } from "../ride/ride.model";
import { IDriver } from "../driver/driver.interface";
import { IRider } from "../ride/ride.interface";
import { IUser } from "../user/user.interface";




const createBooking = async (postId: string, user: JwtPayload, loggedInUser: IUser) => {
    const driverPost = await Driver.findById(postId)
    const riderPost = !driverPost ? await Rider.findById(postId) : null
    if (!driverPost && !riderPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
    }
    const post = (driverPost || riderPost) as IDriver | IRider
    let transporterId = ''
    let transporterName = ''
    let transporterEmail = ''
    if ('driverId' in post) {
        transporterId = post.driverId.toString()
        transporterName = post.driverName
        transporterEmail = post.driverEmail
    } else if ('riderId' in post) {
        transporterId = post.riderId.toString()
        transporterName = post.riderName
        transporterEmail = post.riderEmail
    }
    const bookingData = {
        title: post.title,
        from: post.from,
        to: post.to,
        amount: post.amount,
        postId: postId,
        transporterId,
        transporterName,
        transporterEmail,
        bookerId: user.userId,
        bookerName: loggedInUser.name,
        bookerEmail: user.email,
        bookingStatus: IBookingStatus.REQUESTED
    }
    const newBooking = await Booking.create(bookingData)
    return newBooking
}


const getMyBookings = async (userId: Types.ObjectId): Promise<IBooking[]> => {
    return await Booking.find({ bookerId: userId })
}


const cancelBooking = async (bookingId: string, userId: Types.ObjectId): Promise<IBooking | null> => {
    const booking = await Booking.findById(bookingId)
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, 'Booking not found')
    }
    if (booking.bookingStatus === IBookingStatus.CANCELLED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Booking already cancelled')
    }
    if (!booking.bookerId.equals(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied')
    }
    const disallowedStatuses: IBookingStatus[] = [IBookingStatus.ACCEPTED, IBookingStatus.PICKED_UP, IBookingStatus.IN_TRANSIT, IBookingStatus.COMPLETED]
    if (disallowedStatuses.includes(booking.bookingStatus)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot cancel this booking')
    }
    booking.bookingStatus = IBookingStatus.CANCELLED
    return await booking.save()
};


const getBookingsOnMyPost = async (userId: Types.ObjectId): Promise<IBooking[]> => {
    return await Booking.find({ transporterId: userId })
};


const updateBookingStatus = async (bookingId: string, userId: Types.ObjectId, newStatus: IBookingStatus): Promise<IBooking> => {
    const booking = await Booking.findById(bookingId)
    if (booking?.bookingStatus === IBookingStatus.CANCELLED) {
        throw new AppError(httpStatus.BAD_REQUEST, `booking request already ${IBookingStatus.CANCELLED}`)
    }
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, 'Booking not found')
    }
    if (!booking.transporterId.equals(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied')
    }
    booking.bookingStatus = newStatus
    return await booking.save()
};


const deleteBooking = async (bookingId: string, userId: Types.ObjectId): Promise<IBooking | null> => {
    const booking = await Booking.findById(bookingId)
    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, 'Booking not found')
    } 
    if (![IBookingStatus.CANCELLED, IBookingStatus.REQUESTED].includes(booking.bookingStatus)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Cannot delete booking with status ${booking.bookingStatus}`)
    } 
    if (!booking.bookerId.equals(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied')
    } 
    await booking.deleteOne()
    return booking
};




export const BookingService = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getBookingsOnMyPost,
    updateBookingStatus,
    deleteBooking
}





// export const BookingService = {
//   createBooking,
//   getMyBookings,
//   cancelBooking,
//   getBookingsOnMyPost,
//   updateBookingStatus,
// };