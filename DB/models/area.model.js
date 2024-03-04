import { Schema, model } from "mongoose";
const areaSchema = Schema({
  areaName: { type: String, required: true , unique: true},
});
export const Area = model("Area", areaSchema);
