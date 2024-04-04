import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as cartController from "./cart.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as cartSchema from "./cart.schema.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";

let router = Router();

router.post(
  "/",
  isAuthenticated,
  validation(cartSchema.addToCartSchema),
  asyncHandler(cartController.addToCart)
);

export default router;
