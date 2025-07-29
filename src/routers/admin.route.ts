import { Router } from "express";
import { adminLogin, signupAdmin } from "../controllers/admin.controller";


const adminRouter = Router(); 


adminRouter.post('/signup', signupAdmin); 
adminRouter.post('/login', adminLogin);


export default adminRouter; 