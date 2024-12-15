import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";
import middlewares from "./middleware";
import { ENV } from "./config";

const app = express();

// Registering middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(middlewares.limiter);
app.use(cookieParser(ENV.COOKIE_SECRET)); // Use a secret key for signing


// Registring routes
app.use("/api/v1/auth", routes.authRouter);

// Route error handling middleware
app.use(middlewares.routeErrorHandlingMiddleware);

export default app;
