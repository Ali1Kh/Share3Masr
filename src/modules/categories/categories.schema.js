import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const createCategorySchema = Joi.object({
  categoryName: Joi.string().required(),
}).required();
