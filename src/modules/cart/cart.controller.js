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

  if (req.body.extraIds.length > 0) {
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
  }

  let userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) userCart = await Cart.create({ user: req.user._id });

  let productIsInCart = false;
  userCart.products.forEach((product, idx) => {
    if (
      product.productId.toString() === productId &&
      product.sizeId.toString() === req.body.sizeId &&
      product.extraId.toString() === req.body.extraIds.toString()
    ) {
      userCart.products[idx].quantity += quantity;
      userCart.totalPrice += isProductSize.sizePrice * quantity;
      productIsInCart = true;
    }
  });

  if (productIsInCart) {
    await userCart.save();
    return res.json({
      success: true,
      message: "Quantity Updated Successfully",
    });
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
          productPrice: isProductSize.sizePrice,
        },
      },
      $inc: { totalPrice: isProductSize.sizePrice * quantity },
    }
  );

  return res.json({ success: true, message: "Add To Cart Successfully" });
};

export const getCart = async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  return res.json({ success: true, cart });
};

export const deleteFromCart = async (req, res, next) => {
  let isProduct = await Product.findById(req.params.productId);
  if (!isProduct) return next(new Error("Product Not Found"));

  let userCart = await Cart.findOne({ user: req.user._id });

  let productInCart = userCart.products.filter(
    (product) => product.productId.toString() == req.params.productId
  );

  if (productInCart.length <= 0)
    return next(new Error("Product Not Found In Cart"));

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        products: {
          productId: req.params.productId,
        },
      },
      $inc: {
        totalPrice: -productInCart[0].productPrice,
      },
    }
  );

  return res.json({ success: true, message: "Deleted From Cart Successfully" });
};
