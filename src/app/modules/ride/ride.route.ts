import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RiderController } from "./ride.controller";




const router = Router()


router.post('/create', checkAuth(Role.RIDER), RiderController.createRiderPost)
router.get('/all', checkAuth(...Object.values(Role)), RiderController.getAllRiderPosts)
router.get('/my-posts', checkAuth(Role.RIDER), RiderController.getMyRiderPosts)
router.patch('/status/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), RiderController.updatePostStatus)
router.delete('/delete/:id', checkAuth(Role.RIDER), RiderController.deleteMyRiderPost)



export const RiderRoutes = router