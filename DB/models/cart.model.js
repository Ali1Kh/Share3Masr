import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        sizeId: { type: Types.ObjectId, ref: "Product.prices" },
        extraId: [{ type: Types.ObjectId, ref: "Product.extra" }],
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number },
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Cart = model("Cart", cartSchema);
