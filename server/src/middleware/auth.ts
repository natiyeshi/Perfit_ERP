import { asyncWrapper, RouteError } from "../utils";
import { jwt } from "../libs";
import { UserRole } from "@prisma/client";

// To satisfy ts compiler
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        _role: UserRole;
      };
    }
  }
}

const authenticationMiddleWare = asyncWrapper(async (req, _, next) => {
  const token = req.signedCookies.token as string;

  if (!token) throw RouteError.Unauthorized("You are't authenticated");

  const payload = jwt.isValidToken<{
    userId: string;
    role: UserRole;
  }>(token);

  req.user = { _id: payload.userId, _role: payload.role };
  next();
});

const roleAuthenticationMiddleware = (roles: UserRole[]) => {
  return asyncWrapper(async (req, _, next) => {
    const token = req.signedCookies.token as string;

    if (!token) throw RouteError.Unauthorized("You are't authenticated");

    const payload = jwt.isValidToken<{
      userId: string;
      role: UserRole;
    }>(token);

    if (!roles.includes(payload.role))
      throw RouteError.Unauthorized("You don't have the required permissions.");

    req.user = { _id: payload.userId, _role: payload.role };

    next();
  });
};

export default { authenticationMiddleWare, roleAuthenticationMiddleware };
