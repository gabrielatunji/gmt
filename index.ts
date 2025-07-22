import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'; 
import connectDB from './src/config/db'; 
import { sequelize } from './src/config/db';


dotenv.config(); 

const PORT: number = 2500;
const app: Express = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to GMT API!');
}); 

const startServer = async () => {
    try {
        await connectDB(); 
        await sequelize.sync({ alter: true }); 

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    } catch (error) {
        console.error('Server failed to start:', error);
    }
};

startServer();
