import { Schema, Types, model } from "mongoose";

const resturantSchema = Schema({
  nameEN: { type: String, required: true },
  nameAR: { type: String, required: true },
  phone: [{ type: String, required: true, unique: true }],
  password: { type: String, required: true },
  owner: { type: String, required: true },
  addressEN: { type: String, required: false },
  addressAR: { type: String, required: false },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  socketId: { type: String },
  area: { type: Types.ObjectId, ref: "Area" },
  category: [{ type: Types.ObjectId, ref: "Category", required: true }],
  subCategories: [
    {
      nameEN: { type: String, required: true },
      nameAR: { type: String, required: true },
    },
  ],
  image: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

export const Resturant = model("Resturant", resturantSchema);
