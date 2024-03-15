import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as productController from "./product.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as productSchema from "./product.schema.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { uploadFiles } from "../../utils/multer.js";
const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFiles().single("productImage"),
  validation(productSchema.createProductSchema),
  asyncHandler(productController.createProduct)
);

router.get("/", asyncHandler(productController.getProducts));

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(productSchema.deleteProductSchema),
  asyncHandler(productController.deleteProduct)
);

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFiles().single("productImage"),
  validation(productSchema.updateProductSchema),
  asyncHandler(productController.updateProduct)
);

export default router;
