import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as resturantController from "./resturants.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as resturantSchema from "./resturants.schema.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { uploadFiles } from "../../utils/multer.js";
const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFiles().single("resturantImage"),
  validation(resturantSchema.createResturantSchema),
  asyncHandler(resturantController.createResturant)
);

router.get("/", asyncHandler(resturantController.getResturants));

router.get(
  "/subCategories/:id",
  validation(resturantSchema.idRequiredSchema),
  asyncHandler(resturantController.getResturantSubCategories)
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(resturantSchema.idRequiredSchema),
  asyncHandler(resturantController.deleteResturant)
);

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFiles().single("resturantImage"),
  validation(resturantSchema.updateResturantSchema),
  asyncHandler(resturantController.updateResturant)
);

router.get(
  "/getCategoryResturants/:id",
  validation(resturantSchema.idRequiredSchema),
  asyncHandler(resturantController.getCategoryResturants)
);

router.post("/login", validation(resturantSchema.resturantLoginSchema), asyncHandler(resturantController.resturantLogin));
router.post("/logout", isAuthenticated, asyncHandler(resturantController.logout));

export default router;
