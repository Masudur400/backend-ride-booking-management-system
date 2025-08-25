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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("../driver/driver.model");
const ride_model_1 = require("../ride/ride.model");
const booking_model_1 = require("../bookingRider&driver/booking.model");
const booking_interface_1 = require("../bookingRider&driver/booking.interface");
const mongoose_1 = require("mongoose");
const now = new Date();
const sevenDaysAgo = new Date(now);
sevenDaysAgo.setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now);
thirtyDaysAgo.setDate(now.getDate() - 30);
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    // Users
    const totalUsersPromise = user_model_1.User.countDocuments();
    const usersByRolePromise = user_model_1.User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    const newUsers7DaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newUsers30DaysPromise = user_model_1.User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    // Riders & Drivers
    const totalRidersPromise = ride_model_1.Rider.countDocuments();
    const totalDriversPromise = driver_model_1.Driver.countDocuments();
    const recentRidersPromise = ride_model_1.Rider.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentDriversPromise = driver_model_1.Driver.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    // Bookings
    const totalBookingsPromise = booking_model_1.Booking.countDocuments();
    const bookingByStatusPromise = booking_model_1.Booking.aggregate([
        { $group: { _id: "$bookingStatus", count: { $sum: 1 } } }
    ]);
    const bookings7DaysPromise = booking_model_1.Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const bookings30DaysPromise = booking_model_1.Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const [totalUsers, usersByRole, newUsers7Days, newUsers30Days, totalRiders, totalDrivers, recentRiders, recentDrivers, totalBookings, bookingByStatus, bookings7Days, bookings30Days] = yield Promise.all([
        totalUsersPromise, usersByRolePromise, newUsers7DaysPromise, newUsers30DaysPromise,
        totalRidersPromise, totalDriversPromise, recentRidersPromise, recentDriversPromise,
        totalBookingsPromise, bookingByStatusPromise, bookings7DaysPromise, bookings30DaysPromise
    ]);
    return {
        users: {
            total: totalUsers,
            byRole: usersByRole,
            newLast7Days: newUsers7Days,
            newLast30Days: newUsers30Days
        },
        riders: {
            total: totalRiders,
            newLast7Days: recentRiders
        },
        drivers: {
            total: totalDrivers,
            newLast7Days: recentDrivers
        },
        bookings: {
            total: totalBookings,
            byStatus: bookingByStatus,
            last7Days: bookings7Days,
            last30Days: bookings30Days
        }
    };
});
// ✅ USER Dashboard Stats
const getUserStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookings = yield booking_model_1.Booking.countDocuments({ bookerId: userId });
    const completedBookings = yield booking_model_1.Booking.countDocuments({ bookerId: userId, bookingStatus: "COMPLETED" });
    const pendingBookings = yield booking_model_1.Booking.countDocuments({ bookerId: userId, bookingStatus: "REQUESTED" });
    const cancelledBookings = yield booking_model_1.Booking.countDocuments({ bookerId: userId, bookingStatus: "CANCELLED" });
    return {
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings
    };
});
const getRiderStats = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalBookings = yield booking_model_1.Booking.countDocuments({ transporterId: riderId });
    const completedBookings = yield booking_model_1.Booking.countDocuments({ transporterId: riderId, bookingStatus: booking_interface_1.IBookingStatus.COMPLETED });
    const pendingBookings = yield booking_model_1.Booking.countDocuments({ transporterId: riderId, bookingStatus: booking_interface_1.IBookingStatus.REQUESTED });
    const cancelledBookings = yield booking_model_1.Booking.countDocuments({ transporterId: riderId, bookingStatus: booking_interface_1.IBookingStatus.CANCELLED });
    // Rider earnings (completed bookings এর total amount)
    const earningsData = yield booking_model_1.Booking.aggregate([
        { $match: { transporterId: new mongoose_1.Types.ObjectId(riderId), bookingStatus: booking_interface_1.IBookingStatus.COMPLETED } },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$amount" } // amount Number type
            }
        }
    ]);
    const totalEarnings = ((_a = earningsData[0]) === null || _a === void 0 ? void 0 : _a.totalEarnings) || 0;
    return {
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        totalEarnings
    };
});
// ✅ DRIVER Dashboard Stats
const getDriverStats = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookings = yield booking_model_1.Booking.countDocuments({ transporterId: driverId });
    const completedBookings = yield booking_model_1.Booking.countDocuments({ transporterId: driverId, bookingStatus: "COMPLETED" });
    const pendingBookings = yield booking_model_1.Booking.countDocuments({ transporterId: driverId, bookingStatus: "REQUESTED" });
    const cancelledBookings = yield booking_model_1.Booking.countDocuments({ transporterId: driverId, bookingStatus: "CANCELLED" });
    return {
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings
    };
});
exports.StatsService = {
    getDashboardStats,
    getUserStats,
    getRiderStats,
    getDriverStats
};
