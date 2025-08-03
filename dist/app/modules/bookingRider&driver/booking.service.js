"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("../driver/driver.model");
const ride_model_1 = require("../ride/ride.model");
const createBooking = (postId, user, loggedInUser) => __awaiter(void 0, void 0, void 0, function* () {
    const driverPost = yield driver_model_1.Driver.findById(postId);
    const riderPost = !driverPost ? yield ride_model_1.Rider.findById(postId) : null;
    if (!driverPost && !riderPost) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Post not found');
    }
    const post = (driverPost || riderPost);
    let transporterId = '';
    let transporterName = '';
    let transporterEmail = '';
    if ('driverId' in post) {
        transporterId = post.driverId.toString();
        transporterName = post.driverName;
        transporterEmail = post.driverEmail;
    }
    else if ('riderId' in post) {
        transporterId = post.riderId.toString();
        transporterName = post.riderName;
        transporterEmail = post.riderEmail;
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
        bookingStatus: booking_interface_1.IBookingStatus.REQUESTED
    };
    const newBooking = yield booking_model_1.Booking.create(bookingData);
    return newBooking;
});
const getMyBookings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield booking_model_1.Booking.find({ bookerId: userId });
});
const cancelBooking = (bookingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Booking not found');
    }
    if (booking.bookingStatus === booking_interface_1.IBookingStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Booking already cancelled');
    }
    if (!booking.bookerId.equals(userId)) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied');
    }
    const disallowedStatuses = [booking_interface_1.IBookingStatus.ACCEPTED, booking_interface_1.IBookingStatus.PICKED_UP, booking_interface_1.IBookingStatus.IN_TRANSIT, booking_interface_1.IBookingStatus.COMPLETED];
    if (disallowedStatuses.includes(booking.bookingStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Cannot cancel this booking');
    }
    booking.bookingStatus = booking_interface_1.IBookingStatus.CANCELLED;
    return yield booking.save();
});
const getBookingsOnMyPost = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield booking_model_1.Booking.find({ transporterId: userId });
});
const updateBookingStatus = (bookingId, userId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if ((booking === null || booking === void 0 ? void 0 : booking.bookingStatus) === booking_interface_1.IBookingStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `booking request already ${booking_interface_1.IBookingStatus.CANCELLED}`);
    }
    if (!booking) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Booking not found');
    }
    if (!booking.transporterId.equals(userId)) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Access denied');
    }
    booking.bookingStatus = newStatus;
    return yield booking.save();
});
exports.BookingService = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getBookingsOnMyPost,
    updateBookingStatus,
};
// export const BookingService = {
//   createBooking,
//   getMyBookings,
//   cancelBooking,
//   getBookingsOnMyPost,
//   updateBookingStatus,
// };
