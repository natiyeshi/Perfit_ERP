import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";
import middlewares from "./middleware";
import { ENV } from "./config";
import { setupSwagger } from "./libs";

const app = express();

// Registering middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(middlewares.limiter);
app.use(cookieParser(ENV.COOKIE_SECRET)); // Use a secret key for signing

// Routes
app.use("/api/v1/auth", routes.authRouter);
app.use("/api/v1/users", routes.userRouter);
app.use("/api/v1/products", routes.productRouter);

setupSwagger(app);

// Error handling middleware
app.use(middlewares.routeErrorHandlingMiddleware);

export default app;
