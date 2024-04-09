import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const addToCartSchema = Joi.object({
  productId: Joi.custom(ObjectIdValidate).required(),
  sizeId: Joi.custom(ObjectIdValidate).required(),
  extraIds: Joi.array().items(Joi.custom(ObjectIdValidate)).required(),
  quantity: Joi.number().options({ convert: false }).min(1).required(),
});

export const deleteFromCartSchema = Joi.object({
  productId: Joi.custom(ObjectIdValidate).required(),
})