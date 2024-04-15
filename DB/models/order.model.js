import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        sizeId: { type: Types.ObjectId, ref: "Product.prices", required: true },
        extraId: [
          { type: Types.ObjectId, ref: "Product.extra", required: true },
        ],
        quantity: { type: Number, default: 1, required: true },
        productPrice: { type: Number, required: true },
      },
    ],
    totalOrderPrice: { type: Number, required: true },
    deleveryFees: { type: Number, default: 15 },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "ready", "delivered"],
      default: "pending",
    },
    resturants: [{ type: Types.ObjectId, ref: "Resturant", required: true }],
    receipt: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.virtual("totalPrice").get(function () {
  return Number.parseFloat(this.totalOrderPrice + this.deleveryFees).toFixed(2);
});

export const Order = model("Order", orderSchema);
