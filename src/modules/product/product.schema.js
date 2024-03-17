import joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createProductSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  category: joi.custom(ObjectIdValidate).required(),
  resturant: joi.custom(ObjectIdValidate).required(),
  resturantCategory: joi.custom(ObjectIdValidate).required(),
  prices: joi
    .array()
    .items(
      joi.object({
        sizeName: joi.string().required(),
        sizePrice: joi.string().required(),
      })
    )
    .required(),
  extra: joi.array().items(
    joi.object({
      itemName: joi.string().required(),
      price: joi.string().required(),
    })
  ),
});

export const idRequiredSchema = joi.object({
  id: joi.custom(ObjectIdValidate).required(),
});

export const updateProductSchema = joi.object({
  id: joi.custom(ObjectIdValidate).required(),
  name: joi.string().required(),
  description: joi.string().required(),
  prices: joi
    .array()
    .items(
      joi.object({
        sizeName: joi.string(),
        sizePrice: joi.string(),
      })
    )
    .required(),
  extra: joi.array().items(
    joi.object({
      itemName: joi.string(),
      price: joi.string(),
    })
  ),
});
