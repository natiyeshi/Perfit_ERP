import { asyncWrapper, RouteError } from "../utils";
import { jwt } from "../libs";
import { ROLE } from "@prisma/client";

// To satisfy ts compiler
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        _role: ROLE;
      };
    }
  }
}

const authenticationMiddleWare = asyncWrapper(async (req, _, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw RouteError.Unauthorized("You are't authenticated");

  const token = authHeader.replace("Bearer ", "");

  if (!token) throw RouteError.Unauthorized("You are't authenticated");

  const payload = jwt.isValidToken<{
    userId: string;
    role: ROLE;
  }>(token);

  if (!payload) throw RouteError.Unauthorized("Invalid token");

  req.user = { _id: payload.userId, _role: payload.role };
  next();
});

const roleAuthenticationMiddleware = (roles: ROLE[]) => {
  return asyncWrapper(async (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw RouteError.Unauthorized("You are't authenticated");

    const token = authHeader.replace("Bearer ", "");

    if (!token) throw RouteError.Unauthorized("You are't authenticated");

    const payload = jwt.isValidToken<{
      userId: string;
      role: ROLE;
    }>(token);

    if (!payload) throw RouteError.Unauthorized("Invalid token");

    if (!roles.includes(payload.role))
      throw RouteError.Unauthorized("You don't have the required permissions.");

    req.user = { _id: payload.userId, _role: payload.role };

    next();
  });
};

export default { authenticationMiddleWare, roleAuthenticationMiddleware };
