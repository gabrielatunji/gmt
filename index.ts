import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'; 
import connectDB from './src/config/db'; 
import userRouter from './src/routers/user.route';
import postRouter from './src/routers/post.route';
import commentRouter from './src/routers/comment.route';
import adminRouter from './src/routers/admin.route'; 
import paymentRouter from './src/routers/payment.route';
import swaggerUi from 'swagger-ui-express'; // Import swaggerUi
import swaggerSpec from './src/config/swagger'; // Import swaggerSpec


dotenv.config(); 

const PORT: number = 2500;
const app: Express = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serve Swagger UI

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to GMT API!');
}); 


app.use('/api/v1/user', userRouter); 
app.use('/api/v1/post', postRouter); 
app.use('/api/v1/admin', adminRouter); 
app.use('/api/v1/comments/', commentRouter); 
app.use('/api/v1/payment', paymentRouter);

app.listen(PORT, () => {
    connectDB(); 
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`); // Display the swagger documentation path
});