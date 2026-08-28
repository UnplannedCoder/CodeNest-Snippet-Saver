import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import snippetRoutes from "./routes/snippetRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env reliably
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config(); // fallback

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "CodeNest API is running smoothly" });
});

app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
