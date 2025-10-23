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

app.set("trust proxy", 1);
app.use(compression());
app.use(
  cors({
    origin: "https://check-blogspot.netlify.app",
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

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Backend is running");
});
const PORT = process.env.PORT || 5000;

const requiredEnvVars = [
  "MONGO_URI",
  "RAZORPAY_API_KEY",
  "RAZORPAY_SECRET",
  "CLOUDINARY_CLOUD_NAME",
];

// Firebase environment variables (required for production)
const firebaseEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_CLIENT_ID",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} is required`);
    process.exit(1);
  }
}

// Check Firebase environment variables only in production
if (process.env.NODE_ENV === "production") {
  for (const envVar of firebaseEnvVars) {
    if (!process.env[envVar]) {
      console.error(`${envVar} is required for production deployment`);
      process.exit(1);
    }
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
