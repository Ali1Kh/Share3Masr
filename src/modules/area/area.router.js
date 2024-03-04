import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as areaController from "./area.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as areaSchema from "./area.schema.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validation(areaSchema.createAreaSchema),
  asyncHandler(areaController.createArea)
);

router.patch(
    "/:id",
    isAuthenticated,
    isAuthorized("admin"),
    validation(areaSchema.updateAreaSchema),
    asyncHandler(areaController.updateArea)
  );

  router.delete(
    "/:id",
    isAuthenticated,
    isAuthorized("admin"),
    validation(areaSchema.deleteAreaSchema),
    asyncHandler(areaController.deleteArea)
  );

router.get(
  "/",
  asyncHandler(areaController.getAreas)
);

export default router;
