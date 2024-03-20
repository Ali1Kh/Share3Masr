import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as deliveryController from "./delivery.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as deliverySchema from "./delivery.schema.js";

const router = Router();

router.post(
  "/createDelivery",
  isAuthenticated,
  isAuthorized("admin"),
  validation(deliverySchema.createDeliverySchema),
  asyncHandler(deliveryController.createDelivery)
);

router.patch(
  "/updateDelivery/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(deliverySchema.updateDeliverySchema),
  asyncHandler(deliveryController.updateDelivery)
);

router.delete(
  "/deleteDelivery/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(deliverySchema.deleteDeliverySchema),
  asyncHandler(deliveryController.deleteDelivery)
);

router.post(
  "/login",
  validation(deliverySchema.deliveryLoginSchema),
  asyncHandler(deliveryController.deliveryLogin)
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  asyncHandler(deliveryController.getAllDeliveries)
);

export default router;
