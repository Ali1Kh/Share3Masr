import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./DB/connection.js";
import areaRouter from "./src/modules/area/area.router.js";
import userRouter from "./src/modules/user/user.router.js";
import categoriesRouter from "./src/modules/categories/categories.router.js";
import resturantRouter from "./src/modules/resturants/resturants.router.js";
import productRouter from "./src/modules/product/product.router.js";
import deliveryRouter from "./src/modules/delivery/delivery.router.js";
import cors from "cors";
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
await connectMongo();

app.use("/user", userRouter);
app.use("/area", areaRouter);
app.use("/categories", categoriesRouter);
app.use("/resturants", resturantRouter);
app.use("/products", productRouter);
app.use("/delivery", deliveryRouter);

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

app.listen(port, () => console.log(`App listening on port ${port}!`));
