// testMongo.js
import mongoose from "mongoose";

// 1. Define schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

// 2. Define model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// 3. Test function
async function test() {
  try {
    // Replace YOUR_URI_HERE with your actual MongoDB connection string
    await mongoose.connect("mongodb+srv://iftirahman:dbpassword@cluster0.wahjl.mongodb.net/deepseek");

    console.log("✅ Connected to MongoDB");

    const user = await User.create({ name: "Test User", email: "test@example.com" });

    console.log("🎉 User inserted:", user);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

test();
