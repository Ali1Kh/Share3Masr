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
  validation(deliverySchema.idReqSchema),
  asyncHandler(deliveryController.deleteDelivery)
);

router.post(
  "/login",
  validation(deliverySchema.deliveryLoginSchema),
  asyncHandler(deliveryController.deliveryLogin)
);
router.post(
  "/logout",
  isAuthenticated,
  isAuthorized("delivery"),
  asyncHandler(deliveryController.logout)
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  asyncHandler(deliveryController.getAllDeliveries)
);

router.get(
  "/readyOrders",
  isAuthenticated,
  isAuthorized("delivery"),
  asyncHandler(deliveryController.getReadyOrders)
);

router.get(
  "/onWayOrders",
  isAuthenticated,
  isAuthorized("delivery"),
  asyncHandler(deliveryController.getOnWayOrders)
);

router.get(
  "/deliveryOrders",
  isAuthenticated,
  isAuthorized("delivery"),
  asyncHandler(deliveryController.getDelivereyOrders)
);

router.get(
  "/deliveryOrderDetails/:id",
  isAuthenticated,
  isAuthorized("delivery"),
  validation(deliverySchema.idReqSchema),
  asyncHandler(deliveryController.getDelivereyOrderDetails)
);

router.post(
  "/receiveTheOrder/:id",
  isAuthenticated,
  isAuthorized("delivery"),
  validation(deliverySchema.idReqSchema),
  asyncHandler(deliveryController.receiveTheOrder)
);
router.post(
  "/orderDelivered/:id",
  isAuthenticated,
  isAuthorized("delivery"),
  validation(deliverySchema.idReqSchema),
  asyncHandler(deliveryController.orderDelivered)
);


export default router;
