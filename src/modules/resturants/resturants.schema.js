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
    ) .messages({ "alternatives.match": "Please enter a valid phone number." })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^.{7,30}$"))
    .messages({
      "string.min": "Password Must Be At least 8 characters.",
    }),
  confirmPass: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm Password is Invaild",
  }),
  address: Joi.string().required(),
  area: Joi.custom(ObjectIdValidate).required(),
  category: Joi.custom(ObjectIdValidate).required(),
  openingTime: Joi.string().required(),
  closingTime: Joi.string().required(),
}).required();
