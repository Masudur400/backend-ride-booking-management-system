"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const state_controller_1 = require("./state.controller");
const router = express_1.default.Router();
// ✅ ADMIN / SUPER_ADMIN
router.get("/dashboard", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), state_controller_1.StatsController.getDashboardStats);
// ✅ USER
router.get("/user", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), state_controller_1.StatsController.getUserStats);
// ✅ RIDER
router.get("/rider", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), state_controller_1.StatsController.getRiderStats);
// ✅ DRIVER
router.get("/driver", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), state_controller_1.StatsController.getDriverStats);
exports.StatsRoutes = router;
