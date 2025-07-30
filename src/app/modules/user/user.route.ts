import { Router } from "express"; 
import { userControllers } from "./user.controller";



const router = Router()


router.post('/register', userControllers.createUser)
router.get('/all-users', userControllers.getAllUser)





export const UserRoutes = router