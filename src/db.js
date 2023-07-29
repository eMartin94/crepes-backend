import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const DB_URI = process.env.MONGODB_URI;
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }

}