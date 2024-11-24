import { Order } from "../../../DB/models/order.model.js";
import { Cart } from "../../../DB/models/cart.model.js";
import createInvoice from "../../utils/pdf.js";
import cloudinary from "../../utils/cloudinary.js";
import { User } from "../../../DB/models/user.model.js";
import { Area } from "../../../DB/models/area.model.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { io } from "../../../index.js";
import { Delivery } from "../../../DB/models/delivery.model.js";

//Omar Ahmed Hefnawi -----------------------
import { sendNotification } from "../../../notificationScript.js";
//------------------------

export const createOrder = async (req, res, next) => {
  let isArea = await Area.findById(req.body.area);
  if (!isArea) {
    return next(new Error("Area Not Found"));
  }
  let userCart = await Cart.findOne({ user: req.user._id }).populate([
    {
      path: "products.productId",
      select:
        "resturant prices extra nameAR nameEN descriptionAR descriptionEN",
      populate: {
        path: "resturant",
        select: "nameAR nameEN socketId fbToken",
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
    product.productId.prices = product.productId.prices.filter((price) => {
      return price._id.toString() == product.sizeId.toString();
    });
    product.productId.extra = product.productId.extra.filter((extra) =>
      product.extraId.includes(extra._id.toString())
    );
    return product;
  });

  let data = {
    products: userCart.products,
    totalOrderPrice: userCart.totalPrice,
    deleveryFees: isArea.deliveryFees,
    area: req.body.area,
    customerName: req.user.name,
    phone: req.body.phone,
    address: req.body.address,
    resturants,
    user: req.user._id,
  };

  let order = await Order.create(data);

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
    invoice_nr: order.serialNumber,
  };
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

    order.resturants.map((resturant) => {
      if (resturant.socketId) {
        io.to(resturant.socketId).emit("newResturantOrder", order);
    if(typeof resturant.fbToken !== 'undefined'  && resturant.fbToken !== null){
         console.log("Registration Restaurant Token:", resturant.fbToken);

        sendNotification(resturant.fbToken, {
          title: "New Order",
          body: "New Order From " + data.customerName + " Check It Out",
        });
      }else{
        console.log("Registration Restaurant Token is null or Undefined");
      }
    }
    });

    return res.json({
      success: true,
      message: "Order Created Successfully",
      invoice: order.receipt,
    });
  });
};

export const acceptOrder = async (req, res, next) => {
  let order = await Order.findOne({
    _id: req.params.orderId,
  });
  if (!order) {
    return next(new Error("Order Not Found"));
  }
  if (order.status == "accepted") {
    return next(new Error("Order Is Already Accepted"));
  }
  order.status = "accepted";
  await order.save();
  return res.json({ success: true, message: "Order Accepted" });
};

export const rejectOrder = async (req, res, next) => {
  let order = await Order.findOne({
    _id: req.params.orderId,
  });
  if (!order) {
    return next(new Error("Order Not Found"));
  }
  if (order.status == "rejected") {
    return next(new Error("Order Is Already Rejected"));
  }
  order.status = "rejected";
  await order.save();
  return res.json({ success: true, message: "Order Rejected" });
};

export const orderReady = async (req, res, next) => {
  try {
    let order = await Order.findOne({
      _id: req.params.orderId,
    })
      .sort({ status: -1 })
      .populate([
        {
          path: "resturants",
          select: "-password",
        },

        { path: "products.productId", populate: "resturant" },
      ]);
    if (!order) {
      return next(new Error("Order Not Found"));
    }
    if (order.status == "pending") {
      return next(new Error("Order Is Not Accepted"));
    }
    if (order.status == "ready") {
      return next(new Error("Order Is Already Ready To Deliver"));
    }
    order.status = "ready";
    await order.save();

    let waitingDelivery = await Delivery.find({
      status: "waiting",
    });

    waitingDelivery.map((delivery) => {
      if (delivery.socketId) {
        io.to(delivery.socketId).emit("newReadyOrder", order);

        sendNotification(delivery.fbToken, {
          title: "New Order is Ready To Deliver",
          body: order.resturant.nameEN + " Has New Order",
        });
      }
    });

    return res.json({
      success: true,
      message: "Order Is Ready To Deliver (Sent)",
    });
  } catch (error) {
    return next(error); // Handle unexpected errors
  }
};

