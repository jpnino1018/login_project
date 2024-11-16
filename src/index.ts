import express from 'express';
import { connectDB } from './db/init'; // Import the connectDB function
import userRoutes from './routes/authRoutes'; // Import the routes

const app = express();

app.use(express.json());

// Ensure database is connected before starting the server
connectDB()
  .then(() => {
    // Once the DB is connected, start using routes
    app.use('/api', userRoutes);

    // Start the server
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit if database connection fails
  });
