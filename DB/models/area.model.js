import { Schema, model } from "mongoose";
const areaSchema = Schema({
  areaNameEN: { type: String, required: true, unique: true },
  areaNameAR: { type: String, required: true, unique: true },
  deliveryFees: { type: Number, required: true },
  areaMap: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});
export const Area = model("Area", areaSchema);
