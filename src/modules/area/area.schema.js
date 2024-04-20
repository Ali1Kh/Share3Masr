import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createAreaSchema = Joi.object({
  areaNameEN: Joi.string().required(),
  areaNameAR: Joi.string().required(),
  deliveryFees: Joi.number().required(),
}).required();

export const updateAreaSchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
  areaNameEN: Joi.string().required(),
  areaNameAR: Joi.string().required(),
  deliveryFees: Joi.number().required(),
}).required();

export const deleteAreaSchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
}).required();
