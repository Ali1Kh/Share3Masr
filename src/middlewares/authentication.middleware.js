import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new Error("You Must Enter Token"));
  const isToken = await Token.findOne({ token, isValid: true });
  if (!isToken) return next(new Error("Token Is Invaild"));
  let payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  let user = await User.findById(payload.id);
  if (!user) return next(new Error("Token was Expired or Deleted"));
  req.user = user;
  return next();
});
