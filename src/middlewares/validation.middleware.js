import { Types } from "mongoose";

export const validation = (schema) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    let result = schema.validate(data);
    if (result.error) {
      let errors = result.error.details.map((error) => error.message);
      return next(new Error(errors));
    }
    return next();
  };
};

export const ObjectIdValidate = (val, helper) => {
  if (Types.ObjectId.isValid(val)) return true;
  return helper.message("Invalid Object Id");
};
