import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createOrderSchema = Joi.object({
  //   customerName: Joi.string().required(),
  phone: Joi.string()
    .pattern(new RegExp("^01[0125][0-9]{8}$"))
    .required()
    .messages({
      "string.pattern.base": "Invalid Phone Number",
    }),
  address: Joi.string().required(),
});

export const orderIdReqSchema = Joi.object({
  orderId: Joi.custom(ObjectIdValidate).required(),
});

