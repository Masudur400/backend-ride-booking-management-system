import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'  
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import { IBookingStatus } from "./booking.interface";
import AppError from "../../errorHandler/AppError";




const createBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload
  const loggedInUser = await User.findById(user.userId) as IUser
  const { postId } = req.body;
  const result = await BookingService.createBooking(postId, user, loggedInUser)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});



const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload
  const result = await BookingService.getMyBookings(user.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My bookings retrieved successfully',
    data: result,
  });
});



const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload
  const { id } = req.params
  const result = await BookingService.cancelBooking(id, user.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  });
});



const getBookingsOnMyPost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload
  const result = await BookingService.getBookingsOnMyPost(user.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings on my posts retrieved',
    data: result,
  });
});


const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload
  const { id } = req.params
  const { bookingStatus } = req.body  
  if (!Object.values(IBookingStatus).includes(bookingStatus)) {
  throw new AppError(httpStatus.BAD_REQUEST, 'Invalid status value')
}
  const result = await BookingService.updateBookingStatus(id, user.userId, bookingStatus)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking status updated successfully',
    data: result,
  });
});


const deleteBooking = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload
    const { id } = req.params

    const result = await BookingService.deleteBooking(id, user.userId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking deleted successfully',
        data: result,
    })
})


export const BookingControllers = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getBookingsOnMyPost,
    updateBookingStatus,
    deleteBooking
}

