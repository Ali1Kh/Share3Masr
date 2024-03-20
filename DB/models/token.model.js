import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    customer: { type: Types.ObjectId, ref: "User" },
    resturant: { type: Types.ObjectId, ref: "Resturant" },
    delivery: { type: Types.ObjectId, ref: "Delivery" },
    admin: { type: Types.ObjectId, ref: "User" },
    isValid: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["customer", "resturant", "delivery", "admin"],
    },
    agent: String,
    expiredAt: Date,
  },
  { timestamps: true }
);

export const Token = model("Token", tokenSchema);
