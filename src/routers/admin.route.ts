import { Router, RequestHandler } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { adminLogin, signupAdmin } from "../controllers/admin.controller";


const adminRouter = Router(); 


adminRouter.post('/signup', signupAdmin); 
adminRouter.post('/login', adminLogin);


export default adminRouter; 