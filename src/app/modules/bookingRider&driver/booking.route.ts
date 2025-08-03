import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { BookingControllers } from "./booking.controller";




const router = Router()



router.post('/create', checkAuth(...Object.values(Role)), BookingControllers.createBooking)
router.get('/my-bookings', checkAuth(...Object.values(Role)), BookingControllers.getMyBookings)
router.delete('/cancel/:id', checkAuth(...Object.values(Role)), BookingControllers.cancelBooking)
router.get('/my-posts/bookings', checkAuth(Role.RIDER, Role.DRIVER), BookingControllers.getBookingsOnMyPost)
router.patch('/update-status/:id', checkAuth(Role.RIDER, Role.DRIVER), BookingControllers.updateBookingStatus)




export const BookingRoutes = router  