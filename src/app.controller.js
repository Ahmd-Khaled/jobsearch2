import connectDB from "./DB/connection.js";
import globalErrorHandler from "./utils/error_handling/globalErrorHandler.js";
import notFoundHandler from "./utils/error_handling/notFoundHandler.js";
import cors from "cors";
import morgan from "morgan";

import helmet from "helmet";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import companyRouter from "./Modules/Company/company.controller.js";
import adminRouter from "./Modules/Admin/admin.controller.js";
import jobsRouter from "./Modules/Jobs/jobs.controller.js";
import chatRouter from "./Modules/Chat/chat.controller.js";
import applicationsRouter from "./Modules/Applications/applications.controller.js";
import { limiter } from "./utils/limiter.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./Modules/app.graph.js";

// Cron job to delete expired OTPs every 6 Hrs
import "./cron/otpCleanup.js";

const bootstrap = async (app, express) => {
  await connectDB();

  app.use(limiter); // Apply rate limiter middleware to all requests
  app.use(helmet());
  app.use(morgan("combined")); // Logging middleware for development
  app.use(cors()); // Enable CORS for all requests

  app.options("*", cors()); //Handle Preflight Requests (for non-simple requests)

  app.use(express.json()); // Body parsing
  app.use(express.urlencoded({ extended: true })); // To parse form-data arrays
  // Routes------------------
  app.get("/", (req, res) => {
    res.json({ message: "API is working - Vercel Test" });
  });

  app.use(
    "/graphql",
    createHandler({
      schema: schema,
      context: async ({ request, raw }) => {
        const token = raw.headers.authorization;
        console.log("==== Authorization Header ====>", token);
        return { token }; //  This will wrap token in { token }
      },
    })
  );

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/admin", adminRouter);
  app.use("/jobs", jobsRouter);
  app.use("/chat", chatRouter);
  app.use("/applications", applicationsRouter);

  app.all("*", notFoundHandler);

  app.use(globalErrorHandler);
};

export default bootstrap;
