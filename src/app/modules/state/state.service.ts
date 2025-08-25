import { User } from "../user/user.model";
import { Driver } from "../driver/driver.model";
import { Rider } from "../ride/ride.model";
import { Booking } from "../bookingRider&driver/booking.model";
import { IBookingStatus } from "../bookingRider&driver/booking.interface";
import { Types } from "mongoose";

const now = new Date();
const sevenDaysAgo = new Date(now);
sevenDaysAgo.setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now);
thirtyDaysAgo.setDate(now.getDate() - 30);

const getDashboardStats = async () => {
  // Users
  const totalUsersPromise = User.countDocuments();
  const usersByRolePromise = User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]);

  const newUsers7DaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const newUsers30DaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  // Riders & Drivers
  const totalRidersPromise = Rider.countDocuments();
  const totalDriversPromise = Driver.countDocuments();

  const recentRidersPromise = Rider.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const recentDriversPromise = Driver.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  // Bookings
  const totalBookingsPromise = Booking.countDocuments();
  const bookingByStatusPromise = Booking.aggregate([
    { $group: { _id: "$bookingStatus", count: { $sum: 1 } } }
  ]);

  const bookings7DaysPromise = Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const bookings30DaysPromise = Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  const [
    totalUsers, usersByRole, newUsers7Days, newUsers30Days,
    totalRiders, totalDrivers, recentRiders, recentDrivers,
    totalBookings, bookingByStatus, bookings7Days, bookings30Days
  ] = await Promise.all([
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
};

// ✅ USER Dashboard Stats
const getUserStats = async (userId: string) => {
  const totalBookings = await Booking.countDocuments({ bookerId: userId });
  const completedBookings = await Booking.countDocuments({ bookerId: userId, bookingStatus: "COMPLETED" });
  const pendingBookings = await Booking.countDocuments({ bookerId: userId, bookingStatus: "REQUESTED" });
  const cancelledBookings = await Booking.countDocuments({ bookerId: userId, bookingStatus: "CANCELLED" });

  return {
    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings
  };
};

const getRiderStats = async (riderId: string) => {
  const totalBookings = await Booking.countDocuments({ transporterId: riderId });
  const completedBookings = await Booking.countDocuments({ transporterId: riderId, bookingStatus: IBookingStatus.COMPLETED });
  const pendingBookings = await Booking.countDocuments({ transporterId: riderId, bookingStatus: IBookingStatus.REQUESTED });
  const cancelledBookings = await Booking.countDocuments({ transporterId: riderId, bookingStatus: IBookingStatus.CANCELLED });

  // Rider earnings (completed bookings এর total amount)
  const earningsData = await Booking.aggregate([
    { $match: { transporterId: new Types.ObjectId(riderId), bookingStatus: IBookingStatus.COMPLETED } },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$amount" } // amount Number type
      }
    }
  ]);

  const totalEarnings = earningsData[0]?.totalEarnings || 0;

  return {
    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalEarnings
  };
};


// ✅ DRIVER Dashboard Stats
const getDriverStats = async (driverId: string) => {
  const totalBookings = await Booking.countDocuments({ transporterId: driverId });
  const completedBookings = await Booking.countDocuments({ transporterId: driverId, bookingStatus: IBookingStatus.COMPLETED });
  const pendingBookings = await Booking.countDocuments({ transporterId: driverId, bookingStatus: IBookingStatus.REQUESTED });
  const cancelledBookings = await Booking.countDocuments({ transporterId: driverId, bookingStatus: IBookingStatus.CANCELLED });

  // driver earnings (completed bookings এর total amount)
  const earningsData = await Booking.aggregate([
    { $match: { transporterId: new Types.ObjectId(driverId), bookingStatus: IBookingStatus.COMPLETED } },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$amount" } // amount Number type
      }
    }
  ]);

  const totalEarnings = earningsData[0]?.totalEarnings || 0;

  return {
    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalEarnings
  };
};
 

export const StatsService = { 
  getDashboardStats, 
  getUserStats, 
  getRiderStats, 
  getDriverStats 
};
