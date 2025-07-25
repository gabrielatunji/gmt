import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'; 
import connectDB from './src/config/db'; 
import userRouter from './src/routers/user.route';
import postRouter from './src/routers/post.route';
import commentRouter from './src/routers/comment.route';


dotenv.config(); 

const PORT: number = 2500;
const app: Express = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to GMT API!');
}); 


app.use('/api/v1/user', userRouter); 
app.use('/api/v1/post', postRouter); 
app.use('/api/v1/post', commentRouter); 

app.listen(PORT, () => {
    connectDB(); 
    console.log(`Server is running on port ${PORT}`);
});