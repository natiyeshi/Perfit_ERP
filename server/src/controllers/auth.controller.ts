import { COOKIE_EXPIRATION } from "../config";
import { db, jwt, passwordCrypt, zodErrorFmt } from "../libs";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { authValidator } from "../validators";

export const signUpController = asyncWrapper(async (req, res) => {
  const { data, success, error } = authValidator.signUpSchema.safeParse(
    req.body
  );

  if (!success)
    throw RouteError.BadRequest(
      zodErrorFmt(error)[0].message,
      zodErrorFmt(error)
    );

  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) throw RouteError.BadRequest("Email already in use.");

  const hashedPassword = await passwordCrypt.hashPassword(data.password);

  const user = await db.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
    },
  });

  const { password, ...userDto } = user;

  return sendApiResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User signed up successfully",
    result: {
      user: userDto,
    },
  });
});

export const signInController = asyncWrapper(async (req, res) => {
  const { data, success, error } = authValidator.signInSchema.safeParse(
    req.body
  );
  if (!success)
    throw RouteError.BadRequest(
      zodErrorFmt(error)[0].message,
      zodErrorFmt(error)
    );

  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });

  if (!existingUser) throw RouteError.BadRequest("Invalid email or password");

  const isCorrectPassword = await passwordCrypt.verifyPassword(
    data.password,
    existingUser.password
  );

  if (!isCorrectPassword)
    throw RouteError.BadRequest("Invalid email or password");

  const token = jwt.signToken({
    userId: existingUser.id,
    role: existingUser.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    signed: true,
    expires: COOKIE_EXPIRATION,
  });

  const { password, ...userDto } = existingUser;

  return sendApiResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User signed up successfully",
    result: { user: userDto, token },
  });
});

export const updateUserRoleController = asyncWrapper(async (req, res) => {
  const { data, success, error } = authValidator.updateUserRoleSchema.safeParse(
    req.body
  );
  if (!success)
    throw RouteError.BadRequest(
      zodErrorFmt(error)[0].message,
      zodErrorFmt(error)
    );

  const existingUser = await db.user.findUnique({
    where: { id: data.userId },
  });

  if (!existingUser)
    throw RouteError.NotFound("User not found with the provided ID.");

  const updatedUser = await db.user.update({
    where: {
      id: data.userId,
    },
    data: {
      role: data.role,
    },
  });

  return sendApiResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    result: updatedUser,
  });
});
