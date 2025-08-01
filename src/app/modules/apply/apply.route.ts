import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ApplyController } from "./apply.controller";




const router = Router();


router.post('/create-apply', checkAuth(Role.USER), ApplyController.createApplication);
router.get('/my-apply', checkAuth(Role.USER), ApplyController.getMyApplication);
router.get("/all-apply", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ApplyController.getAllApplications);
router.delete("/cancel", checkAuth(Role.USER), ApplyController.cancelApplication);
router.patch("/approve/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ApplyController.approveApplication);




export const ApplyRoutes = router
 
