import { Schema, model } from "mongoose";
const productSchema = Schema(
  {
    nameEN: { type: String, required: true },
    nameAR: { type: String, required: true },
    prices: [
      {
        sizeNameEN: { type: String, required: true },
        sizeNameAR: { type: String, required: true },
        sizePrice: { type: String, required: true },
      },
    ],
    descriptionEN: { type: String, required: true },
    descriptionAR: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    resturant: { type: Schema.Types.ObjectId, ref: "Resturant" },
    discount: { type: Number, default: 0, min: 0, max: 100, required: false },
    extra: [
      {
        itemNameEN: { type: String, required: true },
        itemNameAR: { type: String, required: true },
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
    isAvailable: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strictQuery: true,
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
