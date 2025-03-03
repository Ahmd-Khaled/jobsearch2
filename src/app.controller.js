import connectDB from "./DB/connection.js";
import globalErrorHandler from "./utils/error_handling/globalErrorHandler.js";
import notFoundHandler from "./utils/error_handling/notFoundHandler.js";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import companyRouter from "./Modules/Company/company.controller.js";
import adminRouter from "./Modules/Admin/admin.controller.js";
import "./cron/otpCleanup.js";

const limiter = rateLimit({
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

const bootstrap = async (app, express) => {
  await connectDB();

  // By default 5 requests/minute
  app.use(limiter); // Apply rate limiter middleware to all requests
  app.use(helmet());
  app.use(morgan("combined")); // Logging middleware for development

  app.use(cors()); // Enable CORS for all requests

  app.use(express.json()); // Body parsing
  app.use(express.urlencoded({ extended: true })); // To parse form-data arrays
  // Routes------------------
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/admin", adminRouter);

  app.all("*", notFoundHandler);

  app.use(globalErrorHandler);
};

export default bootstrap;
