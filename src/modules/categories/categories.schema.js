import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createCategorySchema = Joi.object({
  categoryNameEN: Joi.string().required(),
  categoryNameAR: Joi.string().required(),
}).required();

export const deleteCategorySchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
}).required();

export const updateCategorySchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
  categoryNameEN: Joi.string(),
  categoryNameAR: Joi.string(),
}).required();
