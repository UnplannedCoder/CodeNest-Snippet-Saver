import mongoose from "mongoose";
import dns from "node:dns";

// Fix Windows Node.js c-ares DNS SRV lookup issues for MongoDB Atlas (+srv)
dns.setDefaultResultOrder("ipv4first");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn(
    "DNS server override failed, using default system DNS:",
    e.message,
  );
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
