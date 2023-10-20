// external modules import
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()
const connectionString = process.env.MONGO_URI || '';
console.log("connectionString",connectionString)
 const connectDatabase = async () => {
  try {
    await mongoose
      .connect(connectionString)
      .then(() => {
        console.log("Connected to MongoDB database successfully.");
      })
      .catch((error:any) => {
        console.log("Error connecting to MongoDB: ", error.message);
      });
  } catch (error:any) {
    console.log("Database connection error: ", error.message);
  }
};

export {connectDatabase}