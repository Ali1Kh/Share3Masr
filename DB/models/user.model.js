import { Schema, Types, model } from "mongoose";

const userSchema = Schema({
  name: { type: String, required: true },
  area: { type: Types.ObjectId, ref: "Area" },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  //   image: { secure_url: { type: String, required: true } , public_id: { type: String, required: true } },
});

export const User = model("User", userSchema);
