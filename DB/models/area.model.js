import { Schema, model } from "mongoose";
const areaSchema = Schema({
  areaNameEN: { type: String, required: true , unique: true},
  areaNameAR: { type: String, required: true , unique: true},
});
export const Area = model("Area", areaSchema);
