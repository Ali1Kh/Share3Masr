import { Schema, model } from "mongoose";
const categorySchema = Schema({
  categoryNameEN: { type: String, required: true, unique: true },
  categoryNameAR: { type: String, required: true, unique: true },
  image: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});
export const Category = model("Category", categorySchema);
