import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDb = async () => {
  try {
    const res = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (res) {
      console.log("✅ DB Connected Successfully!");
    }
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
};

export default connectDb;
