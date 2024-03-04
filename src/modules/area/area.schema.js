import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createAreaSchema = Joi.object({
  areaName: Joi.string().required(),
}).required();

export const updateAreaSchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
  areaName: Joi.string().required(),
}).required();

export const deleteAreaSchema = Joi.object({
  id: Joi.custom(ObjectIdValidate).required(),
}).required();
