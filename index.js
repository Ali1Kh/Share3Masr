import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./DB/connection.js";
import areaRouter from "./src/modules/area/area.router.js";
import userRouter from "./src/modules/user/user.router.js";
import categoriesRouter from "./src/modules/categories/categories.router.js";
import resturantRouter from "./src/modules/resturants/resturants.router.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import deliveryRouter from "./src/modules/delivery/delivery.router.js";
import orderRouter from "./src/modules/orders/order.router.js";
import cors from "cors";
import { verifyToken } from "./src/utils/verifyToken.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { Resturant } from "./DB/models/resturant.model.js";
import { Delivery } from "./DB/models/delivery.model.js";

dotenv.config();
const port = process.env.PORT;
const app = express();

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

try {
  io.on("connection", async (socket) => {
    socket.on("updateSocketId", async (data) => {
      if (!data.token) {
        return new Error("Token Is Required");
      }
      verifyToken(data.token).then(async (payload) => {
        if (!payload) return;
        if (payload.role == "delivery") {
          await Delivery.findByIdAndUpdate(payload.id, { socketId: socket.id });
        } else if (payload.role == "resturant") {
          await Resturant.findByIdAndUpdate(payload.id, { socketId: socket.id });
        }
      });
    });
  });
} catch (error) {
  console.log(error);
}

app.use(cors());
app.use(express.json());
await connectMongo();

app.use("/user", userRouter);
app.use("/area", areaRouter);
app.use("/categories", categoriesRouter);
app.use("/resturants", resturantRouter);
app.use("/products", productRouter);
app.use("/delivery", deliveryRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

app.all("/uptime", (req, res) => {
  console.log("Up Time Requested");
  res.status(200).send("success");
});

app.all("*", (req, res, next) => res.send("Api End Point Not Found"));

app.use((error, req, res, next) => {
  return res.json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

server.listen(port, () => console.log(`App listening on port ${port}!`));
