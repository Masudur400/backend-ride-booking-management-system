import express from "express"; 
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./state.controller";

const router = express.Router();

// ✅ ADMIN / SUPER_ADMIN
router.get(
  "/dashboard",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getDashboardStats
);

// ✅ USER
router.get(
  "/user",
  checkAuth(Role.USER),
  StatsController.getUserStats
);

// ✅ RIDER
router.get(
  "/rider",
  checkAuth(Role.RIDER),
  StatsController.getRiderStats
);

// ✅ DRIVER
router.get(
  "/driver",
  checkAuth(Role.DRIVER),
  StatsController.getDriverStats
);

export const StatsRoutes = router;
