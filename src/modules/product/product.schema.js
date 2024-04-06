import joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createProductSchema = joi.object({
  nameEN: joi.string().required(),
  nameAR: joi.string().required(),
  descriptionEN: joi.string().required(),
  descriptionAR: joi.string().required(),
  category: joi.custom(ObjectIdValidate).required(),
  resturant: joi.custom(ObjectIdValidate).required(),
  resturantCategory: joi.custom(ObjectIdValidate).required(),
  prices: joi
    .array()
    .items(
      joi.object({
        sizeNameEN: joi.string().required(),
        sizeNameAR: joi.string().required(),
        sizePrice: joi.string().required(),
      })
    )
    .required(),
  extra: joi.array().items(
    joi.object({
      itemNameEN: joi.string().required(),
      itemNameAR: joi.string().required(),
      price: joi.string().required(),
    })
  ),
});

export const idRequiredSchema = joi.object({
  id: joi.custom(ObjectIdValidate).required(),
});

export const updateProductSchema = joi.object({
  id: joi.custom(ObjectIdValidate).required(),
  nameEN: joi.string().required(),
  nameAR: joi.string().required(),
  descriptionEN: joi.string().required(),
  descriptionAR: joi.string().required(),
  resturantCategory: joi.custom(ObjectIdValidate).required(),
  prices: joi
    .array()
    .items(
      joi.object({
        sizeNameEN: joi.string(),
        sizeNameAR: joi.string(),
        sizePrice: joi.string(),
      })
    )
    .required(),
  extra: joi.array().items(
    joi.object({
      itemNameEN: joi.string(),
      itemNameAR: joi.string(),
      price: joi.string(),
    })
  ),
});

export const getSubCategoryProductsSchema = joi.object({
  resturantId: joi.custom(ObjectIdValidate).required(),
  subCategoryId: joi.custom(ObjectIdValidate).required(),
});
