import dotenv from "dotenv";

type NODE_ENV_TYPE = "production" | "development";

const NODE_ENV: NODE_ENV_TYPE =
  (process.env.NODE_ENV as NODE_ENV_TYPE) || "development";

// Load the appropriate .env file based on NODE_ENV
dotenv.config({
  path: NODE_ENV === "production" ? ".env" : ".env.dev",
});

// Logging environment status
switch (NODE_ENV) {
  case "development":
    console.log(
      "🔧 [INFO] Environment: Development mode. Loading environment variables for local development."
    );
    break;
  case "production":
    console.log(
      "🌍 [INFO] Environment: Production mode. Loading environment variables for production."
    );
    break;
  default:
    console.warn(
      "⚠️ [WARNING] Environment: Unknown mode. Defaulting to development. Ensure NODE_ENV is set correctly."
    );
}

const ENV = {
  PORT: parseInt(process.env.PORT!),
  // PORT: 4040,
  JWT_SECRET: process.env.JWT_SECRET as string,
  COOKIE_SECRET: process.env.JWT_SECRET as string,
};

console.log({ ENV });

export default ENV;
