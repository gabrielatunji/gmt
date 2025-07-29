import { Router } from "express";
import { adminLogin, signupAdmin } from "../controllers/admin.controller";


const adminRouter = Router(); 


/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Operations related to admin management
 */

/**
 * @swagger
 * /admin/signup:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The admin's email address.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 description: The admin's first name.
 *                 example: Jill
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
adminRouter.post('/signup', signupAdmin); 

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Authenticate and log in an existing admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The admin's email address.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Admin logged in successfully. Returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
adminRouter.post('/login', adminLogin);


export default adminRouter; 