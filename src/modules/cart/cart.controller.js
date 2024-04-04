import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  if (quantity <= 0) return next(new Error("Quantity Must Be Greater Than 0"));

  const isProduct = await Product.findById(productId);
  if (!isProduct) return next(new Error("Product Not Found"));

  const isProductSize = isProduct.prices.map((item) =>
    item._id.toString() === req.body.sizeId ? item : null
  )[0];

  if (!isProductSize) {
    return next(new Error("Size Not Found"));
  }

  const isExtraIds = [];
  req.body.extraIds.map((extraItem) => {
    const extra = isProduct.extra.some(
      (item) => extraItem.toString() == item._id
    );
    if (extra) {
      isExtraIds.push(extra);
    }
  });
  if (isExtraIds.length <= 0) {
    return next(new Error("Extra Not Found"));
  }
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $push: {
        products: {
          productId,
          sizeId: req.body.sizeId,
          extraId: req.body.extraIds,
          quantity,
        },
      },
      totalPrice: isProductSize.sizePrice * quantity,
    }
  );

  return res.json({ success: true, message: "Add To Cart Successfully" });
};
