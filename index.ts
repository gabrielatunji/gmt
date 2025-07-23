import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'; 
import connectDB from './src/config/db'; 
import { sequelize } from './src/config/db'


dotenv.config(); 

const PORT: number = 2500;
const app: Express = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to GMT API!');
}); 


app.listen(PORT, () => {
    connectDB(); 
    console.log(`Server is running on port ${PORT}`);
});