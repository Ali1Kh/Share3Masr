import Joi from "joi";
import { ObjectIdValidate } from "../../middlewares/validation.middleware.js";

export const signUpSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .min(11)
    .max(11)
    .pattern(new RegExp("^01[0125][0-9]{8}$"))
    .required()
    .messages({
      "string.min": "Phone Number Cannot be less than 11 Characters",
      "string.max": "Phone Number Cannot be more than 11 Characters",
      "string.pattern.base": "Please Enter Vaild Phone Number",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Please Enter A Valid Email",
  }),
  password: Joi.string()
    .min(4)
    .required()
    .pattern(new RegExp("^.{4,30}$"))
    .messages({
      "string.pattern.base": "Password Must Start With Letter",
      "string.min": "Password Must Be At least 4 characters.",
    }),
  confirmPass: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm Password is Invaild",
  }),
  area: Joi.custom(ObjectIdValidate).required(),
}).required();

export const loginSchema = Joi.object({
  // email: Joi.string().email().required().messages({
  //   "string.email": "Invalid Email",
  // }),
  // password: Joi.string().required(),
  phone: Joi.string().required(),
}).required();

export const updateSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string()
    .min(11)
    .max(11)
    .pattern(new RegExp("^01[0125][0-9]{8}$"))
    
    .messages({
      "string.min": "Phone Number Cannot be less than 11 Characters",
      "string.max": "Phone Number Cannot be more than 11 Characters",
      "string.pattern.base": "Please Enter Vaild Phone Number",
    }),
  email: Joi.string().email().messages({
    "string.email": "Please Enter A Valid Email",
  }),
  password: Joi.string()
    .min(4)
    
    .pattern(new RegExp("^.{4,30}$"))
    .messages({
      "string.pattern.base": "Password Must Start With Letter",
      "string.min": "Password Must Be At least 4 characters.",
    }),
  confirmPass: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Confirm Password is Invaild",
  }).when("password", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  area: Joi.custom(ObjectIdValidate),
}).required();


export const adminLoginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
}).required();
