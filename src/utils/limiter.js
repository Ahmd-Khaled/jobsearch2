import { rateLimit } from "express-rate-limit";

// By default 5 requests/minute
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again in a minute.", // Return a custom message on rate limit exceeded
  statusCode: 429, // default 429
  handler: (req, res, next, options) => {
    next(new Error(options.message, { cause: options.statusCode }));
  },
  legacyHeaders: true, // default true
  standardHeaders: true, // default true , it takes Boolean | String (draft-6, draft-7, draft-8)
  skipSuccessfulRequests: false, // default false
  skipFailedRequests: false, // default false
});
