import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createResturantSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.string()
          .pattern(new RegExp("^01[0125][0-9]{8}$"))
          .required()
          .messages({ "any.required": "Please enter a valid phone number." }),
        Joi.string()
          .length(8)
          .required()
          .messages({ "any.required": "Please enter a valid phone number." })
      )
    )
    .messages({ "alternatives.match": "Please enter a valid phone number." })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^.{5,30}$"))
    .messages({
      "string.min": "Password Must Be At least 5 characters.",
    }),
  address: Joi.string(),
  owner: Joi.string().required(),

  area: Joi.custom(ObjectIdValidate),
  category: Joi.array()
    .items(Joi.custom(ObjectIdValidate).required())
    .required(),
  subCategories: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
    }).required()
  ),
  openingTime: Joi.string().required(),
  closingTime: Joi.string().required(),
}).required();

export const deleteResturantSchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
}).required();