export const getResturantPendingOrders = async (req, res, next) => {
  let orders = await Order.find({
    resturants: { $in: req.resturant._id },
    status: "pending",
  })
    .populate(["products.productId"])
    .sort("-createdAt");

  orders.map((order) => {
    order.products.map((orderProduct) => {
      order.products = order.products.map((product) => {
        product.productId.prices = product.productId.prices.filter(
          (price) => price._id.toString() == product.sizeId
        );
        product.productId.extra = product.productId.extra.filter((extra) =>
          product.extraId.includes(extra._id.toString())
        );
        return product;
      });
    });
  });

  return res.json({ success: true, count: orders.length, orders });
};

export const getResturantAcceptedOrders = async (req, res, next) => {
  let orders = await Order.find({
    resturants: { $in: req.resturant._id },
    status: "accepted",
  }).populate(["products.productId"]);
  orders.map((order) => {
    order.products.map((orderProduct) => {
      order.products = order.products.map((product) => {
        product.productId.prices = product.productId.prices.filter(
          (price) => price._id.toString() == product.sizeId
        );
        product.productId.extra = product.productId.extra.filter((extra) =>
          product.extraId.includes(extra._id.toString())
        );
        return product;
      });
    });
  });
  return res.json({ success: true, count: orders.length, orders });
};

export const getResturantOrdersHistory = async (req, res, next) => {
  let orders = await Order.find({
    resturants: { $in: req.resturant._id },
  }).populate(["products.productId"]);

  orders.map((order) => {
    order.products.map((orderProduct) => {
      order.products = order.products.map((product) => {
        product.productId.prices = product.productId.prices.filter(
          (price) => price._id.toString() == product.sizeId
        );
        product.productId.extra = product.productId.extra.filter((extra) =>
          product.extraId.includes(extra._id.toString())
        );
        return product;
      });
    });
  });

  return res.json({ success: true, count: orders.length, orders });
};

export const getAllOrdersHistory = async (req, res, next) => {
  let orders = await Order.find()
    .populate([
      { path: "deliveryWorker", select: "name phone" },
      {
        path: "products.productId",
        select:
          "resturant prices extra nameAR nameEN descriptionAR descriptionEN ",
        populate: {
          path: "resturant",
          select: "nameAR nameEN",
        },
      },
    ])
    .sort("-createdAt");

  let resturants = [];

  orders = orders.map((order) => {
    order.products = order.products.map((product) => {
      if (!resturants.includes(product.productId.resturant))
        resturants.push(product.productId.resturant);

      product.productId.prices = product.productId.prices.filter(
        (price) => price._id.toString() == product.sizeId
      );
      product.productId.extra = product.productId.extra.filter((extra) =>
        product.extraId.includes(extra._id.toString())
      );
      return product;
    });
    order.resturants = resturants;
    return order;
  });

  return res.json({ success: true, count: orders.length, orders });
};

export const getUserOrders = async (req, res, next) => {
  let orders = await Order.find({ user: req.user._id })
    .populate([
      {
        path: "products.productId",
        select:
          "resturant prices extra nameAR nameEN descriptionAR descriptionEN ",
        populate: {
          path: "resturant",
          select: "nameAR nameEN",
        },
      },
    ])
    .sort("-createdAt");

  orders = orders.map((order) => {
    order.products = order.products.map((product) => {
      product.productId.prices = product.productId.prices.filter(
        (price) => price._id.toString() == product.sizeId
      );
      product.productId.extra = product.productId.extra.filter((extra) =>
        product.extraId.includes(extra._id.toString())
      );
      return product;
    });
    return order;
  });

  return res.json({ success: true, count: orders.length, orders });
};

export const verifyOrder = async (req, res, next) => {
  let isOrder = await Order.findOne({ _id: req.params.orderId });
  if (!isOrder) {
    return res.json({ success: false, message: "Order Not Found" });
  }
  if (isOrder.isVerified) {
    return res.json({ success: false, message: "Order Already Verified" });
  }

  if (isOrder.status != "delivered") {
    return res.json({ success: false, message: "Order Is Not Delivered" });
  }

  isOrder.isVerified = true;
  await isOrder.save();

  return res.json({ success: true, message: "Order Verified Successfully" });
};

export const unVerifyOrder = async (req, res, next) => {
  let isOrder = await Order.findOne({ _id: req.params.orderId });
  if (!isOrder) {
    return res.json({ success: false, message: "Order Not Found" });
  }
  if (!isOrder.isVerified) {
    return res.json({ success: false, message: "Order Not Verified" });
  }
  isOrder.isVerified = false;
  await isOrder.save();
  return res.json({ success: true, message: "Order UnVerified Successfully" });
};
