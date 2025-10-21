import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";

import authRoute from "./routes/authRoute.js";
import blogRoute from "./routes/blogRoute.js";
import donationRoute from "./routes/donationRoute.js";
import userRoute from "./routes/userRoute.js";

// Import security middlewares
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import {
  generalLimiter,
  authLimiter,
  blogCreationLimiter,
  commentLimiter,
} from "./middlewares/rateLimiter.js";

const app = express();
dotenv.config();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(compression());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use("/auth", authLimiter);
app.use("/blog/create", blogCreationLimiter);
app.use("/blog/comments", commentLimiter);
app.use(generalLimiter);

app.use("/auth", authRoute);
app.use("/blog", blogRoute);
app.use("/donate", donationRoute);
app.use("/user", userRoute);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "RAZORPAY_API_KEY",
  "RAZORPAY_SECRET",
  "CLOUDINARY_CLOUD_NAME",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} is required`);
    process.exit(1);
  }
}

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log("Connected to : ", conn.connection.host);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
