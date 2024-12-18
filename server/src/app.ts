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
app.use("/api/v1/suppliers", routes.supplierRouter);
app.use("/api/v1/competitors", routes.competitorRouter);
app.use("/api/v1/competitor-imports", routes.competitorImportRouter);
app.use("/api/v1/inventories", routes.inventoryRouter);
app.use("/api/v1/customers", routes.customerRouter);
app.use("/api/v1/transactions", routes.transactionRouter);
app.use("/api/v1/product-categories", routes.productCategoryRouter);

setupSwagger(app);

// Error handling middleware
app.use(middlewares.routeErrorHandlingMiddleware);

export default app;
