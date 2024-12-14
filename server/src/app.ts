import express from "express";
import morgan from "morgan";
import cors from "cors";

import routes from "./routes";
import middlewares from "./middleware";

const app = express();

// Registering middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(middlewares.limiter);

// Registring routes
app.use("v1/api", routes.authRouter);

// Route error handling middleware
app.use(middlewares.routeErrorHandlingMiddleware);

export default app;
