import rateLimit from "express-rate-limit";

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== "production";
const disableRateLimit = process.env.DISABLE_RATE_LIMIT === "true";

// Create a no-op middleware for when rate limiting is disabled
const noOpLimiter = (req, res, next) => next();

// General rate limiter
export const generalLimiter = disableRateLimit
  ? noOpLimiter
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: isDevelopment ? 1000 : 100, // More lenient in development
      message: {
        message: "Too many requests from this IP, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Auth rate limiter (stricter)
export const authLimiter = disableRateLimit
  ? noOpLimiter
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: isDevelopment ? 100 : 20, // Much more lenient in development
      message: {
        message: "Too many authentication attempts, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Blog creation rate limiter
export const blogCreationLimiter = disableRateLimit
  ? noOpLimiter
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: isDevelopment ? 100 : 10, // More lenient in development
      message: {
        message: "Too many blog creations, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Comment rate limiter
export const commentLimiter = disableRateLimit
  ? noOpLimiter
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: isDevelopment ? 200 : 20, // More lenient in development
      message: {
        message: "Too many comments, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
