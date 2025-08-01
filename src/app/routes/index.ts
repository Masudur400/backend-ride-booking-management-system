import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ApplyRoutes } from "../modules/apply/apply.route";

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
]





moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})