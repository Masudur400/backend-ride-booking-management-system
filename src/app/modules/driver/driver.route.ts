import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverController } from "./driver.controller";




const router = Router()


router.post('/create', checkAuth(Role.DRIVER), DriverController.createDriverPost)
router.get('/all', checkAuth(...Object.values(Role)), DriverController.getAllDriverPosts)
router.get('/my-posts', checkAuth(Role.DRIVER), DriverController.getMyDriverPosts)
router.patch('/status/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DriverController.updatePostStatus)
router.delete('/delete/:id', checkAuth(Role.DRIVER), DriverController.deleteMyDriverPost)



export const DriverRoutes = router