import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as userController from "./user.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as userSchema from "./user.schema.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.post(
  "/signUp",
  validation(userSchema.signUpSchema),
  asyncHandler(userController.signUp)
);
router.post(
  "/login",
  validation(userSchema.loginSchema),
  asyncHandler(userController.login)
);

router.get(
  "/getTokenInfo",
  isAuthenticated,
  isAuthorized("customer"),
  asyncHandler(userController.getTokenInfo)
);

router.post(
  "/adminLogin",
  validation(userSchema.adminLoginSchema),
  asyncHandler(userController.adminLogin)
);

export default router;
