import express from 'express';
import { connectDB } from './db/init'; // Import the connectDB function
import userRoutes from './routes/authRoutes'; // Import the routes
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Include credentials like cookies, if needed
  })
);

// Ensure database is connected before starting the server
connectDB()
  .then(() => {
    // Once the DB is connected, start using routes
    app.use('/api', userRoutes);

    // Start the server
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit if database connection fails
  });
