import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Resturant } from "../../DB/models/resturant.model.js";
import { Delivery } from "../../DB/models/delivery.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new Error("You Must Enter Token"));
  const isToken = await Token.findOne({ token, isValid: true });
  if (!isToken) return next(new Error("Token Is Invaild"));
  let payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  if (payload.role == "customer" || payload.role == "admin") {
    let user = await User.findById(payload.id);
    if (!user) return next(new Error("Token was Expired or Deleted"));
    req.user = user;
  } else if (payload.role == "resturant") {
    let resturant = await Resturant.findById(payload.id);
    if (!resturant) return next(new Error("Token was Expired or Deleted"));
    req.resturant = resturant;
  } else if (payload.role == "delivery") {
    let delivery = await Delivery.findById(payload.id);
    if (!delivery) return next(new Error("Token was Expired or Deleted"));
    req.delivery = delivery;
  }

  return next();
});
