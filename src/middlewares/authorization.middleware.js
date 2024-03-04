import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthorized = (role) => {
  return asyncHandler(async (req, res, next) => {
    if (role != req.user.role)
      return next(new Error("You Don't Have Permissions"));
    next();
  });
};
