import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as orderController from "./order.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as orderSchema from "./order.schema.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validation(orderSchema.createOrderSchema),
  asyncHandler(orderController.createOrder)
);

router.post(
  "/acceptOrder/:orderId",
  isAuthenticated,
  isAuthorized("resturant"),
  validation(orderSchema.orderIdReqSchema),
  asyncHandler(orderController.acceptOrder)
);
router.post(
  "/rejectOrder/:orderId",
  isAuthenticated,
  isAuthorized("resturant"),
  validation(orderSchema.orderIdReqSchema),
  asyncHandler(orderController.rejectOrder)
);

router.post(
  "/orderReady/:orderId",
  isAuthenticated,
  isAuthorized("resturant"),
  validation(orderSchema.orderIdReqSchema),
  asyncHandler(orderController.orderReady)
);

router.get(
  "/resturantPendingOrders",
  isAuthenticated,
  isAuthorized("resturant"),
  asyncHandler(orderController.getResturantPendingOrders)
);

router.get(
  "/resturantAcceptedOrders",
  isAuthenticated,
  isAuthorized("resturant"),
  asyncHandler(orderController.getResturantAcceptedOrders)
);

router.get(
  "/resturantOrdersHistory",
  isAuthenticated,
  isAuthorized("resturant"),
  asyncHandler(orderController.getResturantOrdersHistory)
);

router.get(
  "/getUserOrders",
  isAuthenticated,
  isAuthorized("customer"),
  asyncHandler(orderController.getUserOrders)
);

router.get(
  "/allOrdersHistory",
  isAuthenticated,
  isAuthorized("admin"),
  asyncHandler(orderController.getAllOrdersHistory)
);


export default router;
