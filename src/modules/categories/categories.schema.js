import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createCategorySchema = Joi.object({
  categoryName: Joi.string().required(),
}).required();

export const deleteCategorySchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
}).required();

export const updateCategorySchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
  categoryName: Joi.string(),
}).required();
