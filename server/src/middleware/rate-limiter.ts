import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5000, // Limit each IP to 5000 requests per `window`.
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export default limiter;
