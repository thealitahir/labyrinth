// Import required modules and dependencies
import express from "express";
import * as dotenv from 'dotenv'
import { notFoundRoute, errorHandler } from "./src/configs/error-handler";
import { connectDatabase } from "./src/db/connect";
import userRouter from "./src/routes/users.route";
import labyrinthRouter from "./src/routes/labyrinth.route";
import cors from 'cors'
// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Import and call the connectDatabase function
connectDatabase();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Parse requests with content-type: application/json
app.use(express.json());

// Parse requests with content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Set the default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Task Management" });
});

app.use(labyrinthRouter)
app.use(userRouter)

// Handle 404 - Not Found errors
app.use(notFoundRoute);

// Handle other errors with the errorHandler middleware
app.use(errorHandler);

// Listen on the defined port from environment variables
app.listen(5000, () => {
  console.log("Backend server running on: " + process.env.PORT);
});

export default app
