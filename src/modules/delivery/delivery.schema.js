import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createDeliverySchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .required()
    .pattern(new RegExp("^01[0125][0-9]{8}$"))
    .messages({ "string.pattern.base": "Please enter a valid phone number." }),
  password: Joi.string()
    .min(5)
    .required()
    .pattern(new RegExp("^.{5,30}$"))
    .messages({
      "string.min": "Password Must Be At least 5 characters.",
    }),
});

export const updateDeliverySchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
  name: Joi.string().required(),
  phone: Joi.string()
    .required()
    .pattern(new RegExp("^01[0125][0-9]{8}$"))
    .messages({ "string.pattern.base": "Please enter a valid phone number." }),
  password: Joi.string().min(5).pattern(new RegExp("^.{5,30}$")).messages({
    "string.min": "Password Must Be At least 5 characters.",
  }),
});

export const idReqSchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
});

export const deliveryLoginSchema = Joi.object({
  phone: Joi.string()
    .required()
    .pattern(new RegExp("^01[0125][0-9]{8}$"))
    .messages({ "string.pattern.base": "Invalid Phone Number" }),
  password: Joi.string()
    .min(5)
    .required()
    .pattern(new RegExp("^.{5,30}$"))
    .messages({
      "string.min": "Invalid Password",
    }),
});
