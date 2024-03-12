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

router.delete(
  "/:id", 
  isAuthenticated,
  isAuthorized("admin"),
  validation(resturantSchema.deleteResturantSchema),
  asyncHandler(resturantController.deleteResturant)
)

export default router;
