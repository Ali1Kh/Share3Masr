import { Schema, Types, model } from "mongoose";

const resturantSchema = Schema({
  name: { type: String, required: true },
  phone: [{ type: String, required: true, unique: true }],
  password: { type: String, required: true },
  address: { type: String, required: true },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  image: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});

export const Resturant = model("Resturant", resturantSchema);
