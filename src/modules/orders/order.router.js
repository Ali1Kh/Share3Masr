import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as orderController from "./order.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as orderSchema from "./order.schema.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validation(orderSchema.createOrderSchema),
  asyncHandler(orderController.createOrder)
);

export default router;
