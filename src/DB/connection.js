import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  }
};

export default connectDB;
