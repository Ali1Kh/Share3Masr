import { Order } from "../../../DB/models/order.model.js";
import { Cart } from "../../../DB/models/cart.model.js";
import createInvoice from "../../utils/pdf.js";

export const createOrder = async (req, res, next) => {
  let userCart = await Cart.findOne({ user: req.user._id }).populate([
    {
      path: "products.productId",
      select:
        "resturant prices extra nameAR  nameEN descriptionAR descriptionEN",
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

  createInvoice(invoice, "invoice.pdf");

  //   await Order.create(data);
  return res.json({
    success: true,
    message: "Order Created Successfully",
    userCart,
  });
};
