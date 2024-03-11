import { Schema, model } from "mongoose";
const productSchema = Schema({
  name: { type: String, required: true },
  prices: [
    {
      sizeName: { type: String, required: true },
      sizePrice: { type: String, required: true },
    },
  ],
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  resturant: { type: Schema.Types.ObjectId, ref: "Resturant" },
  extra: [
    {
      itemName: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
//   image: {
//     secure_url: { type: String, required: true },
//     public_id: { type: String, required: true },
//   },
});

export const Product = model("Product", productSchema);
