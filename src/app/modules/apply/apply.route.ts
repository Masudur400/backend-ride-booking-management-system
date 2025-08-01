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


 

// User applies as Rider or Driver
// router.post("/apply", checkAuth(Role.USER), ApplyController.createApplication);

// // User gets own applications
// router.get("/apply/my", checkAuth(Role.USER), ApplyController.getMyApplications);

// // Admin and Super Admin get all applications
// router.get("/apply", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ApplyController.getAllApplications);

// // Admin and Super Admin approve application
// router.patch("/apply/approve/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ApplyController.approveApplication);

// // User cancels own application before approval
// router.delete("/apply/cancel", checkAuth(Role.USER), ApplyController.cancelApplication);

// // User deletes own application (optional)
// router.delete("/apply/:id", checkAuth(Role.USER), ApplyController.deleteOwnApplication);

 
