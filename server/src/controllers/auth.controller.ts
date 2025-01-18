import { ROLE } from "@prisma/client";
import { COOKIE_EXPIRATION } from "../config";
import { db, jwt, passwordCrypt, zodErrorFmt } from "../libs";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { authValidator } from "../validators";

export const signUpController = asyncWrapper(async (req, res) => {
  const bodyValidation = authValidator.signUpSchema.safeParse(req.body);

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const existingUser = await db.user.findUnique({
    where: { email: bodyValidation.data.email },
  });

  if (existingUser) throw RouteError.BadRequest("Email already in use.");

  const hashedPassword = await passwordCrypt.hashPassword(
    bodyValidation.data.password
  );

  const user = await db.user.create({
    data: {
      fullName: bodyValidation.data.fullName,
      email: bodyValidation.data.email,
      password: hashedPassword,
      flag: {
        create: {
          isSuspended: false,
        },
      },
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
  const bodyValidation = authValidator.signInSchema.safeParse(req.body);
  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const existingUser = await db.user.findUnique({
    where: { email: bodyValidation.data.email },
  });

  if (!existingUser) throw RouteError.BadRequest("Invalid email or password");

  if (existingUser.role === "UNKNOWN")
    throw RouteError.BadRequest("Please wait while admin defines your role.");

  const isCorrectPassword = await passwordCrypt.verifyPassword(
    bodyValidation.data.password,
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

export const verifyUser = asyncWrapper(async (req, res) => {
  const user = req.user!;

  const existingUser = await db.user.findUnique({
    where: {
      id: user._id,
    },
    include: {
      flag: true,
    },
  });

  if (!existingUser) throw RouteError.NotFound("User not found.");

  return sendApiResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User verified successfully",
    result: {
      user: {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        flag: existingUser.flag,
      },
    },
  });
});

export const updateROLEController = asyncWrapper(async (req, res) => {
  const bodyValidation = authValidator.updateROLESchema.safeParse(req.body);
  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const existingUser = await db.user.findUnique({
    where: { id: bodyValidation.data.userId },
  });

  if (!existingUser)
    throw RouteError.NotFound("User not found with the provided ID.");

  const updatedUser = await db.user.update({
    where: {
      id: bodyValidation.data.userId,
    },
    data: {
      role: bodyValidation.data.role,
      salesPerson: ([ROLE.ADMIN, ROLE.SALES_PERSON] as string[]).includes(
        bodyValidation.data.role
      )
        ? {
            create: {},
          }
        : undefined,
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

export const changePasswordController = asyncWrapper(async (req, res) => {
  const bodyValidation = authValidator.changePasswordSchema.safeParse(req.body);
  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const user = req.user!;

  const existingUser = await db.user.findUnique({
    where: {
      id: user._id,
    },
  });

  if (!existingUser) throw RouteError.NotFound("User not found.");

  const isCorrectPassword = await passwordCrypt.verifyPassword(
    bodyValidation.data.oldPassword,
    existingUser.password
  );

  if (!isCorrectPassword) throw RouteError.BadRequest("Wrong password.");

  const newHashedPassword = await passwordCrypt.hashPassword(
    bodyValidation.data.newPassword
  );

  await db.user.update({
    where: {
      id: user._id,
    },
    data: {
      password: newHashedPassword,
    },
  });

  return sendApiResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User password updated successfully",
    result: null,
  });
});
