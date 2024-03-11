import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as categoryController from "./categories.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as categorySchema from "./categories.schema.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { uploadFiles } from "../../utils/multer.js";
const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFiles().single("categoryImage"),
  validation(categorySchema.createCategorySchema),
  asyncHandler(categoryController.createCategory)
);

router.get("/", asyncHandler(categoryController.getCategories));

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(categorySchema.deleteCategorySchema),
  asyncHandler(categoryController.deleteCategory)
);

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFiles().single("categoryImage"),
  validation(categorySchema.updateCategorySchema),
  asyncHandler(categoryController.updateCategory)
);

export default router;
