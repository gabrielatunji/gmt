import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config(); 

export const sequelize = new Sequelize(
    process.env.DB_NAME!,  
    process.env.DB_USER!,
    process.env.DB_PASSWORD,
    {
    host: 'localhost',
    dialect: 'postgres',
    port: Number(process.env.PG_PORT), 
    models: [Posts]
}); 



const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};


export default connectDB