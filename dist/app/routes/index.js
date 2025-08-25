"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const apply_route_1 = require("../modules/apply/apply.route");
const driver_route_1 = require("../modules/driver/driver.route");
const ride_route_1 = require("../modules/ride/ride.route");
const booking_route_1 = require("../modules/bookingRider&driver/booking.route");
const state_route_1 = require("../modules/state/state.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/apply',
        route: apply_route_1.ApplyRoutes
    },
    {
        path: '/driver',
        route: driver_route_1.DriverRoutes
    },
    {
        path: '/rider',
        route: ride_route_1.RiderRoutes
    },
    {
        path: '/booking',
        route: booking_route_1.BookingRoutes
    },
    {
        path: '/stats',
        route: state_route_1.StatsRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
