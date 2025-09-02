import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  if (quantity <= 0) return next(new Error("Quantity Must Be Greater Than 0"));

  const isProduct = await Product.findById(productId);
  if (!isProduct) return next(new Error("Product Not Found"));

  if (isProduct.isDeleted) {
    return next(new Error("Product Is Deleted"));
  }

  if (!isProduct.isAvailable) {
    return next(new Error("Product Is Not Available"));
  }

  const isProductSize = isProduct.prices
    .map((item) =>
      item._id.toString() === req.body.sizeId.toString() ? item : null
    )
    .filter((item) => item)[0];

  if (!isProductSize) {
    return next(new Error("Size Not Found"));
  }
  const isExtraIds = [];
  if (req.body.extraIds.length > 0) {
    req.body.extraIds.map((extraItem) => {
      isProduct.extra.map((item) =>
        extraItem.toString() == item._id ? isExtraIds.push(item) : null
      );
    });
    if (isExtraIds.length <= 0) {
      return next(new Error("Extra Not Found"));
    }
  }

  let extraPrices = isExtraIds.map((extra) => extra.price);

  let totalExtraPrice =
    extraPrices.length > 1
      ? extraPrices.reduce((pv, cv) => {
          return Number(pv) + Number(cv);
        }, 0)
      : extraPrices.length == 1
      ? extraPrices[0]
      : 0;

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
      userCart.totalPrice +=
        Number(isProductSize.sizePrice) * quantity +
        Number(totalExtraPrice) * quantity;
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
          totalExtraPrice,
        },
      },
      $inc: {
        totalPrice:
          (Number(isProductSize.sizePrice) + Number(totalExtraPrice)) *
          Number(quantity),
      },
    }
  );

  return res.json({ success: true, message: "Add To Cart Successfully" });
};

export const getCart = async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "products.productId",
    select: "descriptionEN prices extra descriptionAR nameAR nameEN image",
  });
  let products = cart.products.map((cartProduct) => {
    let product = cartProduct.toObject();
    product.productId.prices = product.productId.prices.filter(
      (price) => price._id.toString() == product.sizeId
    );
    product.productId.extra = product.productId.extra.filter((extra) =>
      product.extraId.includes(extra._id.toString())
    );
    product.image = product.productId.image.secure_url;
    return product;
  });

  let cartDisplay = {
    ...cart.toObject(),
    products,
  };

  return res.json({ success: true, cart: cartDisplay });
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
        totalPrice:
          -(productInCart[0].productPrice * productInCart[0].quantity) -
          productInCart[0].totalExtraPrice * productInCart[0].quantity,
      },
    }
  );

  return res.json({ success: true, message: "Deleted From Cart Successfully" });
};
