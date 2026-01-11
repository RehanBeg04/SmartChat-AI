
import rateLimit from "express-rate-limit";

export const geminiLimiter = rateLimit({
  windowMs: 1 * 30 * 1000,
  max: 10, 
  message: {
    error: "Too many AI requests. Please try again after a minute."
  }
});