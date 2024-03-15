import { Schema, model } from "mongoose";
const productSchema = Schema(
  {
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
    resturantCategory: {
      type: Schema.Types.ObjectId,
      ref: "Resturant.subCategories",
      required: true,
    },
    image: {
      secure_url: { type: String, required: false },
      public_id: { type: String, required: false },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


productSchema.virtual("resturantSubCategory", {
  ref: "Resturant",
  localField: "resturantCategory",
  foreignField: "subCategories._id",
});


export const Product = model("Product", productSchema);
