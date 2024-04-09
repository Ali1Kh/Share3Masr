import { Order } from "../../../DB/models/order.model.js";
import { Cart } from "../../../DB/models/cart.model.js";
import createInvoice from "../../utils/pdf.js";
import cloudinary from "../../utils/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createOrder = async (req, res, next) => {
  let userCart = await Cart.findOne({ user: req.user._id }).populate([
    {
      path: "products.productId",
      select:
        "resturant prices extra nameAR nameEN descriptionAR descriptionEN",
      populate: {
        path: "resturant",
        select: "nameAR nameEN",
      },
    },
  ]);

  if (userCart.products.length <= 0) {
    return next(new Error("Cart Is Empty"));
  }

  let resturants = [];
  userCart.products.map((product) => {
    if (!resturants.includes(product.productId.resturant))
      resturants.push(product.productId.resturant);
  });

  userCart.products = userCart.products.map((product) => {
    product.productId.prices = product.productId.prices.filter(
      (price) => price._id.toString() == product.sizeId
    );
    product.productId.extra = product.productId.extra.filter((extra) =>
      product.extraId.includes(extra._id.toString())
    );
    return product;
  });

  let data = {
    products: userCart.products,
    totalOrderPrice: userCart.totalPrice,
    deleveryFees: 15,
    customerName: req.user.name,
    phone: req.body.phone,
    address: req.body.address,
    resturants,
    user: req.user._id,
  };

  // Create Invoice
  const invoice = {
    shipping: {
      name: data.customerName,
      address: data.address,
      phone: data.phone,
    },
    items: data.products,
    orderPrice: data.totalOrderPrice,
    deleveryFees: data.deleveryFees,
    total: data.totalOrderPrice + data.deleveryFees,
    invoice_nr: 1234,
  };

  let order = await Order.create(data);

  createInvoice(invoice, `invoices${order._id}.pdf`).then(async () => {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      `invoices${order._id}.pdf`,
      {
        folder: `Share3Masr/Invoices/${req.user._id}/${order._id}`,
      }
    );
    order.receipt = {
      secure_url,
      public_id,
    };


    await order.save();
    userCart.products = [];
    userCart.totalPrice = 0;
    await userCart.save();
    return res.json({
      success: true,
      message: "Order Created Successfully",
      invoice: order.receipt,
    });
  });

};