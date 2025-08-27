import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ApplyRoutes } from "../modules/apply/apply.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { RiderRoutes } from "../modules/ride/ride.route";
import { BookingRoutes } from "../modules/bookingRider&driver/booking.route";
import { StatsRoutes } from "../modules/state/state.route";
import { ContactRoutes } from "../modules/contace/contact.route";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/apply',
        route: ApplyRoutes
    },
    {
        path: '/driver',
        route: DriverRoutes
    },
    {
        path: '/rider',
        route: RiderRoutes
    },
    {
        path: '/booking',
        route: BookingRoutes
    },
    {
        path: '/stats',
        route: StatsRoutes
    },
    {
        path:'/mail',
        route:ContactRoutes
    }
]





moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})