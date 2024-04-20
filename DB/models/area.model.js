import { Schema, model } from "mongoose";
const areaSchema = Schema({
  areaNameEN: { type: String, required: true , unique: true},
  areaNameAR: { type: String, required: true , unique: true},
  deliveryFees: { type: Number, required: true },
});
export const Area = model("Area", areaSchema);
